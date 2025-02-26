import { Request } from "express";
import { GenerateTokenParams } from "../services/userService";

export interface ExtendedRequest extends Request {
  user?: GenerateTokenParams | undefined;
}

export interface IProduct {
  title: string;
  description: string | null;
  category: string | null;
  image: string | null;
  price: number;
  stock: number;
}

export interface IProductItem {
  productId: string;
  product: IProduct;
  quantity: number;
}
export interface ICart {
  items: IProductItem[];
  status: string;
  totalAmount: number;
  userId: string;
}
