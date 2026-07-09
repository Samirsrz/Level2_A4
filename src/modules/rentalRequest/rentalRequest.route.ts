import { Router } from "express";
import { rentalController } from "./rentalRequest.controller";
import { auth } from "../../middleware/auth";


const router = Router()


router.post('/',auth("TENANT"),rentalController.createRentalRequest)
router.get('/',auth("TENANT"),rentalController.getMyrentalRequest)
router.get('/:id',auth("TENANT","LANDLORD"),rentalController.getRentalRequestById)

export const rentalRoutes = router

