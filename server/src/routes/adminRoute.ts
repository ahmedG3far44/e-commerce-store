import { Router } from "express";
import { ExtendedRequest } from "../utils/types";
import { getAllUsers, getPendingOrders, updateOrderStatus } from "../services/adminService";

const router = Router();

router.get("/orders", async (req: ExtendedRequest, res) => {
  try {
    // const {} = req.body;
    const result = await getPendingOrders();
    res.status(result.statusCode).json(result.data);
  } catch (err: any) {
    res.status(500).json(err?.message);
  }
});
router.get("/users", async (req: ExtendedRequest, res) => {
    try {
      // const {} = req.body;
      const result = await getAllUsers();
      res.status(result.statusCode).json(result.data);
    } catch (err: any) {
      res.status(500).json(err?.message);
    }
  });

router.put("/orders", async (req: ExtendedRequest, res) => {
  try {
    const { orderId, status } = req.body;
    const result = await updateOrderStatus({ orderId, newStatus: status });
    res.status(result.statusCode).json(result.data);
  } catch (err: any) {
    res.status(500).json(err?.message);
  }
});

export default router;
