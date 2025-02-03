import { z } from 'zod';
import { orderStatus } from './orders.constants';

const OrderValidationSchema = z.object({
  products: z
    .array(
      z.object({
        productId: z.string().nonempty('Product ID is required'),
        quantity: z.number().min(1, 'Quantity must be at least 1').nonnegative('Quantity cannot be negative'),
      }),
    )
    .nonempty('Products array cannot be empty'),
  totalPrice: z.number().positive('Total price must be greater than 0'),
  status: z.enum([...orderStatus as [string]]).default("Pending"),
});

export default OrderValidationSchema;