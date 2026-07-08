import { Prisma } from "../../../generated/prisma/client"
import { prisma } from "../../lib/prisma"
import { ICreatePropertyPayload, IQueryProperty } from "./propertyInterface"


const createPropertyDB =async(landlordId:string,payload:ICreatePropertyPayload)=>{
      const landlordUser = await prisma.user.findUniqueOrThrow({
         where:{
            id:landlordId
         }
      })
   
       const result = await prisma.property.create({
        data:{
            ...payload,
            landlord: {  
            connect: { id: landlordId }  
      }
        }
       }) 
        
       return result
 
}


const getAllPropertyDB = async (query: IQueryProperty) => {
  const { location, type, minPrice, maxPrice, sortBy, sortOrder } = query;
  const andConditions: Prisma.PropertyWhereInput[] = [];

  andConditions.push({
    isAvailable: true,
  });

  if (location) {
    andConditions.push({
      location: {
        contains: location,
        mode: "insensitive",
      },
    });
  }

  if (type) {
    andConditions.push({
      type: type.toUpperCase() as any,
    });
  }

  if (minPrice) {
    andConditions.push({
      price: {
        gte: Number(minPrice),
      },
    });
  }

  if (maxPrice) {
    andConditions.push({
      price: {
        lte: Number(maxPrice),
      },
    });
  }

  const properties = await prisma.property.findMany({
    where: {
      AND: andConditions,
    },
    orderBy: {
      [sortBy || "createdAt"]: sortOrder || "desc",
    },
  });

  return properties;
};




// const getPropertyById_DB =  async(id:string)=>{
   
//    const transactionResult = await prisma.$transaction(
//     async(tx)=>{
//         await tx.property.
//     }
//    )
// }

const getPropertyById_DB = async (id: string) => {
  const property = await prisma.property.findUnique({
    where: {
      id: id,
      isAvailable: true, 
    },
    include: {
      landlord: {
        select: {
          id: true,
          name: true,
          email: true,
          role:true
        }
      },
      rentalRequests: {
           select: {
          id: true,
          status: true,
          createdAt: true,
          
        }
      }
    }
  });

  if (!property) {
    throw new Error("Property not found or unavailable");
  }

  return property;
};

export const propertyService = {
    createPropertyDB,
    getAllPropertyDB,
    getPropertyById_DB
}