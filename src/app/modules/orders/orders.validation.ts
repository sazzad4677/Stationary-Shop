import { z } from 'zod';

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
  shippingAddress: z.object({
    address1: z.string().nonempty('Address 1 is required'),
    address2: z.string().optional(),
    city: z.string().nonempty('City is required'),
    state: z.string().nonempty('State is required'),
    zipCode: z.string().nonempty('Zip code is required'),
    country: z.string().nonempty('Country is required'),
  }),
});

export default OrderValidationSchema;