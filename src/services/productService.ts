import prisma from "../configs/db";
import { IProduct } from "../utils/types";
import { productSchema } from "../utils/validationSchema";

interface IAddProduct {
  product: IProduct;
}
export const addNewProduct = async ({ product }: IAddProduct) => {
  try {
    const validProductData = productSchema.safeParse(product);

    if (!validProductData.success) {
      return { data: "the product data are not valid", statusCode: 400 };
    }
    const { title, description, category, image, price, stock } =
      validProductData.data;


    const newProduct = await prisma.product.create({
      data: {
        title,
        description: description!,
        category: category!,
        image,
        price,
        stock,
      },
    });

    
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
    const existProduct = await prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!existProduct) {
      return { data: "this product not found!!", statusCode: 400 };
    }

    const validProductData = productSchema.safeParse(product);

    if (!validProductData.success) {
      return { data: "the product data are not valid", statusCode: 400 };
    }

    const { title, description, category, image, price, stock } =
      validProductData.data;

    const updatedProduct = await prisma.product.update({
      where: {
        id: productId,
      },
      data: {
        title,
        description: description!,
        category: category!,
        image,
        price,
        stock,
      },
    });

    return { data: updatedProduct, statusCode: 200 };
  } catch (err) {
    return { data: "can't update product info", statusCode: 400 };
  }
};
