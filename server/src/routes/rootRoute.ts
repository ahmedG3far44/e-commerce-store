import { Router } from "express";
import userRoute from "./userRoute";
import productRoute from "./productRoute";
import cartRoute from "./cartRoute";
import adminRoute from "./adminRoute";
import uploadRoute from "./uploadRoute";

const router = Router();

router.use("/user", userRoute);
router.use("/", productRoute);
router.use("/", cartRoute);
router.use("/upload", uploadRoute);
router.use("/admin", adminRoute);

export default router;
