import {
  unlink,
} from "fs/promises";

import path from "path";


// =========================
// DELETE USER IMAGE
// =========================

export async function deleteUserImage(

  imageUrl?: string | null

) {


  if(
    !imageUrl
  ){

    return;

  }



  const imagePath =

    path.join(

      process.cwd(),

      "public",

      imageUrl

    );



  try {


    await unlink(
      imagePath
    );


  } catch(error){


    console.log(
      "Gagal hapus user image:",
      error
    );


  }


}