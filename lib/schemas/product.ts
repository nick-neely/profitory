import { z } from "zod"
import { PRODUCT_CONDITIONS } from "@/constants"

export const productSchema = z.object({
  brand: z.string().min(1, "Brand is required"),
  name: z.string().min(1, "Name is required"),
  price: z.coerce.number().min(0, "Price must be positive"),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
  condition: z.enum(PRODUCT_CONDITIONS),
  category: z.string().min(1, "Category is required"),
  cost: z.coerce.number().min(0, "Cost must be positive"),
})

export type ProductFormValues = z.infer<typeof productSchema>