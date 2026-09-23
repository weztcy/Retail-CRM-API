import {
  PrismaClient,
  Prisma,
  Role,
  Gender,
  MembershipLevel,
  PaymentMethod,
  PaymentStatus,
  TransactionStatus,
  InventoryType,
  ActivityType,
  ActivityStatus,
  LoyaltyHistoryType,
  type User,
  type Product,
  type Customer,
  type Transaction,
} from "../src/generated/prisma/client"

import { PrismaMariaDb } from "@prisma/adapter-mariadb"

import bcrypt from "bcrypt"
import crypto from "crypto"

const adapter = new PrismaMariaDb({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "retailcrm",
})

const prisma = new PrismaClient({
  adapter,
})

const USER_IMAGES = [
  "/uploads/users/user-1.jpg",
  "/uploads/users/user-2.jpg",
  "/uploads/users/user-3.jpg",
  "/uploads/users/user-4.jpg",
]

const CUSTOMER_IMAGES = [
  "/uploads/customers/customer-1.jpg",
  "/uploads/customers/customer-2.jpg",
  "/uploads/customers/customer-3.jpg",
  "/uploads/customers/customer-4.jpg",
  "/uploads/customers/customer-5.jpg",
]

const PRODUCT_IMAGES = [
  "/uploads/products/product-1.jpg",
  "/uploads/products/product-2.jpg",
  "/uploads/products/product-3.jpg",
  "/uploads/products/product-4.jpg",
  "/uploads/products/product-5.jpg",
]

const START_DATE = new Date("2025-01-01T00:00:00.000Z")
const END_DATE = new Date("2026-09-30T23:59:59.000Z")

const FIRST_NAMES = [
  "Ahmad",
  "Budi",
  "Citra",
  "Dewi",
  "Eka",
  "Fajar",
  "Gita",
  "Hendra",
  "Intan",
  "Joko",
  "Kartika",
  "Lestari",
  "Maya",
  "Nanda",
  "Putri",
  "Rizky",
  "Salsa",
  "Teguh",
  "Vina",
  "Yoga",
]

const LAST_NAMES = [
  "Saputra",
  "Pratama",
  "Permata",
  "Nugroho",
  "Wijaya",
  "Sari",
  "Utami",
  "Susanto",
  "Ramadhan",
  "Maulana",
  "Kusuma",
  "Wardani",
  "Fauziah",
  "Halim",
  "Anggraini",
]

const CITIES = [
  "Jakarta",
  "Bandung",
  "Semarang",
  "Surabaya",
  "Yogyakarta",
  "Solo",
  "Malang",
  "Bekasi",
  "Depok",
  "Bogor",
]

const PRODUCT_CATEGORIES = [
  "Electronics",
  "Fashion",
  "Accessories",
  "Beauty",
  "Home Living",
  "Sports",
]

const PRODUCT_NAME_PREFIX = [
  "Premium",
  "Classic",
  "Smart",
  "Daily",
  "Essential",
  "Modern",
  "Urban",
  "Comfort",
  "Pro",
  "Signature",
]

const PRODUCT_NAME_SUFFIX = [
  "Watch",
  "Bag",
  "Shoes",
  "Lamp",
  "Bottle",
  "Headset",
  "Keyboard",
  "Jacket",
  "Tumbler",
  "Wallet",
  "Speaker",
  "Perfume",
]

const USER_PASSWORD = "Admin123!"
const CUSTOMER_PASSWORD = "Customer123!"

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function randomBool(truePercentage = 50) {
  return Math.random() * 100 < truePercentage
}

function randomFrom<T>(items: T[]) {
  return items[randomInt(0, items.length - 1)]
}

function randomDate(start = START_DATE, end = END_DATE) {
  const time = randomInt(start.getTime(), end.getTime())
  return new Date(time)
}

function randomUpdatedAt(createdAt: Date, maxAdditionalDays = 120) {
  const maxTime = Math.min(
    END_DATE.getTime(),
    createdAt.getTime() + maxAdditionalDays * 24 * 60 * 60 * 1000,
  )

  return new Date(randomInt(createdAt.getTime(), maxTime))
}

function buildAddress(city: string, index: number) {
  return `Jl. ${randomFrom([
    "Melati",
    "Kenanga",
    "Anggrek",
    "Mawar",
    "Cendana",
    "Diponegoro",
    "Sudirman",
    "Pahlawan",
  ])} No. ${randomInt(1, 250)}, ${city}, Indonesia ${10000 + index}`
}

function formatCustomerCode(index: number) {
  return `CUS${String(index).padStart(4, "0")}`
}

function formatSku(index: number) {
  return `SKU-${String(index).padStart(4, "0")}`
}

function randomPhone(index: number) {
  return `08123${String(1000000 + index).slice(-7)}${String(index).padStart(2, "0").slice(-2)}`
}

function pickMembership(index: number) {
  if (index <= 40) return MembershipLevel.BRONZE
  if (index <= 70) return MembershipLevel.SILVER
  if (index <= 95) return MembershipLevel.GOLD
  return MembershipLevel.PLATINUM
}

function pickGender(index: number) {
  if (index % 3 === 0) return Gender.MALE
  if (index % 3 === 1) return Gender.FEMALE
  return Gender.OTHER
}

function pickProductPrice(category: string) {
  if (category === "Electronics") return randomInt(250000, 2500000)
  if (category === "Fashion") return randomInt(80000, 750000)
  if (category === "Beauty") return randomInt(50000, 450000)
  if (category === "Home Living") return randomInt(60000, 900000)
  if (category === "Sports") return randomInt(100000, 1500000)
  return randomInt(30000, 350000)
}

function pickInitialStock(index: number) {
  if (index % 15 === 0) return randomInt(0, 5)
  if (index % 10 === 0) return randomInt(6, 10)
  if (index % 7 === 0) return randomInt(11, 25)
  return randomInt(40, 250)
}

function createToken(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}-${crypto.randomBytes(16).toString("hex")}`
}

// ==========================
// CLEAR DATABASE
// ==========================

async function clearDatabase() {
  console.log("Clearing database...")

  await prisma.loyaltyHistory.deleteMany()
  await prisma.inventoryTransaction.deleteMany()
  await prisma.transactionItem.deleteMany()
  await prisma.transaction.deleteMany()
  await prisma.customerActivity.deleteMany()
  await prisma.refreshToken.deleteMany()
  await prisma.loyaltyAccount.deleteMany()
  await prisma.auditLog.deleteMany()
  await prisma.customer.deleteMany()
  await prisma.product.deleteMany()
  await prisma.user.deleteMany()

  console.log("Database cleared")
}



// ==========================
// SEED USERS
// ==========================

async function seedUsers() {
  console.log("Seeding users...")

  const passwordHash = await bcrypt.hash(USER_PASSWORD, 10)

  const userData = [
    {
      name: "Super Admin",
      email: "admin@retailcrm.com",
      role: Role.SUPER_ADMIN,
      isActive: true,
    },
    {
      name: "Admin Retail",
      email: "admin2@retailcrm.com",
      role: Role.ADMIN,
      isActive: true,
    },
    {
      name: "Manager Retail",
      email: "manager@retailcrm.com",
      role: Role.MANAGER,
      isActive: true,
    },
    {
      name: "Sales One",
      email: "sales1@retailcrm.com",
      role: Role.SALES,
      isActive: true,
    },
    {
      name: "Sales Two",
      email: "sales2@retailcrm.com",
      role: Role.SALES,
      isActive: true,
    },
    {
      name: "Customer Service",
      email: "cs@retailcrm.com",
      role: Role.CUSTOMER_SERVICE,
      isActive: true,
    },
    {
      name: "Old Staff",
      email: "oldstaff@retailcrm.com",
      role: Role.SALES,
      isActive: false,
    },
  ]

  const users: User[] = []

  for (let i = 0; i < userData.length; i++) {
    const item = userData[i]
    const createdAt = randomDate()
    const updatedAt = randomUpdatedAt(createdAt)

    const user = await prisma.user.create({
      data: {
        name: item.name,
        email: item.email,
        passwordHash,
        imageUrl: randomFrom(USER_IMAGES),
        role: item.role,
        isActive: item.isActive,
        createdAt,
        updatedAt,
      },
    })

    users.push(user)
  }

  console.log(`Users seeded: ${users.length}`)
  console.log(`Default user password: ${USER_PASSWORD}`)

  return users
}

// ==========================
// SEED PRODUCTS
// ==========================

async function seedProducts() {
  console.log("Seeding products...")

  const products: Product[] = []

  for (let i = 1; i <= 60; i++) {
    const category = randomFrom(PRODUCT_CATEGORIES)
    const createdAt = randomDate()
    const updatedAt = randomUpdatedAt(createdAt)
    const isActive = i % 12 !== 0

    const product = await prisma.product.create({
      data: {
        sku: formatSku(i),
        name: `${randomFrom(PRODUCT_NAME_PREFIX)} ${category} ${randomFrom(PRODUCT_NAME_SUFFIX)} ${i}`,
        category,
        imageUrl: randomFrom(PRODUCT_IMAGES),
        price: pickProductPrice(category),
        stock: pickInitialStock(i),
        isActive,
        createdAt,
        updatedAt,
      },
    })

    products.push(product)
  }

  console.log(`Products seeded: ${products.length}`)

  return products
}

// ==========================
// SEED CUSTOMERS
// ==========================

async function seedCustomers() {
  console.log("Seeding customers...")

  const passwordHash = await bcrypt.hash(CUSTOMER_PASSWORD, 10)
  const customers: Customer[] = []

  for (let i = 1; i <= 150; i++) {
    const firstName = randomFrom(FIRST_NAMES)
    const lastName = randomFrom(LAST_NAMES)
    const city = randomFrom(CITIES)
    const createdAt = randomDate()
    const updatedAt = randomUpdatedAt(createdAt)

    const customer = await prisma.customer.create({
      data: {
        customerCode: formatCustomerCode(i),
        name: `${firstName} ${lastName}`,
        phone: randomPhone(i),
        email: `customer${i}@retailcrm.com`,
        passwordHash,
        imageUrl: randomFrom(CUSTOMER_IMAGES),
        isActive: i % 9 !== 0,
        gender: pickGender(i),
        birthDate: new Date(
          randomInt(1985, 2004),
          randomInt(0, 11),
          randomInt(1, 28),
        ),
        address: buildAddress(city, i),
        city,
        membership: pickMembership(i),
        totalSpent: 0,
        createdAt,
        updatedAt,
        loyalty: {
          create: {
            points: 0,
            createdAt,
            updatedAt,
          },
        },
      },
    })

    customers.push(customer)
  }

  console.log(`Customers seeded: ${customers.length}`)
  console.log(`Default customer password: ${CUSTOMER_PASSWORD}`)

  return customers
}

// ==========================
// SEED TRANSACTIONS
// ==========================

async function seedTransactions(
  users: User[],
  products: Product[],
  customers: Customer[],
) {

  console.log("Seeding transactions...")


  const transactions: Transaction[] = []

  const salesUsers =
    users.filter(
      user =>
        user.role === Role.SALES ||
        user.role === Role.MANAGER
    )



  for(let i = 1; i <= 500; i++){


    const customer =
      randomFrom(customers)



    const user =
      randomFrom(salesUsers)



    const transactionDate =
      randomDate(
        new Date("2025-01-01"),
        new Date("2026-09-20")
      )



    const itemCount =
      randomInt(1,5)



    const selectedProducts:Set<string> =
      new Set()



    while(selectedProducts.size < itemCount){

      const product =
        randomFrom(products)


      selectedProducts.add(product.id)

    }



    const transactionItems = []

    let totalAmount = 0



    for(const productId of selectedProducts){


      const product =
        products.find(
          p => p.id === productId
        )


      if(!product)
        continue



      const quantity =
        randomInt(1,5)



      const subtotal =
        Number(product.price)
        *
        quantity



      totalAmount += subtotal



      transactionItems.push({

        productId:
          product.id,


        quantity,


        price:
          product.price,


        subtotal,

      })



      // =========================
      // UPDATE PRODUCT STOCK
      // =========================

      await prisma.product.update({

        where:{
          id:product.id
        },


        data:{

          stock:{
            decrement:quantity
          }

        }

      })




      // =========================
      // INVENTORY STOCK OUT
      // =========================

      await prisma.inventoryTransaction.create({

        data:{


          productId:
            product.id,


          userId:
            user.id,


          type:
            InventoryType.STOCK_OUT,


          quantity,


          stockBefore:
            product.stock,


          stockAfter:
            product.stock - quantity,


          description:
            "Penjualan customer",


          createdAt:
            transactionDate,


        }

      })



    }




    const paymentMethods = [

      PaymentMethod.CASH,

      PaymentMethod.CARD,

      PaymentMethod.TRANSFER,

      PaymentMethod.EWALLET,

      PaymentMethod.QRIS,

    ]



    const statuses = [

      TransactionStatus.COMPLETED,

      TransactionStatus.COMPLETED,

      TransactionStatus.COMPLETED,

      TransactionStatus.CANCELLED,

      TransactionStatus.PROCESSING,

    ]



    const status =
      randomFrom(statuses)



    const transaction =
      await prisma.transaction.create({

        data:{


          invoiceNumber:
            `INV-${transactionDate.getTime()}-${i}`,


          customerId:
            customer.id,


          userId:
            user.id,


          totalAmount,


          paymentMethod:
            randomFrom(paymentMethods),


          paymentStatus:

            status === TransactionStatus.CANCELLED

              ?

              PaymentStatus.REFUND

              :

              PaymentStatus.PAID,



          status,


          paymentReference:

            randomBool(70)

            ?

            `PAY-${crypto.randomUUID()}`

            :

            undefined,



          notes:

            randomBool(30)

            ?

            "Transaksi promo"

            :

            undefined,



          transactionDate,


          createdAt:
            transactionDate,



          updatedAt:
            randomUpdatedAt(transactionDate),



          items:{


            create:
              transactionItems,

          }


        }


      })



    transactions.push(transaction)



    // =========================
    // CUSTOMER TOTAL SPENT
    // =========================


    if(
      status === TransactionStatus.COMPLETED
    ){


      await prisma.customer.update({

        where:{
          id:customer.id
        },


        data:{

          totalSpent:{
            increment:
              totalAmount
          }

        }

      })



      // =========================
      // LOYALTY POINT
      // =========================


      const loyalty =
        await prisma.loyaltyAccount.findUnique({

          where:{
            customerId:
              customer.id
          }

        })



      if(loyalty){


        const points =
          Math.floor(
            totalAmount / 10000
          )



        await prisma.loyaltyAccount.update({

          where:{
            id:loyalty.id
          },


          data:{

            points:{
              increment:points
            }

          }

        })



        await prisma.loyaltyHistory.create({

          data:{


            loyaltyAccountId:
              loyalty.id,


            transactionId:
              transaction.id,


            type:
              LoyaltyHistoryType.EARN,


            points,


            description:
              "Point transaksi pembelian",


            createdAt:
              transactionDate,


          }

        })


      }


    }



  }



  console.log(
    `Transactions seeded: ${transactions.length}`
  )


  return transactions

}


// ==========================
// SEED STOCK IN & ADJUSTMENT
// ==========================


async function seedInventoryAdjustment(
  users: User[],
  products: Product[],
){

  console.log(
    "Seeding inventory adjustment..."
  )


  const admin =
    users.find(
      user =>
        user.role === Role.ADMIN
    )



  if(!admin)
    return



  for(let i=0;i<80;i++){


    const product =
      randomFrom(products)



    const type =
      randomBool(60)

      ?

      InventoryType.STOCK_IN

      :

      InventoryType.ADJUSTMENT




    const quantity =
      randomInt(5,100)



    const before =
      product.stock



    let after =
      before



    if(type === InventoryType.STOCK_IN){

      after =
        before + quantity


    }
    else{


      after =
        randomBool()

        ?

        before + quantity

        :

        Math.max(
          0,
          before - quantity
        )

    }



    await prisma.product.update({

      where:{
        id:product.id
      },


      data:{

        stock:after

      }


    })




    await prisma.inventoryTransaction.create({

      data:{


        productId:
          product.id,


        userId:
          admin.id,


        type,


        quantity,


        stockBefore:
          before,


        stockAfter:
          after,


        description:

          type === InventoryType.STOCK_IN

          ?

          "Restock gudang"

          :

          "Stock opname",


        createdAt:
          randomDate(),


      }


    })


  }


  console.log(
    "Inventory adjustment OK"
  )


}

// ==========================
// SEED CUSTOMER ACTIVITY
// ==========================

async function seedCustomerActivity(
  users: User[],
  customers: Customer[],
) {


  console.log(
    "Seeding customer activity..."
  )



  const salesUsers =
    users.filter(
      user =>
        user.role === Role.SALES ||
        user.role === Role.CUSTOMER_SERVICE
    )



  const activities = [

    ActivityType.CALL,

    ActivityType.WHATSAPP,

    ActivityType.EMAIL,

    ActivityType.MEETING,

    ActivityType.COMPLAINT,

    ActivityType.NOTE,

  ]



  const statuses = [

    ActivityStatus.DONE,

    ActivityStatus.DONE,

    ActivityStatus.PROCESS,

    ActivityStatus.PENDING,

    ActivityStatus.CANCELLED,

  ]



  for(let i=0;i<300;i++){



    const customer =
      randomFrom(customers)



    const user =
      randomFrom(salesUsers)



    await prisma.customerActivity.create({

      data:{


        customerId:
          customer.id,


        userId:
          user.id,


        type:
          randomFrom(activities),



        subject:

          randomFrom([

            "Follow up customer",

            "Promo produk baru",

            "Konfirmasi pembayaran",

            "Menangani komplain",

            "Menawarkan membership",

            "Reminder transaksi",

          ]),



        description:

          randomFrom([

            "Customer tertarik produk terbaru",

            "Customer meminta informasi harga",

            "Customer melakukan komplain",

            "Customer sudah dihubungi",

            "Customer mendapatkan promo",

          ]),



        status:
          randomFrom(statuses),



        createdAt:
          randomDate(
            new Date("2025-01-01"),
            new Date("2026-09-20")
          ),

      }

    })


  }


  console.log(
    "Customer activity OK"
  )

}

// ==========================
// SEED REFRESH TOKEN
// ==========================

async function seedRefreshToken(
  users: User[],
  customers: Customer[],
){


  console.log(
    "Seeding refresh token..."
  )



  // ======================
  // USER TOKEN
  // ======================


  for(
    const user of users
  ){


    await prisma.refreshToken.create({

      data:{


        userId:
          user.id,


        token:
          crypto.randomUUID()
          +
          crypto.randomUUID(),



        expiresAt:

          new Date(

            Date.now()

            +

            7 *
            24 *
            60 *
            60 *
            1000

          ),

      }


    })


  }




  // ======================
  // CUSTOMER TOKEN
  // ======================


  for(
    let i=0;
    i<30;
    i++
  ){


    const customer =
      randomFrom(customers)



    await prisma.refreshToken.create({

      data:{


        customerId:
          customer.id,


        token:
          crypto.randomUUID()
          +
          crypto.randomUUID(),



        expiresAt:

          new Date(

            Date.now()

            +

            randomInt(
              1,
              30
            )
            *
            24 *
            60 *
            60 *
            1000

          ),


      }


    })


  }



  console.log(
    "Refresh token OK"
  )


}

// ==========================
// SEED AUDIT LOG
// ==========================

async function seedAuditLog(
  users: User[],
){


console.log(
  "Seeding audit log..."
)



const modules=[

"AUTH",

"CUSTOMER",

"PRODUCT",

"TRANSACTION",

"INVENTORY",

"LOYALTY",

"SYSTEM",

]



const actions=[

"CREATE",

"UPDATE",

"DELETE",

"LOGIN",

"LOGOUT",

"EXPORT",

"ADJUSTMENT",

]




for(let i=0;i<300;i++){



const user =
randomFrom(users)



await prisma.auditLog.create({

data:{


userId:
user.id,


action:
randomFrom(actions),


module:
randomFrom(modules),



description:

`User ${user.name} melakukan aktivitas`,



ipAddress:

randomFrom([

"127.0.0.1",

"192.168.1.10",

"192.168.1.20",

"10.0.0.5",

]),



createdAt:

randomDate(

new Date("2025-01-01"),

new Date("2026-09-20")

)


}


})



}



console.log(
 "Audit log OK"
)


}



async function main(){

  console.log(
    "START SEED"
  );


  await clearDatabase();


  const users =
    await seedUsers();


  const products =
    await seedProducts();


  const customers =
    await seedCustomers();


  await seedTransactions(
    users,
    products,
    customers
  );


  await seedInventoryAdjustment(
    users,
    products
  );


  await seedCustomerActivity(
    users,
    customers
  );


  await seedRefreshToken(
    users,
    customers
  );


  await seedAuditLog(
    users
  );


  console.log(
    "SEED FINISHED SUCCESS"
  );

}


// TAMBAHKAN INI

main()

.catch((error)=>{

  console.error(error);

  process.exit(1);

})

.finally(async()=>{

  await prisma.$disconnect();

});