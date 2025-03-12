import { IProduct } from "../utils/types";
import { productSchema } from "../utils/validationSchema";
import product from "../models/product";
import productModel from "../models/product";

export const getAllProducts = async () => {
  try {
    const products = await productModel.find();
    return { data: products, statusCode: 200 };
  } catch (err: any) {
    return { data: err.message, statusCode: 400 };
  }
};
interface AddProductParams {
  productData: string;
}
export const addNewProduct = async ({ productData }: AddProductParams) => {
  try {
    const validProductData = productSchema.safeParse(productData);

    if (!validProductData.success) {
      console.log(validProductData.error.flatten().fieldErrors);
      return {
        data: `the product data are not valid => ${validProductData.error.message}`,
        statusCode: 400,
      };
    }

    const newProduct = await product.insertOne({ ...validProductData.data });
    await newProduct.save();

    return { data: newProduct, statusCode: 201 };
  } catch (err) {
    return { data: "can't create a product", statusCode: 400 };
  }
};

interface IUpdateProduct {
  product: IProduct;
  productId: string;
}
export const updateNewProduct = async ({
  productId,
  product,
}: IUpdateProduct) => {
  try {
    const existProduct = await productModel.findById(productId);

    if (!existProduct) {
      return { data: "this product not found!!", statusCode: 400 };
    }

    const validProductData = productSchema.safeParse(product);

    if (!validProductData.success) {
      return { data: "the product data are not valid", statusCode: 400 };
    }

    const updatedProduct = await productModel.findByIdAndUpdate(productId, {
      ...validProductData.data,
    });
    if (!updatedProduct) {
      return { data: "can't update product info", statusCode: 400 };
    }
    await updatedProduct.save();

    return { data: updatedProduct, statusCode: 203 };
  } catch (err) {
    return { data: "can't update product info", statusCode: 400 };
  }
};

interface GetProductByIdParams {
  productId: string;
}
export const getProductById = async ({ productId }: GetProductByIdParams) => {
  try {
    const productDetails = await productModel.findById({ _id: productId });

    if (!productDetails) {
      return { data: "The product doesn't found!!", statusCode: 400 };
    }
    return { data: productDetails, statusCode: 200 };
  } catch (err) {
    return { data: "can't get product by Id", statusCode: 400 };
  }
};
