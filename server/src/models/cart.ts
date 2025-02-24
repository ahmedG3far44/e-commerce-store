import mongoose, { Schema, Document } from "mongoose";

interface ICartItemList {
  quantity: number;
  price: number;
  productId: string;
}
const cartItemListSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

interface ICart extends Document {
  items: ICartItemList[];
  totalAmount: number;
  status: "ACTIVE" | "COMPLETED";
  userId: string;
}

const cartSchema = new Schema(
  {
    items: { type: [cartItemListSchema], required: true, default: [] },
    totalAmount: { type: Number, required: true, default: 0 },
    status: { type: String, required: true, default: "ACTIVE" },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true,
  }
);

 const itemsModel = mongoose.model<ICartItemList>(
  "items",
  cartItemListSchema
);

const cartModel = mongoose.model<ICart>("cart", cartSchema);

export default cartModel;
