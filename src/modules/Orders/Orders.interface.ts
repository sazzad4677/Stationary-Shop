import { ObjectId } from 'mongoose';

type TOrder = {
  email: string;
  product: ObjectId;
  quantity: number;
  totalPrice: number;
};

export default TOrder;
