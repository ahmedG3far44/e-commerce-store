import { Router } from "express";
import { ExtendedRequest, ShipInfo } from "../utils/types";
import {
  addProductToCart,
  checkout,
  clearCart,
  deleteItemFromCart,
  getActiveCart,
  updateItemsInCart,
} from "../services/cartService";

import verifyToken from "../middlewares/verifyToken";

const router = Router();

router.get("/cart", verifyToken, async (req: ExtendedRequest, res) => {
  try {
    const userId = req.user?.id!;
    const cart = await getActiveCart({ userId });
    res.status(200).json(cart);
  } catch (err: any) {
    res.status(500).json(err.message);
  }
});

router.post("/cart/items", verifyToken, async (req: ExtendedRequest, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user?.id!;
    const result = await addProductToCart({
      productId,
      userId,
      quantity,
    });
    res.status(result.statusCode).json(result.data);
  } catch (err: any) {
    res.status(500).json(err.message);
  }
});

router.put("/cart/items", verifyToken, async (req: ExtendedRequest, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user?.id!;
    const result = await updateItemsInCart({
      productId,
      userId,
      quantity,
    });
    res.status(result.statusCode).json(result.data);
  } catch (err: any) {
    res.status(500).json(err.message);
  }
});

router.delete(
  "/cart/items/:productId",
  verifyToken,
  async (req: ExtendedRequest, res) => {
    try {
      const { productId } = req.params;
      const userId = req.user?.id!;
      const result = await deleteItemFromCart({
        productId,
        userId,
      });
      res.status(result.statusCode).json(result.data);
    } catch (err: any) {
      res.status(500).json(err.message);
    }
  }
);

router.delete("/cart/items", verifyToken, async (req: ExtendedRequest, res) => {
  try {
    const userId = req.user?.id!;
    const result = await clearCart({
      userId,
    });
    res.status(result.statusCode).json(result.data);
  } catch (err: any) {
    res.status(500).json(err.message);
  }
});

router.post(
  "/cart/checkout",
  verifyToken,
  async (req: ExtendedRequest, res) => {
    try {
      const userId = req.user?.id!;
      const payload: ShipInfo = req.body;
      const result = await checkout({
        userId,
        shipInfo: {
          ...payload,
        },
      });
      res.status(result.statusCode).json(result.data);
    } catch (err: any) {
      res.status(500).json(err.message);
    }
  }
);

export default router;
