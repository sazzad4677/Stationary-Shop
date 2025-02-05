import { z } from 'zod';
import { categories } from './products.constants';

export const productSchema = z.object({
  name: z
    .string()
    .max(20, "Product name can't exceed 20 characters")
    .nonempty('Product name is required'), // Ensures it's a non-empty string
  brand: z.string().nonempty('Product brand is required'),
  price: z.number().min(0, 'Product price must be a positive number'),
  category: z.enum(categories as unknown as [string, ...string[]], {
    errorMap: (errors) => ({ message: 'Invalid category', errors }),
  }),
  description: z
    .string()
    .refine((desc) => desc.trim().split(/\s+/).length <= 1000, {
      message: "Product description can't exceed 1000 words",
    }),
  quantity: z.number().min(0, 'Product quantity must be a positive number'),
  inStock: z.boolean().default(true),
});

export const updateProductSchema = productSchema.partial()