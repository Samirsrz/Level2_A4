import { prisma } from "../../lib/prisma"


interface ICreateReview{
    rentalRequestId:string,
    rating:number,
    comment:string
}



const createReviewsDB = async(tenantId:string,rentalRequestId:string,payLoad:ICreateReview)=>{
      
      const rentalRequest = await prisma.rentalRequest.findUnique({
         where:{
            id:rentalRequestId
         },
         
      })

 
     if(!rentalRequest){
        throw new Error("This request does not exist ")
     }
    if (rentalRequest.tenantId !== tenantId) {
        throw new Error("You cannot review a rental that isn't yours");
    }
    
        const existingReview = await prisma.review.findUnique({
    where: { rentalRequestId },
    });

    if (existingReview) {
    throw new Error("You have already reviewed this rental");
    }


    const submitReview = await prisma.review.create({
        data:{
            ...payLoad,
            rentalRequestId
        }
    })


return submitReview
}


export const reviewService = {
    createReviewsDB
}