import { Router } from "express";
import { reviewContoller } from "./reviews.controller";
import { auth } from "../../middleware/auth";


const router =Router()
 
router.post("/",auth("TENANT"), reviewContoller.createReviews)


export const reviewRoutes = router