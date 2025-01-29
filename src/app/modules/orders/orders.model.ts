import { model, Schema } from 'mongoose';
import TOrder from './orders.interface';

const orderSchema = new Schema<TOrder>(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
    },
    address1: {
      type: String,
      required: [true, 'Address 1 is required'],
    },
    address2: {
      type: String,
    },
    country: {
      type: String,
      required: [true, 'Country is required'],
    },
    city: {
      type: String,
      required: [true, 'City is required'],
    },
    state: {
      type: String,
      required: [true, 'State is required'],
    },
    zipCode: {
      type: String,
      required: [true, 'Zip code is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
    },
    products: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: [true, 'Product ID is required'],
        },
        quantity: {
          type: Number,
          required: [true, 'Quantity is required'],
          min: [1, 'Quantity must be at least 1'],
        },
      },
    ],
    totalPrice: {
      type: Number,
      required: [true, 'Total price is required'],
    },
  },
  {
    timestamps: true,
    versionKey: false
  },
);

// Create and export the Order model
export const Order = model<TOrder>('Order', orderSchema);