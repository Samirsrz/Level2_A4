import { Router } from "express";
import { auth } from "../../middleware/auth";
import { paymentController } from "./payment.controller";


const router = Router()

router.post("/create",auth("TENANT"),paymentController.createPayment)


router.post("/confirm",auth("TENANT"),paymentController.confirmPayment)


export const paymentRoutes = router