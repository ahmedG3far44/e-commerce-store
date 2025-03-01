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
    const pendingOrders = await orderModel.find({
      status: "PENDING",
    });

    // console.log(pendingOrders);
    // const orders = { order: { ...pendingOrders }, userInfo: {} };

    // for (const order of pendingOrders) {
    //   const user = await userModel.findById(order.userId, {
    //     firstName: 1,
    //     lastName: 1,
    //     email: 1,
    //   });

    //   orders.userInfo = {
    //     id: user?._id,
    //     firstName: user?.firstName,
    //     lastName: user?.lastName,
    //     email: user?.email,
    //   };
    // }

    // console.log(orders);

    return { data: pendingOrders, statusCode: 200 };
  } catch (err: any) {
    return { data: err.message, statusCode: 400 };
  }
};
