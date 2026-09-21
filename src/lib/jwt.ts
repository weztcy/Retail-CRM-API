import jwt from "jsonwebtoken";


const JWT_SECRET =
  process.env.JWT_SECRET!;


const JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET!;




export function generateAccessToken(
  payload: {
    id: string;
    role: string;
  }
) {


  return jwt.sign(

    payload,

    JWT_SECRET,

    {
      expiresIn: "15m",
    }

  );

}





export function generateRefreshToken(
  payload: {
    id: string;
  }
) {


  return jwt.sign(

    payload,

    JWT_REFRESH_SECRET,

    {
      expiresIn: "7d",
    }

  );

}