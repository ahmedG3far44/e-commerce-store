import { z } from "zod";

export const productSchema = z.object({
  title: z
    .string()
    .min(5, "product title less than 5 characters!!")
    .max(100, "too long product title"),
  description: z.string().optional(),
  category: z.string().optional(),
  image: z.string().url("not valid product image url!!"),
  price: z.number(),
  stock: z.number().int(),
});
