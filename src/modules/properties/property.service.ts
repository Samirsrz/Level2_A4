import { prisma } from "../../lib/prisma"
import { ICreatePropertyPayload } from "./propertyInterface"


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



export const propertyService = {
    createPropertyDB
}