import { z } from 'zod';

const OrderValidationSchema = z.object({
  fullName: z.string().nonempty('Full name is required'),
  address1: z.string().nonempty('Address 1 is required'),
  address2: z.string().optional(),
  country: z.string().nonempty('Country is required'),
  city: z.string().nonempty('City is required'),
  state: z.string().nonempty('State is required'),
  zipCode: z.string().nonempty('Zip code is required'),
  email: z.string().email('Invalid email format').nonempty('Email is required'),
  products: z
    .array(
      z.object({
        productId: z.string().nonempty('Product ID is required'),
        quantity: z.number().min(1, 'Quantity must be at least 1').nonnegative('Quantity cannot be negative'),
      }),
    )
    .nonempty('Products array cannot be empty'),
  totalPrice: z.number().positive('Total price must be greater than 0'),
});

export default OrderValidationSchema;