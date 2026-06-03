import {z} from "zod"

export const addToCartSchema = z.object({
    productId: z.uuid(),
    quantity: z.number().int().positive()
})

export const updateCartItemSchema = z.object({
    quantity: z.number().int().positive()
})