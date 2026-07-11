import cookieParser from "cookie-parser";
import express,{ Application, Request, Response } from "express";
import cors from "cors"
import config from "./config";
import { userRoutes } from "./modules/users/users.route";
import { authRoutes } from "./modules/auth/auth.routes";
import { propertyRoutes } from "./modules/properties/property.route";
import { categoriesRoutes } from "./modules/property_categories/categories.routes";
import { rentalRoutes } from "./modules/rentalRequest/rentalRequest.route";
import { reviewRoutes } from "./modules/reviews/reviews.routes";
import { adminRoutes } from "./modules/admin/admin.routes";
import { paymentRoutes } from "./modules/payment/payment.route";

const app: Application = express()

app.use(cors({
  origin: config.app_url,
  credentials: true
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.get("/", (req: Request, res: Response) => {
  res.send("Hello world")
})

app.use('/api/payments', paymentRoutes)
app.use("/api/users", userRoutes)
app.use("/api/auth", authRoutes)
app.use("/api/landlord", propertyRoutes)
app.use("/api", categoriesRoutes)
app.use("/api", rentalRoutes)
app.use("/api/reviews", reviewRoutes)
app.use('/api/admin', adminRoutes)

export default app;