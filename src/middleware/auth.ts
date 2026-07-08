import { NextFunction, Request, Response } from "express";
import { Role } from "../../generated/prisma/enums";
import { catchAsync } from "../utils/catchAsync";
import { jwtUtils } from "../jwt";
import config from "../config";
import { JwtPayload } from "jsonwebtoken";
import { prisma } from "../lib/prisma";


declare global{
    namespace Express{
        interface Request{
            user?:{
                email:string,
                name:string,
                id:string,
                role:Role
            }
        }
    }
}





export const auth=(...requiredRoles:Role[])=>{
    return catchAsync(
      async (req: Request, res: Response, next: NextFunction) => {
        const token = req.cookies.accessToken
          ? req.cookies.accessToken
          : req.headers.authorization?.startsWith("Bearer")
            ? req.headers.authorization?.split(" ")[1]
            : req.headers.authorization;

        if (!token) {
          throw new Error("You are not logged In");
        }

        const verifyToken = jwtUtils.handleVerifiedToken(
          token,
          config.jwt_access_secret,
        );
        if (!verifyToken.success) {
          throw new Error(verifyToken.error);
        }

        const { email, name, id, role } = verifyToken.data as JwtPayload;
     
         if(requiredRoles.length && !requiredRoles.includes(role)){

            throw new Error("Forbidden, you don't have permission")
         }

         const user = await prisma.user.findUnique(({
            where:{
                id,email,name,role
            }
         }))

         if(!user){
            throw new Error("User not found, Please log in again")
         }

         if(user.status==="BANNED"){
            throw new Error("Your account has been banned")
         }
         
         req.user = {
            email,
            name,
            id,
            role
         }

       next()
      },
    );
}