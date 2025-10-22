import mongoose, { Schema, Document, Types } from "mongoose";

interface IProduct extends Document {
  title: string;
  description: string;
  categoryId: Types.ObjectId;
  categoryName: string;
  images?: string[];
  price: number;
  stock: number;
  totalSales: number;
  ordersCount: number;

}

const productSchema = new Schema(
  {
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category is required']
    },
    categoryName: {
      type:String,
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
    thumbnail:{
      type: String,
      require: true,
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
    totalSales: {
      type: Number,
      default: 0,
    },
    ordersCount: {
      type: Number,
      default: 0,
    }
  },
  {
    timestamps: true,
  }
);

const productModel = mongoose.model<IProduct>("Product", productSchema);

export default productModel;
