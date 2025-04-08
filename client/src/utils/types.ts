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
  updatedAt: Date;
}
export interface ICart {
  items: IProductItem[];
  status: string;
  totalAmount: number;
  userId: string;
}

export interface User {
  firstName: string;
  lastName: string;
  email: string;
  isAdmin: boolean;
  addresses?: string[];
}

export interface AddAndUpdateItemsToCartParamsType {
  productId: string;
  quantity: number;
  token: string;
}
export interface DeleteItemCartParamsType {
  productId: string;
  token: string;
}
export interface ClearCartParamsType {
  token: string;
}
export interface CartContextType {
  cartItems: IProductItem[];
  totalAmount: number;
  addItemToCart: ({
    productId,
    quantity,
    token,
  }: AddAndUpdateItemsToCartParamsType) => void;
  updateItemInCart: ({
    productId,
    quantity,
    token,
  }: AddAndUpdateItemsToCartParamsType) => void;
  deleteOneItemFromCart: ({
    productId,
    token,
  }: DeleteItemCartParamsType) => void;
  clearAllItemsFromCart: ({ token }: ClearCartParamsType) => void;
  getUserCart: ({ token }: ClearCartParamsType) => void;
  createOrder: ({ token, address }: { token: string; address: string }) => void;
}

export interface RegisterUserParams {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface loginUserParams {
  email: string;
  password: string;
}

export interface OnlyTokenParams {
  token: string;
}

export interface TokenWithAddressParams {
  token: string;
  address: string;
}

export interface OrderList {
  _id: string;
  address: string;
  orderItems: OrderItemProps[];
  status: OrderStatus;
  totalOrderPrice: number;
  createdAt: Date;
}

export interface OrderHistoryProps {
  id: string;
  totalAmount: number;
  address: string;
  status: OrderStatus;
  items: OrderItemProps[];
  orderDate: Date;
}

export enum OrderStatus {
  PENDING,
  SHIPPED,
  DELIVERED,
}

export interface OrderItemProps {
  _id: string;
  productTitle: string;
  productDescription: string;
  productImages?: string;
  quantity: number;
  productPrice: number;
}


export interface OrdersCountType {
  pending: number;
  shipped: number;
  delivered: number;
  totalOrders: number;
}

export interface TopCustomer {
  userId?: string;
  profile?: string;
  email: string;
  orderCount: number;
  totalSpent: number;
}