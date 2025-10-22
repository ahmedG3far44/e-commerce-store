import { Router } from "express";
import verifyToken from "../middlewares/verifyToken";
import { ExtendedRequest } from "../utils/types";
import {
  addNewProduct,
  deleteProductById,
  getAllProducts,
  getProductById,
  updateNewProduct,
} from "../services/productService";

const router = Router();

router.get("/product", async (req, res) => {
  try {
    const result = await getAllProducts();
    res.status(result.statusCode).json(result.data);
  } catch (err: any) {
    res.status(500).json(err.message);
  }
});

router.post("/product", verifyToken, async (req: ExtendedRequest, res) => {
  try {
    const product = req.body;
    const result = await addNewProduct({ productData: product });
    res.status(result.statusCode).json(result.data);
  } catch (err: any) {
    res.status(500).send(err.message);
  }
});

router.put("/product/:id", verifyToken, async (req: ExtendedRequest, res) => {
  try {
    const product = req.body;
    const { id } = req.params;
    // const userId = req.user?.id;
    const result = await updateNewProduct({ productId: id, product });
    res.status(result.statusCode).json(result.data);
  } catch (err: any) {
    res.status(500).json(err.message);
  }
});
router.get("/product/:id", async (req: ExtendedRequest, res) => {
  try {
    const { id } = req.params;
    const result = await getProductById({ productId: id });
    res.status(result.statusCode).json(result.data);
  } catch (err: any) {
    res.status(500).json(err.message);
  }
});

router.delete("/product/:id", verifyToken, async (req: ExtendedRequest, res) => {
  try {
    const { id } = req.params;
    const result = await deleteProductById({ productId: id });
    res.status(result.statusCode).json(result.data);
  } catch (err: any) {
    res.status(500).json(err.message);
  }
});

export default router;
