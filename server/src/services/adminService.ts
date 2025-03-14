import orderModel from "../models/order";
import userModel from "../models/user";

interface UpdateOrderStatusParams {
  orderId: string;
  newStatus: OrderStatus;
}

export enum OrderStatus {
  PENDING,
  SHIPPED,
  DELIVERED,
}

export const updateOrderStatus = async ({
  orderId,
  newStatus,
}: UpdateOrderStatusParams) => {
  try {
    const order = await orderModel.findByIdAndUpdate(orderId, {
      status: newStatus,
    });

    const updatedOrder = await order?.save();

    return { data: updatedOrder, statusCode: 200 };
  } catch (err: any) {
    return { data: err.message, statusCode: 400 };
  }
};

export const getAllUsers = async () => {
  try {
    const users = await userModel.find({}, { password: 0, addresses: 0 });

    return { data: users, statusCode: 200 };
  } catch (err: any) {
    return { data: err.message, statusCode: 400 };
  }
};

export const getPendingOrders = async () => {
  try {
    const orders = await orderModel.find({ status: "PENDING" }).sort();
    return { data: { orders }, statusCode: 200 };
  } catch (err) {
    return { data: err, statusCode: 400 };
  }
};
export const getCompletedOrders = async () => {
  try {
    const orders = await orderModel.find({ status: "DELIVERED" }).sort();
    return { data: { orders }, statusCode: 200 };
  } catch (err) {
    return { data: err, statusCode: 400 };
  }
};

export const getShippedOrders = async () => {
  try {
    const orders = await orderModel.find({ status: "SHIPPED" }).sort();
    return { data: { orders }, statusCode: 200 };
  } catch (err) {
    return { data: err, statusCode: 400 };
  }
};
