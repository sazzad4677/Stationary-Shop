import { model, Schema } from 'mongoose';
import TOrder from './orders.interface';

const orderSchema = new Schema<TOrder>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
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