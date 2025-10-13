/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  IProduct,
  loginUserParams,
  OnlyTokenParams,
  RegisterUserParams,
  TokenWithAddressParams,
} from "./types";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const login = async ({ email, password }: loginUserParams) => {
  try {
    const response = await fetch(`${BASE_URL}/user/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
      throw new Error("your email or password is wrong!!");
    }
    const data = await response.json();

    if (!data) {
      throw new Error("can't get user data");
    }
    const { user, token } = data;

    console.log(user);

    return { user, token };
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const register = async ({
  firstName,
  lastName,
  email,
  password,
}: RegisterUserParams) => {
  try {
    const response = await fetch(`${BASE_URL}/user/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ firstName, lastName, email, password }),
    });
    if (!response.ok) {
      throw new Error("register user failed!!");
    }
    const data = await response.json();
    const { user, token } = data;

    return { user, token };
  } catch (err) {
    console.error(err);
    throw err;
  }
};
export const logout = async () => {
  window.localStorage.clear();
  return;
};

export const getAllProducts = async (): Promise<IProduct[]> => {
  try {
    const response = await fetch(`${BASE_URL}/product`);
    if (!response.ok) {
      throw new Error("can't get a product please check your connection!!");
    }
    const products: IProduct[] = await response.json();
    return products;
  } catch (err) {
    console.error(err);
    return [] as IProduct[];
  }
};

export const getUserCartItem = async ({ token }: OnlyTokenParams) => {
  try {
    if (!token) return;

    const response = await fetch(`${BASE_URL}/cart`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error("can't cart of user please check your connection!!");
    }

    const userCart = await response.json();

    return userCart;
  } catch (err) {
    console.error(err);

    return err;
  }
};

export const getAllUserOrders = async ({ token }: OnlyTokenParams) => {
  try {
    const response = await fetch(`${BASE_URL}/user/orders`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error("can't get user orders,  please check your connection!!");
    }
    const { orders } = await response.json();
    console.log(orders);
    return orders;
  } catch (err) {
    console.error(err);
    return err;
  }
};

export const createOrder = async ({
  token,
  address,
}: TokenWithAddressParams) => {
  try {
    if (!token) return;

    const response = await fetch(`${BASE_URL}/cart/checkout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ address }),
    });

    if (!response.ok) {
      throw new Error("can't create order, please check your connection!!");
    }

    const order = await response.json();

    return order;
  } catch (err: any) {
    console.error(err?.message);
    return err?.message;
  }
};

export const categories = [
  {
    id: 1,
    categoryName: "Gaming Mouse Pads",
    path: "/category/gaming-mouse-pads",
    image: "./mouse-2.jpg",
    description: "Precision-engineered for gamers",
  },
  {
    id: 2,
    categoryName: "Extended Desk Mats",
    path: "/category/extended-desk-mats",
    image: "./keyboard.jpg",
    description: "Full desk coverage for your setup",
  },
  {
    id: 3,
    categoryName: "Designer Collections",
    path: "/category/designer-collections",
    image: "./headset.jpg",
    description: "Unique patterns for creative professionals",
  },
  {
    id: 4,
    categoryName: "PC Accessories",
    path: "/category/pc-accessories",
    image: "./monitor.jpg",
    description: "Complete your workstation",
  },
];
