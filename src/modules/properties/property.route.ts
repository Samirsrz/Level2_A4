import { Router } from "express";
import { propertyController } from "./property.controller";
import { auth } from "../../middleware/auth";


const router = Router();


router.post("/properties",auth("LANDLORD"), propertyController.createProperty)

router.get("/properties",propertyController.getAllProperty)


export const propertyRoutes = router