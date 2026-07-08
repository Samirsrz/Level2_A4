import bcrypt from "bcryptjs"
import { prisma } from "../../lib/prisma"
import { ILoginUser } from "./authInterface"
import { jwtUtils } from "../../jwt"
import config from "../../config"
import { SignOptions } from "jsonwebtoken"


const loginUserDB=async(payLoad:ILoginUser)=>{
  const {email,password} =  payLoad

    const user = await prisma.user.findUnique({
        where:{email}
    })
    if (!user) {
    throw new Error("Invalid email or password");
    }
    const isPasswordMatch = await bcrypt.compare(password,user.password)
    if(!isPasswordMatch){
        throw new Error("Password does not match")
    }
    if (user.status === "BANNED") {
    throw new Error("Your account has been banned");
    }
    const jwtPayload = {
        id:user.id,
        email:user.email,
        role:user.role,
        name:user.name
    }

    const accessToken = jwtUtils.createToken(
        jwtPayload,config.jwt_access_secret,
        config.jwt_access_expires_in as SignOptions
    )

    const refreshToken = jwtUtils.createToken(
        jwtPayload,config.jwt_refresh_secret,
        config.jwt_refresh_expires_in as SignOptions
    )
  

   return{
    user,
    accessToken,
    refreshToken
   }
}




export const authService={
    loginUserDB,
    
}