import {
  successResponse,
  handleError,
} from "@/utils/response";


import {
  validate,
} from "@/validations/validate";


import {
  loginSchema,
} from "@/modules/auth/auth.validation";


import {
  findUserByEmail,
} from "@/modules/auth/auth.service";


import {
  generateAccessToken,
  generateRefreshToken,
} from "@/modules/auth/jwt.utils";

import {
  comparePassword,
} from "@/modules/auth/auth.utils";


import {
  prisma,
} from "@/lib/prisma";


import {
  ApiError,
} from "@/utils/errors/api-error";



// =========================
// LOGIN
// =========================

export async function POST(
  request: Request
) {


  try {


    const body =
      await request.json();



    const data =
      validate(
        loginSchema,
        body
      );



    const user =
      await findUserByEmail(
        data.email
      );



    if (!user) {


      throw new ApiError(

        "Email atau password salah",

        401

      );


    }



    // =========================
    // CHECK USER ACTIVE
    // =========================

    if (!user.isActive) {


      throw new ApiError(

        "User tidak aktif",

        403

      );


    }



    // =========================
    // CHECK PASSWORD
    // =========================

    const validPassword =
      await comparePassword(

        data.password,

        user.passwordHash

      );



    if (!validPassword) {


      throw new ApiError(

        "Email atau password salah",

        401

      );


    }



    // =========================
    // JWT PAYLOAD
    // =========================

    const payload = {

      id:
        user.id,


      email:
        user.email,


      role:
        user.role,

    };




    // =========================
    // CREATE TOKENS
    // =========================

    const accessToken =
      await generateAccessToken(
        payload
      );



    const refreshToken =
      await generateRefreshToken(
        payload
      );





    // =========================
    // SAVE REFRESH TOKEN
    // =========================

    await prisma.refreshToken.create({

      data: {


        userId:
          user.id,


        token:
          refreshToken,


        expiresAt:

          new Date(

            Date.now()

            +

            7 *

            24 *

            60 *

            60 *

            1000

          ),


      },

    });





    return successResponse(

      {

        user: {


          id:
            user.id,


          name:
            user.name,


          email:
            user.email,


          role:
            user.role,


        },


        accessToken,


        refreshToken,


      },


      "Login berhasil"

    );




  } catch(error) {


    return handleError(error);


  }


}