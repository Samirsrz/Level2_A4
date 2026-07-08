import { JwtPayload, SignOptions } from "jsonwebtoken";
import jwt from "jsonwebtoken"



const createToken = (payload: JwtPayload, secret:string, expiresIn:SignOptions)=>{
 const token = jwt.sign(payload,secret,{expiresIn} as SignOptions)
 return token
}


const handleVerifiedToken =(token:string,secret:string)=>{
    try {
         const verifyToken = jwt.verify(token,secret)
         return{
            success:true,
            data:verifyToken
         }
    } catch (error:any) {
          console.log("Token verification failed");
        return{
            success:false,
            error: error.message
        }
    }
}

export const jwtUtils={
    createToken,
    handleVerifiedToken
}