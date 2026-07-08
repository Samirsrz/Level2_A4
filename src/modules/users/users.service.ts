import bcrypt from "bcryptjs"
import { IUSER } from "./userInterface"
import config from "../../config"
import { prisma } from "../../lib/prisma"


const createUserDB =async(payload:IUSER)=>{
   const {name,email,password,role} = payload
  //  console.log(payload);
  const isUserExist = await prisma.user.findUnique({
    where:{
      email
    }
  })

   if(isUserExist){
    throw new Error("User with this mail already exist")
   }

   const hashPassword =await bcrypt.hash(password,Number(config.bcrypt_salt_rounds))

   const createdUser = await prisma.user.create({
    data:{
       name,
       email,
       password:hashPassword,
       role

    }
   })   
      const user = await prisma.user.findUnique({
        where:{
            id:createdUser.id,
            email: createdUser.email || email
        },
        omit:{
            password:true
        }
      })
 return user
}











export const userService = {
  createUserDB
}