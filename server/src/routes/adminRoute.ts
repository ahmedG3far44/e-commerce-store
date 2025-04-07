import { Router } from "express";
import { ExtendedRequest } from "../utils/types";
import {
  getAdminInsights,
  getAllUsers,
  getOrderStatusCounts,
  getCompletedOrders,
  getPendingOrders,
  getShippedOrders,
  updateOrderStatus,
} from "../services/adminService";

import {
  getOrderCount,
  getRevenueByTime,
  getTopCustomers,
  // getProfitMargins
} from '../controllers/adminControllers';

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
router.get("/orders-insights", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const result = await getOrderStatusCounts();
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
router.get(
  "/insights/:duration",
  verifyToken,
  verifyAdmin,
  async (req, res) => {
    try {
      const { duration } = req.params;

      if (!duration) throw new Error("can't get the insights!!");
      const result = await getAdminInsights({ duration });
      console.log(result);
      res.status(result?.statusCode || 200).json(result?.data);
    } catch (err: any) {
      res.status(500).json(err?.message);
    }
  }
);

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

router.get('/orders/status-counts', verifyToken, verifyAdmin, getOrderCount);
router.get('/revenue/:period', verifyToken, verifyAdmin, getRevenueByTime);
router.get('/customers/top', verifyToken, verifyAdmin, getTopCustomers);
// router.get('/profit-margins', verifyToken, verifyAdmin, getProfitMargins);

export default router;