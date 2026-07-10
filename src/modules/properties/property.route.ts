import { Router } from "express";
import { propertyController } from "./property.controller";
import { auth } from "../../middleware/auth";


const router = Router();


router.post("/properties",auth("LANDLORD"), propertyController.createProperty)

router.get("/properties",propertyController.getAllProperty)

router.get("/properties/:id",propertyController.getPropertyById)

router.put("/properties/:id",auth("LANDLORD"),propertyController.updateProperty)

router.delete("/properties/:id",auth("LANDLORD"),propertyController.deleteProperty)




router.get("/myproperties",propertyController.getMyProperties)



export const propertyRoutes = router