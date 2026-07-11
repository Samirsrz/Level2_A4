import { Router } from "express";
import { auth } from "../../middleware/auth";
import { paymentController } from "./payment.controller";


const router = Router()

router.post("/create",auth("TENANT"),paymentController.createPayment)


router.post("/confirm",auth("TENANT"),paymentController.confirmPayment)



router.get("/", auth("TENANT"), paymentController.getMyPayments);


router.get("/:id", auth("TENANT", "LANDLORD"), paymentController.getPaymentById);


export const paymentRoutes = router