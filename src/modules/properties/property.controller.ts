import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { ALLOWED_PROPERTY_TYPES } from "./propertyInterface";
import { propertyService } from "./property.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status"




const createProperty = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const landlordId = req.user?.id;

    if (!landlordId) {
      throw new Error("Unauthorized – landlord not identified");
    }

    const { type, price, title, description, location, amenities } = req.body;
    if (price < 0 || price===undefined) {
      throw new Error("Enter a valid price");
    }

    if (!type||!ALLOWED_PROPERTY_TYPES.includes(type.toUpperCase())) {
      throw new Error("Enter valid Property types like Room....");
    }

   if(!title || !description){
    throw new Error("Enter title and description")
   }

    const result = await propertyService.createPropertyDB(landlordId, req.body);

    sendResponse(res,{
        statusCode:httpStatus.CREATED,
        success:true,
        message:"Property listed successfully",
        data:{
            result
        }
    })
  },
);



const getAllProperty=catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
    const query = req.query;

    const result =  await propertyService.getAllPropertyDB(query)

})



export const propertyController  ={
    createProperty,
    getAllProperty
}