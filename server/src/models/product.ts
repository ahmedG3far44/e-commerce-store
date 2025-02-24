import mongoose, { Schema, Document } from "mongoose";

interface IProduct extends Document {
  title: string;
  description: string;
  category?: string;
  images?: string[];
  price: number;
  stock: number;
}

const productSchema = new Schema(
  {
    title: {
      type: String,
      require: true,
    },
    description: {
      type: String,
    },
    category: {
      type: String,
    },
    images: {
      type: [String],
      default: [],
    },
    price: {
      type: Number,
      require: true,
    },
    stock: {
      type: Number,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const productModel = mongoose.model<IProduct>("Product", productSchema);

export default productModel;
