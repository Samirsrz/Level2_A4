import { Router } from "express";
import { userController } from "./users.controller";



// Only route to create user

const router = Router()

router.post("/register",userController.createUser)






export const userRoutes = router