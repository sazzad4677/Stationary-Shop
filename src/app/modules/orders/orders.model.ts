import { model, Schema } from 'mongoose';
import TOrder from './orders.interface';

const orderSchema = new Schema<TOrder>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Product is required'],
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [1, 'Quantity must be at least 1'],
    },
    totalPrice: {
      type: Number,
      required: [true, 'Total price is required'],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const Order = model<TOrder>('Order', orderSchema);
