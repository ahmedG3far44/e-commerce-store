import { Router } from "express";
import { getUserOrders, login, register } from "../services/userService";
import verifyToken from "../middlewares/verifyToken";
import { ExtendedRequest } from "../utils/types";

const router = Router();

router.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const result = await register({ firstName, lastName, email, password });
    res.status(result.statusCode).json(result.data);
  } catch (err: any) {
    res.status(500).json(err.message);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await login({ email, password });
    res.status(result.statusCode).json(result.data);
  } catch (err: any) {
    res.status(500).json(err.message);
  }
});

router.get("/orders", verifyToken, async (req: ExtendedRequest, res) => {
  try {
    const userId = req.user?.id!;
    const result = await getUserOrders({ userId });
    res.status(result.statusCode).json(result.data);
  } catch (err: any) {
    res.status(500).json(err.message);
  }
});

export default router;
