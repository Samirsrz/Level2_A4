import { Router } from "express";
import { auth } from "../../middleware/auth";
import { adminController } from "./admin.controller";

const router = Router()



router.get("/users", auth("ADMIN"), adminController.getAllUsers);

export const adminRoutes = router