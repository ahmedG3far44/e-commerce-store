import { Router } from "express";
import verifyToken from "../middlewares/verifyToken";
import { ExtendedRequest } from "../utils/types";
import { addNewProduct, updateNewProduct } from "../services/productService";

const router = Router();

router.post("/product", async (req: ExtendedRequest, res) => {
  try {
    const product = req.body;
    // const userId = req.user?.id;
    const result = await addNewProduct({ product });
    res.status(result.statusCode).send(result.data);
  } catch (err: any) {
    res.status(500).send(err.message);
  }
});

router.put("/product/:id", verifyToken, async (req: ExtendedRequest, res) => {
  try {
    const product = req.body;
    const { id } = req.params;
    const userId = req.user?.id;
    const result = await updateNewProduct({productId:id, product });
    res.status(result.statusCode).send(result.data);
  } catch (err: any) {
    res.status(500).send(err.message);
  }
});

export default router;
