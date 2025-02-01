import { User } from '../users/users.model';
import { Order } from '../orders/orders.model';
import { Product } from '../products/products.model';

const getDashboardInfo = async () => {
  const user = await User.find();
  const products = await Product.find();
  const revenue = await Order.aggregate([
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$totalPrice' },
      },
    },
  ]);
  const activeUser = await User.find({ isBlocked: false });
  return {
    totalUser: user.length,
    totalProducts: products.length,
    revenue: revenue[0].totalRevenue,
    activeUser: activeUser.length,
  };
};

export const DashboardService = {
  getDashboardInfo
}