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

export interface GetAdminInsightsParams {
  duration:
    | string
    | "toady"
    | "this-month"
    | "last-month"
    | "last-6-month"
    | "last-12-month";
}

export interface CheckoutCartParams {
  userId: string;
  shipInfo: ShipInfo;
}
export interface ShipInfo {
  address: string;
  country?: string;
  state?: string;
  phone?: string;
}
export interface Customer {
  name: string;
  email?: string;
  address:string;
  area?: string;
  phone?: string;
}


export interface GetOrderByStatus {
  state: string | "pending" | "shipped" | "delivered" | "canceled";
}