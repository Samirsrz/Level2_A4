

import httpStatus from "http-status"

// getting Property Categories ,-> Here we dont have to go inside the DB as we have declared the PropertyTypes as enums so direct returning it

import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { PropertyType } from "../../../generated/prisma/enums";
import { sendResponse } from "../../utils/sendResponse";

const getPropertyCategories = catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
      const categories = Object.values(PropertyType);

      sendResponse(res,{
        success:true,
        statusCode:httpStatus.OK,
        message:"Property categories retrieved successfully",
        data:{
          categories
        }
      })
})


export const categoriesController ={
    getPropertyCategories
}