import { Router } from "express";
import { rentalController } from "./rentalRequest.controller";
import { auth } from "../../middleware/auth";


const router = Router()


router.post('/rentals',auth("TENANT"),rentalController.createRentalRequest)

router.get('/rentals',auth("TENANT"),rentalController.getMyrentalRequest)

router.get('/rentals/:id',auth("TENANT","LANDLORD"),rentalController.getRentalRequestById)

router.get('/landlord/requests',auth("LANDLORD"),rentalController.getLandlordPropertyRequests)

router.patch('/landlord/requests/:id',auth("LANDLORD"),rentalController.updateStatusOfRequest)


export const rentalRoutes = router

