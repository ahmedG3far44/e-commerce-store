import { Request } from "express";
import { ITokenPayload } from "../services/userService";

export interface ExtendedRequest extends Request {
  user?: ITokenPayload;
}

export interface IProduct {
  title: string;
  description: string | null;
  category: string | null;
  image: string;
  price: number;
  stock: number;
}

// id          String @id @unique @default(uuid())
// title       String
// description String
// category    String
// image       String
// price       Float
// stock       Int
