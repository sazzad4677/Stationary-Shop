import { z } from 'zod';

export const UpdateUserSchema = z.object({
  name: z.string().optional(),
  email: z.string().optional(),
  password: z.string().optional(),
  role: z.union([z.literal("admin"), z.literal("user")]).optional(),
  isBlocked: z.boolean().optional(),
  shippingAddress: z.object({
    address1: z.string().optional(),
    address2: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    country: z.string().optional(),
    zipCode: z.string().optional()
  }).optional()
})