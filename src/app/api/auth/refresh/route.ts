import {
  successResponse,
  handleError,
} from "@/utils/response";


import {
  validate,
} from "@/validations/validate";


import {
  refreshTokenSchema,
} from "@/modules/auth/auth.validation";


import {
  verifyToken,
  generateAccessToken,
} from "@/modules/auth/jwt.utils";


import {
  prisma,
} from "@/lib/prisma";


import {
  ApiError,
} from "@/utils/errors/api-error";




// =========================
// REFRESH TOKEN
// =========================

export async function POST(
  request: Request
) {


  try {


    const body =
      await request.json();



    const data =
      validate(

        refreshTokenSchema,

        body

      );



    // =========================
    // VERIFY JWT REFRESH TOKEN
    // =========================

    const payload =
      await verifyToken(

        data.refreshToken

      );



    if (!payload.id) {


      throw new ApiError(

        "Refresh token tidak valid",

        401

      );


    }



    // =========================
    // CHECK TOKEN DATABASE
    // =========================

    const storedToken =
      await prisma.refreshToken.findUnique({

        where: {

          token:
            data.refreshToken,

        },


      });



    if (!storedToken) {


      throw new ApiError(

        "Refresh token tidak ditemukan",

        401

      );


    }



    // =========================
    // CHECK USER
    // =========================

    const user =
      await prisma.user.findUnique({

        where: {

          id:
            payload.id as string,

        },

      });



    if (!user) {


      throw new ApiError(

        "User tidak ditemukan",

        404

      );


    }



    if (!user.isActive) {


      throw new ApiError(

        "User tidak aktif",

        403

      );


    }



    // =========================
    // CREATE NEW ACCESS TOKEN
    // =========================

    const accessToken =
      await generateAccessToken({

        id:
          user.id,


        email:
          user.email,


        role:
          user.role,

      });



    return successResponse(

      {

        accessToken,

      },

      "Access token berhasil diperbarui"

    );



  } catch(error) {


    return handleError(error);


  }


}