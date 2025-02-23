import { Router } from "express";
import { ExtendedRequest } from "../utils/types";
import {
  addProductToCart,
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
    res.status(200).send(cart);
  } catch (err: any) {
    res.status(500).send(err.message);
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
    res.status(result.statusCode).send(result.data);
  } catch (err: any) {
    res.status(500).send(err.message);
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
    res.status(result.statusCode).send(result.data);
  } catch (err: any) {
    res.status(500).send(err.message);
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
      res.status(result.statusCode).send(result.data);
    } catch (err: any) {
      res.status(500).send(err.message);
    }
  }
);

router.delete("/cart/items", verifyToken, async (req: ExtendedRequest, res) => {
  try {
    const userId = req.user?.id!;
    const result = await clearCart ({
      userId,
    });
    res.status(result.statusCode).send(result.data);
  } catch (err: any) {
    res.status(500).send(err.message);
  }
});

export default router;
