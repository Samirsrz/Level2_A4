import { prisma } from "../../lib/prisma"
import { IRentalRequest } from "./rentalRequestInterface"



const createRentalRequestDB = async(tenantId:string, payload:IRentalRequest)=>{
     const property = await prisma.property.findUnique({
    where: { id: payload.propertyId },
  });

  if (!property) {
    throw new Error("Property not found");
  }

  if (!property.isAvailable) {
    throw new Error("This property is not currently available");
  }

  const result = await prisma.rentalRequest.create({
    data: {
      ...payload,
      tenantId,
    },
  });

    return result
}



const getMyrentalRequestDB= async(tenantId:string)=>{
    const result = await prisma.rentalRequest.findMany({
        where:{
            tenantId
        },
        include:{
            property:{
                select:{
                    id: true,
                    title: true,
                    location: true,
                    price: true,
                }
            }
        }
    })

   

    return result
}



const getRentalRequestById_DB= async(rentalId:string,currentUserId:string)=>{
       const rentalRequest = await prisma.rentalRequest.findUnique({
         where:{
            id:rentalId
         },
         include:{
            property:true
         }
       })

        if (!rentalRequest) {
            throw new Error("Rental request not found");
        }

        const isTenantOwner = rentalRequest.tenantId === currentUserId;
        const isLandlordOwner = rentalRequest.property.landlordId === currentUserId;

        if (!isTenantOwner && !isLandlordOwner) {
            throw new Error("You are not authorized to view this rental request");
        }

        return rentalRequest;

}






export const rentalService = {
    createRentalRequestDB,
    getMyrentalRequestDB,
    getRentalRequestById_DB
}