import { Router } from "express";
import { auth } from "../../middleware/auth";
import { adminController } from "./admin.controller";

const router = Router()



router.get("/users", auth("ADMIN"), adminController.getAllUsers);
router.get("/properties", auth("ADMIN"), adminController.getAllProperties);
router.patch("/users/:id", auth("ADMIN"), adminController.updateUserStatus);

export const adminRoutes = router