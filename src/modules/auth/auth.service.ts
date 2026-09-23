import { prisma } from "@/lib/prisma";


import {
  generateAccessToken,
  generateRefreshToken,
} from "./jwt.utils";


import type {
  UserTokenPayload,
  CustomerTokenPayload,
} from "./jwt.utils";


import {
  comparePassword,
  hashPassword,
} from "./auth.utils";


import {
  ApiError,
} from "@/utils/errors/api-error";

import type {
  RegisterCustomerInput,
} from "./auth.types";


// =========================
// SAVE REFRESH TOKEN
// =========================

async function saveRefreshToken({

  userId,

  customerId,

  token,

}:{

  userId?:string;

  customerId?:string;

  token:string;

}) {


  const expiresDays =
    Number(
      process.env.JWT_REFRESH_DAYS || 7
    );


  return await prisma.refreshToken.create({

    data:{


      ...(userId && {
        userId,
      }),


      ...(customerId && {
        customerId,
      }),


      token,


      expiresAt:

        new Date(

          Date.now()

          +

          expiresDays *

          24 *

          60 *

          60 *

          1000

        ),

    },

  });


}






// =========================
// FIND USER BY EMAIL
// =========================

export async function findUserByEmail(

  email:string,

) {


  return await prisma.user.findUnique({

    where:{

      email,

    },

  });

}






// =========================
// LOGIN USER
// =========================

export async function login(

  email:string,

  password:string,

) {


  const user =
    await findUserByEmail(

      email,

    );



  if(!user) {

    throw new ApiError(

      "Email atau password salah",

      401,

    );

  }




  if(!user.isActive) {


    throw new ApiError(

      "User tidak aktif",

      403,

    );

  }




  const validPassword =
    await comparePassword(

      password,

      user.passwordHash,

    );



  if(!validPassword) {


    throw new ApiError(

      "Email atau password salah",

      401,

    );

  }





  const payload:UserTokenPayload = {


    id:user.id,


    type:"USER",


    email:user.email,


    role:user.role,


  };





  const accessToken =
    await generateAccessToken(

      payload,

    );



  const refreshToken =
    await generateRefreshToken(

      payload,

    );





  await saveRefreshToken({

    userId:user.id,

    token:refreshToken,

  });






  return {


    accessToken,


    refreshToken,



    user:{


      id:user.id,


      name:user.name,


      email:user.email,


      imageUrl:user.imageUrl,


      role:user.role,


      isActive:user.isActive,


    },


  };


}








// =========================
// FIND CUSTOMER BY EMAIL
// =========================

export async function findCustomerByEmail(

  email:string,

) {

  return await prisma.customer.findUnique({

    where:{
      email,
    },

  });


}






// =========================
// LOGIN CUSTOMER
// =========================

export async function loginCustomer(

  email:string,

  password:string,

) {


  const customer =
  await findCustomerByEmail(
    email,
  );



  if(!customer) {


    throw new ApiError(

      "Email atau nomor HP salah",

      401,

    );

  }





  if(!customer.isActive) {


    throw new ApiError(

      "Customer tidak aktif",

      403,

    );

  }





  const validPassword =
    await comparePassword(

      password,

      customer.passwordHash,

    );



  if(!validPassword) {


    throw new ApiError(

      "Password salah",

      401,

    );

  }





  const payload:CustomerTokenPayload = {


    id:customer.id,


    type:"CUSTOMER",


    phone:customer.phone,

    email:customer.email,


  };





  const accessToken =
    await generateAccessToken(

      payload,

    );



  const refreshToken =
    await generateRefreshToken(

      payload,

    );





  await saveRefreshToken({

    customerId:customer.id,

    token:refreshToken,

  });







  return {


    accessToken,


    refreshToken,



    customer:{


      id:customer.id,


      customerCode:customer.customerCode,


      name:customer.name,


      phone:customer.phone,


      email:customer.email,


      imageUrl:customer.imageUrl,


      membership:customer.membership,


    },


  };


}

// =========================
// REFRESH SESSION
// =========================

export async function refreshSession(

  refreshToken:string,

) {


  const storedToken =
    await prisma.refreshToken.findUnique({

      where:{
        token:refreshToken,
      },

    });



  if(!storedToken) {


    throw new ApiError(

      "Refresh token tidak ditemukan",

      401,

    );


  }





  // =========================
  // CHECK TOKEN EXPIRED
  // =========================

  if(
    storedToken.expiresAt < new Date()
  ) {


    await prisma.refreshToken.delete({

      where:{
        id:storedToken.id,
      },

    });



    throw new ApiError(

      "Refresh token expired",

      401,

    );


  }





  let payload:
    UserTokenPayload |
    CustomerTokenPayload;





  // =========================
  // USER TOKEN
  // =========================

  if(
    storedToken.userId
  ) {


    const user =
      await prisma.user.findUnique({

        where:{
          id:storedToken.userId,
        },

      });



    if(
      !user ||
      !user.isActive
    ) {


      throw new ApiError(

        "User tidak aktif",

        403,

      );


    }



    payload = {


      id:user.id,


      type:"USER",


      email:user.email,


      role:user.role,


    };


  }






  // =========================
  // CUSTOMER TOKEN
  // =========================

  else if(
    storedToken.customerId
  ) {


    const customer =
      await prisma.customer.findUnique({

        where:{
          id:storedToken.customerId,
        },

      });



    if(
      !customer ||
      !customer.isActive
    ) {


      throw new ApiError(

        "Customer tidak aktif",

        403,

      );


    }



    payload = {


      id:customer.id,


      type:"CUSTOMER",


      phone:customer.phone,


      email:customer.email,


    };


  }




  else {


    throw new ApiError(

      "Refresh token tidak valid",

      401,

    );


  }





  // =========================
  // TOKEN ROTATION
  // =========================

  await prisma.refreshToken.delete({

    where:{
      id:storedToken.id,
    },

  });





  const accessToken =
    await generateAccessToken(

      payload,

    );



  const newRefreshToken =
    await generateRefreshToken(

      payload,

    );





  await saveRefreshToken({

    userId:
      storedToken.userId
      ??
      undefined,


    customerId:
      storedToken.customerId
      ??
      undefined,


    token:
      newRefreshToken,


  });





  return {


    accessToken,


    refreshToken:
      newRefreshToken,


  };


}

// =========================
// REGISTER CUSTOMER
// =========================

export async function registerCustomer(

  data:RegisterCustomerInput,

) {


  const existingCustomer =
    await prisma.customer.findFirst({

      where:{

        OR:[

          {
            email:data.email,
          },


          {
            phone:data.phone,
          },


        ],

      },

    });



  if(existingCustomer){


    throw new ApiError(

      "Email atau nomor HP sudah digunakan",

      409,

    );


  }





  const passwordHash =
    await hashPassword(

      data.password,

    );





  const customer =
    await prisma.customer.create({

      data:{


        customerCode:

          `CUS-${Date.now()}`,



        name:

          data.name,



        email:

          data.email,



        phone:

          data.phone,



        passwordHash,



        imageUrl:

          data.imageUrl,



        gender:

          data.gender,



        birthDate:

          data.birthDate

          ?

          new Date(data.birthDate)

          :

          undefined,



        address:

          data.address,



        city:

          data.city,



        membership:

          "BRONZE",




        loyalty:{

          create:{

            points:0,

          },

        },


      },



      select:{


        id:true,


        customerCode:true,


        name:true,


        email:true,


        phone:true,


        imageUrl:true,


        membership:true,


        createdAt:true,


      },


    });





  return customer;


}

// =========================
// LOGOUT
// =========================

export async function logout(
  refreshToken:string,
) {


  const token =
    await prisma.refreshToken.findUnique({

      where:{
        token:refreshToken,
      },

    });



  if(!token){

    throw new ApiError(

      "Refresh token tidak ditemukan",

      404,

    );

  }




  await prisma.refreshToken.delete({

    where:{
      token:refreshToken,
    },

  });



  return true;


}