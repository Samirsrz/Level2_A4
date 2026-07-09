import { Router } from "express";
import { rentalController } from "./rentalRequest.controller";
import { auth } from "../../middleware/auth";


const router = Router()


router.post('/',auth("TENANT"),rentalController.createRentalRequest)

export const rentalRoutes = router