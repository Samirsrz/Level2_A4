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



export const rentalService = {
    createRentalRequestDB
}