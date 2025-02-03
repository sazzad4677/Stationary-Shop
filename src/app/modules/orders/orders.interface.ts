import { ObjectId } from 'mongoose';
import { orderStatus } from './orders.constants';

type TOrder = {
  orderId: string;
  userId: ObjectId;
  products: {
    productId: ObjectId;
    quantity: number;
  }[];
  totalPrice: number;
  status: (typeof orderStatus)[number];
  paymentData?: TPaymentData;
};

export type TPaymentData = {
  paymentIntentId: string;
  stripeCustomerId?: string;
  amountPaid?: number;
  currency?: string;
  paymentStatus:
    | 'succeeded'
    | 'requires_payment_method'
    | 'requires_action'
    | 'canceled'
    | 'processing'
    | 'requires_capture'
    | 'failed'
    | 'unknown'
    | 'requires_confirmation'
    | 'requires_source_action'
    | 'canceled_reversal'
    | 'reversed'
    | 'expired';
  receiptUrl?: string;
  paymentMethodType?: string;
  cardLast4?: string;
  cardBrand?: string;
  customerEmail?: string | null;
  paymentCreatedAt: Date;
  failedCode?: string;
  failedMessage?: string;
};

export default TOrder;
