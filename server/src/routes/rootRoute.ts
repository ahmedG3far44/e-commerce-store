import { Router } from "express";
import userRoute from "./userRoute";
import productRoute from "./productRoute";
import cartRoute from "./cartRoute";
import adminRoute from "./adminRoute";
import uploadRoute from "./uploadRoute";
import categoryRoute from "./categoryRoute"

const router = Router();

router.use("/user", userRoute);
router.use("/", productRoute);
router.use("/", cartRoute);
router.use("/upload", uploadRoute);
router.use("/admin", adminRoute);
router.use("/", categoryRoute);

export default router;
