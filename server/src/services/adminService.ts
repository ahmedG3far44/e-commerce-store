import { AnimationDuration } from "./../../../client/node_modules/recharts/types/util/types.d";
import orderModel from "../models/order";
import userModel from "../models/user";
import { GetAdminInsightsParams } from "../utils/types";

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

export const getAdminInsights = async ({
  duration,
}: GetAdminInsightsParams) => {
  try {
    const currentDate = new Date();
    const activeDate = {
      start: currentDate,
      end: currentDate,
    };

    switch (duration) {
      case "today":
        activeDate.start = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          currentDate.getDay()
        );
        activeDate.end = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          currentDate.getDay()
        );
      case "this-month":
        activeDate.start = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          1
        );
        activeDate.end = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          1
        );
      case "last-month":
        activeDate.start = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          currentDate.getDay()
        );
        activeDate.end = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() - 1,
          currentDate.getDay()
        );
      case "last-6-month":
        activeDate.start = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          currentDate.getDay()
        );
        activeDate.end = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() - 6,
          currentDate.getDay()
        );
      case "last-12-month":
        activeDate.start = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          currentDate.getDay()
        );
        activeDate.end = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() - 12,
          currentDate.getDay()
        );
      default:
        break;
    }

    console.log(activeDate);
    // let results = {};

    // const stats = await orderModel.aggregate([
    //   {
    //     $match: {
    //       status: "DELIVERED",
    //       createdAt: {
    //         $gte: duration,
    //         $lte: duration,
    //       },
    //     },
    //   },
    //   {
    //     $group: {
    //       _id: null,
    //       count: { $sum: 1 },
    //       totalRevenue: { $sum: "$totalOrderPrice" },
    //     },
    //   },
    //   {
    //     $project: {
    //       _id: 0,
    //       count: 1,
    //       totalRevenue: 1,
    //     },
    //   },
    // ]);

    const statsResult = { count: 0, totalRevenue: 0 };

    return { data: statsResult, statusCode: 200 };
  } catch (error) {
    console.error("Error fetching delivered order stats:", error);
    return { data: error, statusCode: 400 };
  }
};

export const getOrderStatusCounts = async () => {
  try {
    const result = await orderModel.aggregate([
      {
        $match: {
          status: { $in: ["PENDING", "SHIPPED", "DELIVERED"] },
        },
      },
      {
        $group: {
          _id: null,
          pending: {
            $sum: { $cond: [{ $eq: ["$status", "PENDING"] }, 1, 0] },
          },
          shipped: {
            $sum: { $cond: [{ $eq: ["$status", "SHIPPED"] }, 1, 0] },
          },
          delivered: {
            $sum: { $cond: [{ $eq: ["$status", "DELIVERED"] }, 1, 0] },
          },
          totalOrders: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          pending: 1,
          shipped: 1,
          delivered: 1,
          totalOrders: 1,
        },
      },
    ]);

    // Handle case when no orders exist
    const orderStatus =
      result.length > 0
        ? result[0]
        : { pending: 0, shipped: 0, delivered: 0, totalOrders: 0 };

    return { data: orderStatus, statusCode: 200 };
  } catch (error) {
    console.error("Error fetching order status counts:", error);

    return { data: error, statusCode: 400 };
  }
};

export const getSalesInsights = async () => {
  try {
    // calc total sales
    const orders = await orderModel.aggregate([
      {
        $match: {
          status: { $in: ["DELIVERED"] },
        },
      },
    ]);

    

    const totalSales = orders.reduce((acc, currentOrder) => {
      return acc + currentOrder.totalOrderPrice;
    }, 0);

  

    // total orders
    const totalOrders = orders.length;

    // most spent
    const mostSpent = await orderModel.aggregate([
      {
        $match: {
          status: { $in: ["DELIVERED"] },
        },
      },
      {
        $group: {
          _id: null,
          mostSpent: { $max: "$totalOrderPrice" },
        },
      },
    ]);
    // active customer
    const customers = await userModel.aggregate([
      { $count: "activeCustomers" },
    ]);
    // const activeCustomers = customers?.length;

    const salesInsights = {
      totalSales,
      totalOrders,
      mostSpent: mostSpent[0].mostSpent.toFixed(2),
      activeCustomers: customers[0].activeCustomers,
    };
    return { data: salesInsights, statusCode: 200 };
  } catch (err: any) {
    return { data: err?.message, statusCode: 400 };
  }
};
