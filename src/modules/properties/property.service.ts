import { Prisma } from "../../../generated/prisma/client"
import { prisma } from "../../lib/prisma"
import { ICreatePropertyPayload, IQueryProperty, IUpdatePropertyPayload } from "./propertyInterface"


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




const updatePropertyDB =async(id:string, payload:IUpdatePropertyPayload, landlordId:string,isLandlord:boolean)=>{
 
    const property = await prisma.property.findUnique({
      where:{
        id
      }
     })
      if (!property) {
        throw new Error("Property not found");
      }
      
     if(property.landlordId!==landlordId){
      throw new Error("You cannot update someone else's property")
     }

    const result = await prisma.property.update({
      where:{
           id
      },
      data:{
        ...payload,
      },
            include: {
      landlord: {
        select: {
          id: true,
          name: true,
          email: true,
          role:true
        }
      }
        }
      
    })

return result

}


const deletePropertyDB =async(id:string,landlordId:string)=>{

    const property = await prisma.property.findUnique({
      where:{
        id
      }
     })
      if (!property) {
        throw new Error("Property not found");
      }
      
     if(property.landlordId!==landlordId){
      throw new Error("You cannot delete someone else's property")
     }

     const rentalRequestsCount = await prisma.rentalRequest.count({
      where:{
        propertyId:id
      }
     })

     if(rentalRequestsCount>0){
       throw new Error("Cannot delete a property with existing rental request history");
     }

  
     const result = await prisma.property.delete({
      where:{
        id
      }
     })
 
      return result

}
 


const getMyPropertiesDB = async(landlordId:string)=>{
  const result = await prisma.property.findMany({
    where:{
      landlordId
    },
    include:{
      rentalRequests:{
        include:{
          tenant:{
            select:{
              id:true,
              name:true,
              email:true,
            }
          }
        },
        orderBy:{
          createdAt:"desc"
        }

      }
    }
  })
  return result
}







export const propertyService = {
    createPropertyDB,
    getAllPropertyDB,
    getPropertyById_DB,
    updatePropertyDB,
    deletePropertyDB,
    getMyPropertiesDB
}