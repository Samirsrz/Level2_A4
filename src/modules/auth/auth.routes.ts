import { Router } from "express";
import { authController } from "./auth.controller";
import { auth } from "../../middleware/auth";


const router = Router()

router.post('/login',authController.loginUser)
router.post('/google', authController.googleLogin)
router.get('/me',auth(),authController.getCurrentUser)

export const authRoutes = router