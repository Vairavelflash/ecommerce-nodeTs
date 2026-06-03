import {z} from "zod";

export const createProductSchema = z.object({
     name: z.string().min(3),

  description: z.string().min(10),

  price: z.number().positive(),

  stock: z.number().int().nonnegative(),

  imageUrl: z.string().url(),

  categoryId: z.uuid()
})