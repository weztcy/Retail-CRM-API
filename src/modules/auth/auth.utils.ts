import bcrypt from "bcrypt";




// =========================
// BCRYPT CONFIG
// =========================

const SALT_ROUNDS =
  Number(
    process.env.BCRYPT_ROUNDS
    ||
    10
  );






// =========================
// HASH PASSWORD
// =========================

export async function hashPassword(

  password:string,

):Promise<string> {


  return await bcrypt.hash(

    password,

    SALT_ROUNDS,

  );


}






// =========================
// COMPARE PASSWORD
// =========================

export async function comparePassword(

  password:string,

  passwordHash:string,

):Promise<boolean> {


  return await bcrypt.compare(

    password,

    passwordHash,

  );


}