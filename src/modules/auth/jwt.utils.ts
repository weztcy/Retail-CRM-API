import {
  SignJWT,
  jwtVerify,
  JWTPayload,
} from "jose";


import type {
  Role,
} from "@/generated/prisma/client";



// =========================
// JWT TYPES
// =========================


export interface UserTokenPayload 
extends JWTPayload {


  id:string;


  type:"USER";


  email:string;


  role:Role;


}



export interface CustomerTokenPayload 
extends JWTPayload {


  id:string;

  type:"CUSTOMER";

  phone:string;

  email:string | null;
}



export type AuthTokenPayload =

  | UserTokenPayload

  | CustomerTokenPayload;





// =========================
// JWT SECRET
// =========================


const JWT_SECRET =
  process.env.JWT_SECRET;



if(!JWT_SECRET){


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

  payload:AuthTokenPayload

):Promise<string>{



  return await new SignJWT(

    payload

  )


  .setProtectedHeader({

    alg:"HS256",

  })


  .setIssuedAt()



  .setExpirationTime(

    process.env.JWT_ACCESS_EXPIRE

    ||

    "15m"

  )



  .sign(secret);



}






// =========================
// GENERATE REFRESH TOKEN
// =========================


export async function generateRefreshToken(

  payload:AuthTokenPayload

):Promise<string>{



  return await new SignJWT(

    payload

  )


  .setProtectedHeader({

    alg:"HS256",

  })


  .setIssuedAt()



  .setExpirationTime(

    process.env.JWT_REFRESH_EXPIRE

    ||

    "7d"

  )



  .sign(secret);



}






// =========================
// VERIFY TOKEN
// =========================


export async function verifyToken(

  token:string

):Promise<AuthTokenPayload>{



  const {

    payload

  } = await jwtVerify(


    token,


    secret


  );



  return payload as AuthTokenPayload;



}