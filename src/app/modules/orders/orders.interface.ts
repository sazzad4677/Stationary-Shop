import { ObjectId } from 'mongoose';

type TOrder = {
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
};

export default TOrder;
