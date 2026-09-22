import {
  PrismaClient,
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
} from "../src/generated/prisma/client";

import {
  PrismaMariaDb,
} from "@prisma/adapter-mariadb";

import bcrypt from "bcrypt";


const adapter = new PrismaMariaDb({

  host:"localhost",

  port:3306,

  user:"root",

  password:"",

  database:"retailcrm",

});


const prisma = new PrismaClient({
  adapter,
});



const IMAGE =
"/uploads/product-1790095702321.jpg";



async function main(){


console.log("START SEED");



// ==========================
// CLEAR DATABASE
// ==========================

await prisma.loyaltyHistory.deleteMany();
await prisma.inventoryTransaction.deleteMany();
await prisma.transactionItem.deleteMany();
await prisma.transaction.deleteMany();
await prisma.customerActivity.deleteMany();
await prisma.loyaltyAccount.deleteMany();
await prisma.customer.deleteMany();
await prisma.product.deleteMany();
await prisma.auditLog.deleteMany();
await prisma.refreshToken.deleteMany();
await prisma.user.deleteMany();




// ==========================
// USERS
// ==========================


const passwordHash =
await bcrypt.hash(
"Admin123!",
10
);



const users=[];


const userData=[

{
name:"Super Admin",
email:"admin@retailcrm.com",
role:Role.SUPER_ADMIN
},

{
name:"Manager Retail",
email:"manager@retailcrm.com",
role:Role.MANAGER
},

{
name:"Sales One",
email:"sales1@retailcrm.com",
role:Role.SALES
},

{
name:"Customer Service",
email:"cs@retailcrm.com",
role:Role.CUSTOMER_SERVICE
},

{
name:"Admin Retail",
email:"admin2@retailcrm.com",
role:Role.ADMIN
},

];



for(const item of userData){

const user =
await prisma.user.create({

data:{

...item,

passwordHash,

isActive:true

}

});


users.push(user);

}



console.log("Users OK");




// ==========================
// PRODUCTS
// ==========================


const products=[];


for(let i=1;i<=50;i++){


const product =
await prisma.product.create({

data:{


sku:
`SKU-${String(i).padStart(4,"0")}`,


name:
`Product Retail ${i}`,


category:
i%3===0
?
"Fashion"
:
i%2===0
?
"Electronics"
:
"Accessories",


imageUrl:IMAGE,


price:
50000 + (i*10000),


stock:200,


isActive:true


}

});


products.push(product);

}



console.log("Products OK");





// ==========================
// CUSTOMERS
// ==========================


const customers=[];


for(let i=1;i<=100;i++){


const customer =
await prisma.customer.create({

data:{


customerCode:
`CUS${String(i).padStart(4,"0")}`,


name:
`Customer ${i}`,


phone:
`08123456${String(i).padStart(4,"0")}`,


email:
`customer${i}@gmail.com`,


imageUrl:IMAGE,


isActive:true,


gender:
i%2===0
?
Gender.MALE
:
Gender.FEMALE,


birthDate:
new Date(
1990,
i%12,
(i%28)+1
),


address:
`Alamat Customer ${i}`,


city:
i%2===0
?
"Jakarta"
:
"Bandung",


membership:

i<=40
?
MembershipLevel.BRONZE

:

i<=65
?
MembershipLevel.SILVER

:

i<=85
?
MembershipLevel.GOLD

:
MembershipLevel.PLATINUM,



loyalty:{

create:{

points:
i*20

}

}


}

});


customers.push(customer);


}



console.log("Customers OK");






// ==========================
// TRANSACTIONS
// ==========================



for(let i=0;i<200;i++){


const customer =
customers[
Math.floor(
Math.random()*customers.length
)
];


const product =
products[
Math.floor(
Math.random()*products.length
)
];


const qty =
Math.floor(Math.random()*5)+1;


const amount =
Number(product.price)*qty;




const transaction =
await prisma.transaction.create({

data:{


invoiceNumber:
`INV-${Date.now()}-${i}`,


customerId:
customer.id,


userId:
users[2].id,


totalAmount:
amount,


paymentMethod:
PaymentMethod.QRIS,


paymentStatus:
PaymentStatus.PAID,


status:
TransactionStatus.COMPLETED,


items:{

create:{

productId:
product.id,


quantity:qty,


price:
product.price,


subtotal:
amount

}

}


}

});



// inventory


await prisma.inventoryTransaction.create({

data:{


productId:
product.id,


userId:
users[2].id,


transactionId:
transaction.id,


type:
InventoryType.STOCK_OUT,


quantity:qty,


stockBefore:
product.stock,


stockAfter:
product.stock-qty,


description:
"Transaction seed"


}

});




// loyalty


const loyalty =
await prisma.loyaltyAccount.findUnique({

where:{
customerId:customer.id
}

});


if(loyalty){


await prisma.loyaltyHistory.create({

data:{


loyaltyAccountId:
loyalty.id,


transactionId:
transaction.id,


type:
LoyaltyHistoryType.EARN,


points:
Math.floor(amount/10000),


description:
"Point pembelian"


}

});


}



await prisma.customer.update({

where:{
id:customer.id
},

data:{


totalSpent:{
increment:amount
}

}

});



}



console.log("Transaction OK");






// ==========================
// CUSTOMER ACTIVITY
// ==========================


for(let i=0;i<100;i++){


await prisma.customerActivity.create({

data:{


customerId:
customers[i].id,


userId:
users[2].id,


type:
ActivityType.WHATSAPP,


subject:
"Follow up customer",


description:
"Customer follow up dummy",


status:
ActivityStatus.DONE


}

});


}



console.log("Activity OK");





// ==========================
// AUDIT LOG
// ==========================


await prisma.auditLog.create({

data:{


userId:
users[0].id,


action:
"SEED",


module:
"SYSTEM",


description:
"Generate dummy CRM data"


}

});




console.log("SEED FINISHED");



}




main()

.catch(e=>{

console.error(e);

process.exit(1);

})

.finally(async()=>{

await prisma.$disconnect();

});