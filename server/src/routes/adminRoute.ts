import { Router } from "express";
import { ExtendedRequest } from "../utils/types";
import {
  getAllUsers,
  getCompletedOrders,
  getPendingOrders,
  getShippedOrders,
  updateOrderStatus,
} from "../services/adminService";
import verifyToken from "../middlewares/verifyToken";
import verifyAdmin from "../middlewares/verifyAdmin";

const router = Router();

router.get(
  "/orders",
  verifyToken,
  verifyAdmin,
  async (req: ExtendedRequest, res) => {
    try {
      const result = await getCompletedOrders();
      res.status(result.statusCode).json(result.data);
    } catch (err: any) {
      res.status(500).json(err?.message);
    }
  }
);

router.get("/shipped-orders", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const result = await getShippedOrders();
    res.status(result.statusCode).json(result.data);
  } catch (err: any) {
    res.status(500).json(err.message);
  }
});
router.get("/pending-orders", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const result = await getPendingOrders();
    res.status(result.statusCode).json(result.data);
  } catch (err: any) {
    res.status(500).json(err.message);
  }
});

router.get("/users", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const result = await getAllUsers();
    res.status(result.statusCode).json(result.data);
  } catch (err: any) {
    res.status(500).json(err?.message);
  }
});

router.put(
  "/orders",
  verifyToken,
  verifyAdmin,
  async (req: ExtendedRequest, res) => {
    try {
      const { orderId, status } = req.body;
      const result = await updateOrderStatus({ orderId, newStatus: status });
      res.status(result.statusCode).json(result.data);
    } catch (err: any) {
      res.status(500).json(err?.message);
    }
  }
);

export default router;
