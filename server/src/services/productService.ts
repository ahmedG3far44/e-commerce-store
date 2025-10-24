import { productSchema } from "../utils/validationSchema";
import product from "../models/product";
import productModel from "../models/product";
import categoryModel from "../models/category"; 
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import s3Client from "../configs/s3Client";

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

      return {
        data: `the product data are not valid => ${validProductData.error.message}`,
        statusCode: 400,
      };
    }

    const category = await categoryModel.findById(validProductData.data.categoryId);
    if (!category) {
      return {
        data: "Category not found",
        statusCode: 400,
      };
    }


    const newProduct = await product.insertOne({
      ...validProductData.data,
      categoryName:validProductData.data.categoryName.split(" ").join("-").toLocaleLowerCase().trim(),
      totalSales: 0, 
      ordersCount: 0, 
    });
    await newProduct.save();
    return { data: newProduct, statusCode: 201 };
  } catch (err) {
    return { data: "can't create a product", statusCode: 400 };
  }
};

interface IUpdateProduct {
  product: any;
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

    let categoryName = existProduct.categoryName;
    if (String(existProduct.categoryId) !== validProductData.data.categoryId) {
      const category = await categoryModel.findById(validProductData.data.categoryId);
      if (!category) {
        return {
          data: "Category not found",
          statusCode: 400,
        };
      }
      categoryName = category.name;
    }

   
    const updatedProduct = await productModel.findByIdAndUpdate(
      productId,
      {
        ...validProductData.data,
        categoryName,
        totalSales: existProduct.totalSales, 
        ordersCount: existProduct.ordersCount, 
      },
      { new: true } 
    );

    if (!updatedProduct) {
      return { data: "can't update product info", statusCode: 400 };
    }

    // Note: findByIdAndUpdate returns the updated doc, no need to save again
    return { data: updatedProduct, statusCode: 200 }; // Changed from 203 to 200
  } catch (err) {
    return { data: "can't update product info", statusCode: 400 };
  }
};


interface GetProductByCategoryNameParams{
  categoryName:string;
}
export const getProductsByCategoryName = async({ categoryName }: GetProductByCategoryNameParams)=> {
  try{
    const products = await productModel.find({
      categoryName
    })
    if(!products) throw new Error("no products found !!")

      return {data:products, statusCode:200}
    }catch(error){
    return {data:`Error: ${(error as Error).message }`, statusCode:400}

  }
}

interface GetProductByIdParams {
  productId: string;
}

export const getProductById = async ({ productId }: GetProductByIdParams) => {
  try {
    const productDetails = await productModel.findById(productId); // Simplified
    if (!productDetails) {
      return { data: "The product doesn't found!!", statusCode: 404 }; // Changed to 404
    }
    return { data: productDetails, statusCode: 200 };
  } catch (err) {
    return { data: "can't get product by Id", statusCode: 400 };
  }
};

export const deleteProductById = async ({ productId }: GetProductByIdParams) => {
  try {
    const product = await productModel.findById(productId); 
    if (!product) {
      return { 
        data: "failed to delete, this product doesn't exist!!", 
        statusCode: 404 
      };
    }
    for (const img of product?.images as string[]){
      const deletedKey = img.split(".com/")[1].trim();

      const command = new DeleteObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET,
        Key: deletedKey
      });
    

      await s3Client.send(command).then(()=>{

      }).catch((error)=> {
        return { data: "can't delete product by Id", statusCode: 400 };
      })
    }
    
    // Delete the product from database
    await productModel.findByIdAndDelete(productId);
    return { data: product, statusCode: 200, message:"product deleted success!!" };
  } catch (err) {
    return { data: "can't delete product by Id", statusCode: 400 };
  }
};


export const updateProductSales = async (productId: string, quantity: number) => {
  return await productModel.findByIdAndUpdate(
    productId,
    {
      $inc: { totalSales: quantity, ordersCount: 1 }
    },
    { new: true }
  );
};