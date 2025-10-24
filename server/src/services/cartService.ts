
import cartModel from "./../models/cart";
import userModel from "../models/user";
import productModel from "../models/product";
import orderModel from "../models/order";

import { CheckoutCartParams, CartProduct, IProductItem, ICart } from "../utils/types";
import { updateProductSales } from "./productService";

interface CreateCartParams {
  userId: string;
}

const createUserCart = async ({ userId }: CreateCartParams) => {
  let cart = await cartModel.create({ userId });
  await cart.save();
  return cart;
};

interface GetActiveCartParams {
  userId: string;
}

export const getActiveCart = async ({ userId }: GetActiveCartParams) => {
  try {
    let cart = await cartModel.findOne({ userId, status: "ACTIVE" });
    if (!cart) {
      cart = await createUserCart({ userId });
      return cart;
    }
    return cart;
  } catch (err) {
    return {
      data: `can't get user active cart ${err}`,
      statusCode: 400,
    };
  }
};

interface AddProductToCartParams {
  userId: string;
  productId: string;
  quantity: number;
}
export const addProductToCart = async ({
  userId,
  productId,
  quantity,
}: AddProductToCartParams) => {
  try {
    const product = await productModel.findById(productId);

    console.log(product)

    if (!product) {
      return { data: "this product not found", statusCode: 400 };
    }

    if (product.stock < quantity) {
      return { data: "this product is out of stock!!", statusCode: 400 };
    }

    let cart = await getActiveCart({ userId });

    if ("statusCode" in cart) {
      return cart;
    }


    const isAddedToCart = cart.items.find(
      (item) => item.productId.toString() === productId.toString()
    );

    if (isAddedToCart) {
      return { data: "this product is already on cart!!", statusCode: 400 };
    }

    const newProduct: IProductItem = {
      productId,
      product: {
        title: product.title,
        thumbnail: product.images?.[0] || "",
        description: product.description,
        categoryId: product.categoryId.toString(),
        categoryName: product.categoryName,
        price: product.price,
        stock: product.stock,
      },
      quantity,
    };

    console.log(newProduct)

    cart.items.push(newProduct);
    cart.totalAmount += product.price * quantity;

    const updatedCart = await cart.save();

    return { data: updatedCart, statusCode: 200 };
  } catch (err: any) {
    return { data: err.message, statusCode: 400 };
  }
};

interface UpdateItemsInCartParams {
  productId: string;
  userId: string;
  quantity: number;
}
export const updateItemsInCart = async ({
  productId,
  userId,
  quantity,
}: UpdateItemsInCartParams) => {
  try {
    let cart = await getActiveCart({ userId });

    if ("statusCode" in cart) {
      return cart;
    }

    const updatedItem = cart.items.find(
      (item) => item.productId.toString() === productId
    );

    if (!updatedItem) {
      return {
        data: "failed to update this item not found!!",
        statusCode: 400,
      };
    }

    console.log(updatedItem)

    updatedItem.quantity = quantity;
    
    updateProductSales(productId, updatedItem.quantity)

    cart.totalAmount = calculateItemsInCartTotalPrice(cart.items);

    const updatedCart = await cart.save();

    return { data: updatedCart, statusCode: 200 };
  } catch (err: any) {
    return { data: err.message, statusCode: 400 };
  }
};
const calculateItemsInCartTotalPrice = (totalItems: IProductItem[]): number => {
  return totalItems.reduce((acc, current) => {
    return acc + current.product.price * current.quantity;
  }, 0);
};

interface DeleteItemFromCartParams {
  userId: string;
  productId: string;
}
export const deleteItemFromCart = async ({
  userId,
  productId,
}: DeleteItemFromCartParams) => {
  try {
    let cart = await getActiveCart({ userId });

    if ("statusCode" in cart) {
      return cart;
    }

    // Find the item to delete (should use === not !==)
    const itemToDelete = cart.items.find(
      (item) => item.productId.toString() === productId
    );

    if (!itemToDelete) {
      return {
        data: "failed to delete this item!!",
        statusCode: 400,
      };
    }

    // Filter out the deleted item
    const totalItems = cart.items.filter(
      (item) => item.productId.toString() !== productId
    );

    const totalItemsPrice = calculateItemsInCartTotalPrice(totalItems);

    cart.totalAmount = totalItemsPrice;
    cart.items = totalItems;

    const deletedCart = await cart.save();

    return { data: deletedCart, statusCode: 200 };
  } catch (err) {
    return { data: err, statusCode: 400 };
  }
};

interface ClearCartParams {
  userId: string;
}
export const clearCart = async ({ userId }: ClearCartParams) => {
  try {
    let cart = await getActiveCart({ userId });

    if ("statusCode" in cart) {
      return cart;
    }

    cart.totalAmount = 0;
    cart.items = [];

    const clearedCart = await cart.save();

    return { data: clearedCart, statusCode: 200 };
  } catch (err) {
    return { data: err, statusCode: 400 };
  }
};

export const checkout = async ({ userId, shipInfo }: CheckoutCartParams) => {
  try {
    const cart = await getActiveCart({ userId });

    if ("statusCode" in cart) {
      return cart;
    }

    if (!cart.items.length) {
      return { data: "can't checkout cart is empty", statusCode: 400 };
    }

    let orderItems = [];
    let updatedProductStock;

    for (const item of cart.items) {
      const product = await productModel.findById(item.productId);
      if (!product) {
        return { data: "error products order not found!!", statusCode: 400 };
      }

      const productOrder = {
        productTitle: product?.title || "",
        productDescription: product?.description || null,
        productImages: product?.images?.[0] || "",
        productPrice: product?.price,
        quantity: item.quantity,
      };

      orderItems.push(productOrder);

      if (product?.stock < item.quantity) {
        return { data: "there is no enough stock in ", statusCode: 400 };
      }

      updatedProductStock = await productModel.findByIdAndUpdate(product?.id, {
        stock: (product?.stock - item?.quantity) as number,
      });
    }

    const customer = await userModel.findById(userId);

    if (!customer) throw new Error("not foud user !!");

    const order = await orderModel.create({
      orderItems,
      customer: {
        name: `${customer?.firstName} ${customer?.lastName}`,
        email: customer.email,
        address: shipInfo?.address,
        area: `${shipInfo?.state} | ${shipInfo?.country}`,
        phone: shipInfo?.phone,
      },
      userId,
      totalOrderPrice: cart.totalAmount,
    });

    const updateCartStatus = await cartModel.findByIdAndUpdate(userId, {
      status: "COMPLETED",
    });

    const userOrder = await order.save();
    await updateCartStatus?.save();
    await updatedProductStock?.save();
    await clearCart({ userId });

    return { data: userOrder, statusCode: 201 };
  } catch (err) {
    return { data: err, statusCode: 400 };
  }
};

