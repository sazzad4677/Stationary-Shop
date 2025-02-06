import { model, Schema } from 'mongoose';
import TOrder from './orders.interface';
import { orderStatus } from './orders.constants';

const orderSchema = new Schema<TOrder>(
  {
    orderId: {
      type: String,
      required: [true, 'Order ID is required'],
      unique: true,
    },
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
    status: {
      type: String,
      enum: orderStatus,
      default: 'Pending',
    },
    paymentData: {
      paymentIntentId: { type: String, required: true },
      stripeCustomerId: { type: String },
      amountPaid: { type: Number },
      currency: { type: String },
      paymentStatus: {
        type: String,
        enum: [
          'succeeded',
          'requires_payment_method',
          'requires_action',
          'canceled',
          'reversed',
        ],
      },
      paymentMethodType: { type: String },
      customerEmail: { type: String },
      paymentCreatedAt: { type: Date },
      failedCode: { type: String },
      failedMessage: { type: String },
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

orderSchema.virtual('isPaid').get(function () {
  return  this.paymentData?.paymentStatus === 'succeeded';
});

export const Order = model<TOrder>('Order', orderSchema);
