import cartModel from "./../models/cart";
import product from "../models/product";
import userModel from "../models/user";
import productModel from "../models/product";

interface GetActiveCartParams {
  userId: string;
}

const createUserCart = async ({ userId }: GetActiveCartParams) => {
  let cart = await cartModel.create({ userId });
  await cart.save();
  return cart;
};

export const getActiveCart = async ({ userId }: GetActiveCartParams) => {
  try {
    let cart = await cartModel.findOne({ userId });
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
      (item) => item.productId.toString() === productId
    );

    if (isAddedToCart) {
      return { data: "this product is already on cart!!", statusCode: 400 };
    }

    cart.items.push({
      price: product.price,
      quantity,
      productId,
    });

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

    updatedItem.quantity = quantity;

    const totalItems = cart.items.filter(
      (item) => item.productId !== productId
    );

    const totalItemsPrice = calculateItemsInCartTotalPrice(totalItems);

    cart.totalAmount = totalItemsPrice;

    const updatedCart = await cart.save();

    return { data: updatedCart, statusCode: 200 };
  } catch (err: any) {
    return { data: err.message, statusCode: 400 };
  }
};

const calculateItemsInCartTotalPrice = (totalItems: any[]): number => {
  return totalItems.reduce((acc, current) => {
    return acc + current.price * current.quantity;
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

    const deletedItems = cart.items.find(
      (item) => item.productId.toString() !== productId
    );

    if (!deletedItems) {
      return {
        data: "failed to delete this item!!",
        statusCode: 400,
      };
    }

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
