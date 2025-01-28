import TOrder from './orders.interface';
import { Order } from './orders.model';

const createOrder = async (orderData: TOrder): Promise<TOrder> => {
  const result = await Order.create(orderData);
  return result;
};
const getRevenue = async (): Promise<number> => {
  const result = await Order.aggregate([
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$totalPrice' },
      },
    },
  ]);
  return result[0].totalRevenue;
};

export const orderService = {
  createOrder,
  getRevenue,
};
