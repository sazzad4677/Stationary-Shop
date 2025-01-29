import { ObjectId } from 'mongoose';

type TOrder = {
  fullName: string;
  email: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  products: {
    productId: ObjectId;
    quantity: number;
  }[];
  totalPrice: number;
};

export default TOrder;
