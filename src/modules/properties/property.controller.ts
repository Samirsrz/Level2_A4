import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { ALLOWED_PROPERTY_TYPES } from "./propertyInterface";
import { propertyService } from "./property.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status"
import { PropertyType } from "../../../generated/prisma/enums";




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

    sendResponse(res,{
        success:true,
        statusCode:httpStatus.OK,
        message:"Properties fetched successfully",
        data:result
    })
     
})


const getPropertyById = catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
     const id = req.params.id;
     if(!id){
       throw new Error("Post ID is required in params")
     }

     const singleProperty =  await propertyService.getPropertyById_DB(id as string);
      sendResponse(res,{
        success:true,
        statusCode:httpStatus.OK,
        message:"Single Property feched successfully",
        data:singleProperty
       })
})



const updateProperty=catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
   const id = req.params.id;

    const landlordId = req.user?.id;

    const isLandlord = req.user?.role==="LANDLORD"
    const payload  = req.body
   
    if(!id){
       throw new Error("Property ID is required in params")
     }


      const result = await propertyService.updatePropertyDB(id as string, payload, landlordId as string, isLandlord )

    sendResponse(res,{
        success:true,
        statusCode:httpStatus.OK,
        message:"Property updated successfully",
        data:result
       })



})


const deleteProperty=catchAsync(async(req:Request,res:Response,next:NextFunction)=>{

    const id = req.params.id;

    const landlordId = req.user?.id;

     if(!id){
       throw new Error("Property does not exist")
     }

     const result = await propertyService.deletePropertyDB(id as string,landlordId as string)

     sendResponse(res,{
        success:true,
        statusCode:httpStatus.OK,
        message:"Property deleted successfully",
        data:result
       })

})






export const propertyController={
    createProperty,
    getAllProperty,
    getPropertyById,
    updateProperty,
    deleteProperty,
   
}