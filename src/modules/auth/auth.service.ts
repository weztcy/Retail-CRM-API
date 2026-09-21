import { prisma } from "@/lib/prisma";


import {
  generateAccessToken,
  generateRefreshToken,
} from "./jwt.utils";

import {
  comparePassword,
} from "./auth.utils";

import {
  ApiError,
} from "@/utils/errors/api-error";



// =========================
// FIND USER BY EMAIL
// =========================

export async function findUserByEmail(
  email:string
) {


  return await prisma.user.findUnique({

    where: {

      email,

    },

  });


}



// =========================
// LOGIN
// =========================

export async function login(
  email:string,
  password:string
) {


  const user =
    await findUserByEmail(
      email
    );



  if (!user) {

    throw new ApiError(
      "Email atau password salah",
      401
    );

  }



  if (!user.isActive) {

    throw new ApiError(
      "User tidak aktif",
      403
    );

  }



  const validPassword =
    await comparePassword(
      password,
      user.passwordHash
    );



  if (!validPassword) {

    throw new ApiError(
      "Email atau password salah",
      401
    );

  }



  const accessToken =
    await generateAccessToken({

      id:user.id,

      email:user.email,

      role:user.role,

    });



  const refreshToken =
    await generateRefreshToken({

      id:user.id,

      email:user.email,

      role:user.role,

    });



  await prisma.refreshToken.create({

    data: {

      userId:user.id,

      token:refreshToken,

      expiresAt:
        new Date(
          Date.now()
          +
          7 * 24 * 60 * 60 * 1000
        ),

    },

  });



  return {

    accessToken,

    refreshToken,


    user: {

      id:user.id,

      name:user.name,

      email:user.email,

      role:user.role,

    },

  };


}