import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import bcrypt from "bcrypt";


const adapter = new PrismaMariaDb({

  host: "localhost",

  port: 3306,

  user: "root",

  password: "",

  database: "retailcrm",

});


const prisma = new PrismaClient({
  adapter,
});


async function main() {

  const passwordHash = await bcrypt.hash(
    "Admin123!",
    10
  );


  const user = await prisma.user.upsert({

    where: {
      email: "admin@retailcrm.com",
    },


    update: {},


    create: {

      name: "Super Admin",

      email: "admin@retailcrm.com",

      passwordHash,

      role: "SUPER_ADMIN",

      isActive: true,

    },

  });


  console.log(
    "Admin created:",
    user.email
  );

}


main()

  .catch((error) => {

    console.error(error);

    process.exit(1);

  })

  .finally(async () => {

    await prisma.$disconnect();

  });