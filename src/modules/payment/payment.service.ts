import config from "../../config"
import { prisma } from "../../lib/prisma"
import { stripe } from "../../lib/stripe"


const createPaymentDB = async(tenantId:string, rentalRequestId:string)=>{
   const rentalRequest = await prisma.rentalRequest.findUnique({
     where:{
        id:rentalRequestId
     },
     include:{
        property:true
     }
   })

   if(!rentalRequest){
     throw new Error("Rental request not found")
   }

   if(rentalRequest.tenantId!==tenantId){
     throw new Error("This is not your rental Request")
   }

   const existingPayment = await prisma.payment.findFirst({
    where: { rentalRequestId, status: "COMPLETED" },
  });

  if (existingPayment) {
    throw new Error("This rental has already been paid for");
  }


const amount = Number(rentalRequest.property.price)

const session = await stripe.checkout.sessions.create({
    payment_method_types:["card"],
    mode:"payment",
    line_items:[
        {
            price_data:{
                currency:"usd",
                product_data:{
                    name:rentalRequest.property.title
                },
                unit_amount:Math.round(amount*100)
            },
            quantity:1,
        }
    ],
    success_url: `${config.app_url}/api/payments/success`,
    cancel_url: `${config.app_url}/api/payments/cancel`,

})


const payment = await prisma.payment.create({
    data:{
        transactionId:session.id,
        rentalRequestId,
        amount,
        method:"STRIPE",
        status:"PENDING"
    }
})

   return {
    payment, checkoutUrl : session.url
   }

}



const confirmPaymentDB = async (transactionId: string) => {
  const session = await stripe.checkout.sessions.retrieve(transactionId);

  const payment = await prisma.payment.findUnique({
    where: { transactionId },
  });

  if (!payment) {
    throw new Error("Payment record not found");
  }

  if (session.payment_status !== "paid") {
    await prisma.payment.update({
      where: { transactionId },
      data: { status: "FAILED" },
    });
    throw new Error("Payment was not completed");
  }

  const updatedPayment = await prisma.payment.update({
    where: { transactionId },
    data: { status: "COMPLETED", paidAt: new Date() },
  });

  await prisma.rentalRequest.update({
    where: { id: payment.rentalRequestId },
    data: { status: "ACTIVE" },
  });

  return updatedPayment;
};


const getMyPaymentsDB = async (tenantId: string) => {
  const result = await prisma.payment.findMany({
    where: { 
        rentalRequest: { tenantId } 
    },
    include: { 
        rentalRequest: { 
            include: 
            { 
                property: true 
            } 
        } 
    },
    orderBy: { createdAt: "desc" },
  });
  return result;
};

const getPaymentByIdDB = async (paymentId: string, userId: string) => {
  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    include: { rentalRequest: { include: { property: true } } },
  });

  if (!payment) throw new Error("Payment not found");

  const isTenant = payment.rentalRequest.tenantId === userId;
  const isLandlord = payment.rentalRequest.property.landlordId === userId;

  if (!isTenant && !isLandlord) {
    throw new Error("Not authorized to view this payment");
  }

  return payment;
};

export const paymentService = {
    createPaymentDB,
    confirmPaymentDB,
    getMyPaymentsDB,
    getPaymentByIdDB
}