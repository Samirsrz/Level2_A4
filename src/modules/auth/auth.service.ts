import bcrypt from "bcryptjs"
import { prisma } from "../../lib/prisma"
import { ILoginUser } from "./authInterface"
import { jwtUtils } from "../../jwt"
import config from "../../config"
import { SignOptions } from "jsonwebtoken"
import { OAuth2Client } from "google-auth-library"


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



const googleClient = new OAuth2Client(config.google_client_id)

const googleLoginDB = async(idToken:string)=>{
     const ticket = await googleClient.verifyIdToken({
        idToken,
        audience:config.google_client_id,
     })

    const payload = ticket.getPayload()

    if(!payload || !payload.email){
        throw new Error("Invalid Google Token")
    }

    const {email, name,sub:googleId} = payload

    let user = await prisma.user.findUnique({
        where:{email}
    })

    if(user){
        if(user.role!=="TENANT"){
            throw new Error("This email is already registered as a different role")
        }
        if (!user.googleId) {
         user = await prisma.user.update({
         where: { email },
         data: { googleId },
       })
     }

    } else{
        const randomPassword = Math.random().toString(36).slice(-12)
        const hashedPassword = await bcrypt.hash(randomPassword,Number(config.bcrypt_salt_rounds))

        user = await prisma.user.create({
            data:{
                name:name || "Google User",
                email,
                password:hashedPassword,
                googleId,
                role:"TENANT"
            }
        })
    }


        if (user.status === "BANNED") {
            throw new Error("Your account has been banned")
        }


     const jwtPayload= {
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

    return {
        accessToken,
        refreshToken,
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
    }
}


export const authService={
    loginUserDB,
    googleLoginDB
}