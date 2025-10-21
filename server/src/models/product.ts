import mongoose, { Schema, Document, Types } from "mongoose";

interface IProduct extends Document {
  categoryId: Types.ObjectId;
  title: string;
  description: string;
  category?: string;
  images?: string[];
  price: number;
  stock: number;
}

const productSchema = new Schema(
  {
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category is required']
    },
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
