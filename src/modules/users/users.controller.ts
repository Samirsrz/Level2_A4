import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { userService } from "./users.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status"

const createUser=catchAsync(async(req:Request,res:Response,next:NextFunction)=>{

    const payLoad =req.body;
    const user = await userService.createUserDB(payLoad)
  
     sendResponse(res,{
        success:true,
        statusCode: httpStatus.CREATED,
        message:"User created successfully",
        data:{
            user
        }

     })

})





export const userController = {
    createUser
}