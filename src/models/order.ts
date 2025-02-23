import mongoose, { Schema, ObjectId, Document } from "mongoose";

interface IOrderItemsList {
  productTitle: string;
  productDescription?: string;
  productImages?: string;
  productPrice: number;
  quantity: number;
}
const orderItemsSchema = new Schema<IOrderItemsList>({
  productTitle: { type: String, required: true },
  productDescription: { type: String },
  productImages: { type: String },
  productPrice: { type: Number, required: true },
  quantity: { type: Number, required: true },
});

interface IOrder extends Document {
  orderItems: IOrderItemsList[];
  address: string;
  totalOrderPrice: number;
  userId: ObjectId | string;
}
const orderSchema = new Schema(
  {
    orderItems: { type: [orderItemsSchema] },
    address: { type: String, required: true },
    totalOrderPrice: { type: Number, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true,
  }
);

const orderModel = mongoose.model<IOrder>("Order", orderSchema);

export default orderModel;
