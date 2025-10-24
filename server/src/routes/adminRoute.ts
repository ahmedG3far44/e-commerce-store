import { Router } from "express";
import { ExtendedRequest } from "../utils/types";
import {
  getAdminInsights,
  getAllUsers,
  getOrderStatusCounts,
  updateOrderStatus,
  getSalesInsights,
  getOrdersByStatus,
} from "../services/adminService";

import {
  getOrderCount,
  getRevenueByTime,
  getTopCustomers,
  // getProfitMargins
} from "../controllers/admin.controller";

import verifyToken from "../middlewares/verifyToken";
import verifyAdmin from "../middlewares/verifyAdmin";
import { deleteUserStatus, updateUserStatus } from "../services/userService";

const router = Router();



router.get(
  "/orders/:state",
  verifyToken,
  verifyAdmin,
  async (req: ExtendedRequest, res) => {
    try {
      const state = req.params.state;
      if (!state) throw Error("status not found!!");
      const result = await getOrdersByStatus({ state: state.toUpperCase() });
      res.status(result.statusCode).json(result.data);
    } catch (err: any) {
      res.status(500).json(err.message);
    }
  }
);

router.get("/orders-insights", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const result = await getOrderStatusCounts();
    res.status(result.statusCode).json(result.data);
  } catch (err: any) {
    res.status(500).json(err.message);
  }
});
router.get("/sales", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const result = await getSalesInsights();
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

router.get("/orders/status-counts", verifyToken, verifyAdmin, getOrderCount);
router.get("/revenue/:period", verifyToken, verifyAdmin, getRevenueByTime);
router.get("/customers/top", verifyToken, verifyAdmin, getTopCustomers);


router.patch("/users/:userId/block", verifyAdmin, async (req: ExtendedRequest, res) => {
  try {
    const payload = req.body;
    const {userId} = req.params;
    const result = await updateUserStatus({ userId, newStatus:payload.newStatus });
    res.status(result.statusCode).json(result.data);
  } catch (err: any) {
    res.status(500).json(err.message);
  }
});
router.delete("/users/:userId", verifyAdmin, async (req: ExtendedRequest, res) => {
  try {
    const { userId } = req.params;
    if(!userId)throw new Error("userId is required !!")
    const result = await deleteUserStatus({ userId });
    res.status(result.statusCode).json(result.data);
  } catch (err: any) {
    res.status(500).json(err.message);
  }
});
export default router;
