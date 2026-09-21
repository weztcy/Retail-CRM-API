import bcrypt from "bcrypt";



// =========================
// HASH PASSWORD
// =========================

export async function hashPassword(
  password: string
) {


  return await bcrypt.hash(

    password,

    10

  );


}



// =========================
// COMPARE PASSWORD
// =========================

export async function comparePassword(
  password: string,
  passwordHash: string
) {


  return await bcrypt.compare(

    password,

    passwordHash

  );


}