import { PrismaClient } from "@/generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";


const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined;
};


const adapter = new PrismaMariaDb({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "retailcrm",
});


export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
  });


if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}