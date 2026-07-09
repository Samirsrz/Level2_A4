import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { rentalService } from "./rentalRequest.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status"

const createRentalRequest=catchAsync(async(req:Request,res:Response,next:NextFunction)=>{

    const tenantId = req.user?.id
    const {propertyId, startTime, endTime} = req.body

     if (new Date(startTime) >= new Date(endTime)) {
     return res.status(400).json({ message: "startTime must be before endTime" });
   }

    const payLoad = req.body

    const result = await rentalService.createRentalRequestDB(tenantId as string, payLoad )

    sendResponse(res,{
        success:true,
        statusCode:httpStatus.CREATED,
        message:"Your Rental Request has been created, wait for status",
        data:{
            result
        }
    })
    
})


export const rentalController = {
    createRentalRequest
}