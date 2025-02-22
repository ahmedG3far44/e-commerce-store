import { Router } from "express";
import userRoute from "./userRoute";
import productRoute from "./productRoute";

const router = Router();

router.use("/user", userRoute);

router.use("/", productRoute);

export default router;
