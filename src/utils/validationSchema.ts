import { z } from "zod";

export const productSchema = z.object({
  title: z
    .string()
    .min(5, "product title less than 5 characters!!")
    .max(100, "too long product title"),
  description: z.string().optional(),
  category: z.string().optional(),
  images: z
    .string()
    .url("not valid product image url!!")
    .array()
    .min(1, "not valid  product images!!"),
  price: z.number(),
  stock: z.number().int(),
});
