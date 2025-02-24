import { Router } from "express";
import userRoute from "./userRoute";
import productRoute from "./productRoute";
import cartRoute from "./cartRoute"

const router = Router();

router.use("/user", userRoute);
router.use("/", productRoute);
router.use("/", cartRoute);

export default router;
