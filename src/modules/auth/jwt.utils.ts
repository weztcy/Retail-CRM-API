import {
  SignJWT,
  jwtVerify,
} from "jose";



const JWT_SECRET =
  process.env.JWT_SECRET;



if (!JWT_SECRET) {

  throw new Error(
    "JWT_SECRET belum tersedia"
  );

}



const secret =
  new TextEncoder()
    .encode(
      JWT_SECRET
    );




// =========================
// GENERATE ACCESS TOKEN
// =========================

export async function generateAccessToken(
  payload: Record<string, unknown>
) {


  return await new SignJWT(payload)

    .setProtectedHeader({

      alg: "HS256",

    })

    .setExpirationTime(

      process.env.JWT_ACCESS_EXPIRE
      ||
      "15m"

    )

    .setIssuedAt()

    .sign(secret);


}





// =========================
// GENERATE REFRESH TOKEN
// =========================

export async function generateRefreshToken(
  payload: Record<string, unknown>
) {


  return await new SignJWT(payload)

    .setProtectedHeader({

      alg: "HS256",

    })

    .setExpirationTime(

      process.env.JWT_REFRESH_EXPIRE
      ||
      "7d"

    )

    .setIssuedAt()

    .sign(secret);


}





// =========================
// VERIFY TOKEN
// =========================

export async function verifyToken(
  token:string
) {


  const {
    payload
  } = await jwtVerify(

    token,

    secret

  );


  return payload;


}