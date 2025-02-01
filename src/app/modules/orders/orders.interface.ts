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
  shippingAddress: {
    address1: string;
    address2: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  status: typeof orderStatus[number];
  paymentIntentId: string;
};

export default TOrder;
