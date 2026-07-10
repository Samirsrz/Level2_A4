import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { reviewService } from "./reviews.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status"

const createReviews=catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
    const tenantId =  req.user?.id    
    const payLoad = req.body;
    const {rentalRequestId} = req.body

    const result = await reviewService.createReviewsDB(tenantId as string,rentalRequestId as string, payLoad )

    sendResponse(res,{
        success:true,
        statusCode:httpStatus.CREATED,
        message:"Your review has been submitted",
        data:result
    })
     

})


export const reviewContoller ={
    createReviews
}