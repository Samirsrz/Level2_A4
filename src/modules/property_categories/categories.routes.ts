import { Router } from "express";
import { categoriesController } from "./categories.controller";

const router = Router()


router.get("/categories",categoriesController.getPropertyCategories)

export const categoriesRoutes=router