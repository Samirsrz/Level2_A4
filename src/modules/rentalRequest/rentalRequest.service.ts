import { prisma } from "../../lib/prisma"
import { IRentalRequest, IUpdateRentalRequest } from "./rentalRequestInterface"



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


const getLandlordPropertyRequests_DB= async(landlordId:string)=>{
      const result = await prisma.rentalRequest.findMany({
       where:{
        property:{
            landlordId:landlordId
        },
       },
       include:{
        property:true,
        tenant:{
            select:{
                id:true,
                name:true,
                email:true

            }
        }
       }
      })

      return result 
}


const updateStatusOfRequestsDB=  async(requestId: string,payload:IUpdateRentalRequest, landlordID:string)=>{
          
    const request = await prisma.rentalRequest.findUnique({
        where:{
            id:requestId
        },
        include:{
            property:true
        }
        
    })

     if(!request){
        throw new Error("This request does not exixt")
    }



    if(request?.property.landlordId!==landlordID){
        throw new Error("PERMISSION DENIED")
    }
    // TODO

   

    if(request.status!=="PENDING"){
        throw new Error("This request does not exixt")
    }


        if (payload.status !== "APPROVED" && payload.status !== "REJECTED") {
        throw new Error("Status must be either APPROVED or REJECTED");
        }



   const result = await prisma.rentalRequest.update({
      where:{
          id:requestId
      },
      data:{
        status: payload.status
    },
      include:{
        property:{
            include:{
                landlord:{
                    select:{
                        id:true,
                        name:true,
                        email:true
                    }
                }
            }
         }
      }
   })

 return result 
}



export const rentalService = {
    createRentalRequestDB,
    getMyrentalRequestDB,
    getRentalRequestById_DB,
    getLandlordPropertyRequests_DB,
    updateStatusOfRequestsDB
}