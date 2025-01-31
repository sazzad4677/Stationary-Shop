import TOrder from './orders.interface';
import { Order } from './orders.model';
import { Product } from '../products/products.model';
import AppError from '../../errors/AppError';
import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';
import crypto from 'crypto';
import { User } from '../users/users.model';
import QueryBuilder from '../../QueryBuilder';

function generateOrderId(userId: string): string {
  const prefix = 'ORD';
  const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, '');
  const uniquePart = crypto.randomBytes(3).toString('hex').toUpperCase();
  const userIdentifier = userId.slice(-4);

  return `${prefix}-${timestamp}-${userIdentifier}-${uniquePart}`;
}

const createOrder = async (orderData: TOrder): Promise<TOrder> => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const orderId = generateOrderId(orderData.userId.toString());
    const productIds = orderData.products.map((item) => item.productId);
    const products = await Product.find({ _id: { $in: productIds } }).session(
      session,
    );

    if (products.length !== productIds.length) {
      throw new AppError(
        StatusCodes.NOT_FOUND,
        'One or more products not found',
      );
    }

    const productUpdates = [];
    for (const item of orderData.products) {
      const product = products.find(
        (p) => p._id.toString() === item.productId.toString(),
      );

      if (!product) {
        throw new AppError(
          StatusCodes.NOT_FOUND,
          `Product with ID ${item.productId} not found`,
        );
      }

      // Validate stock availability
      if (!product.inStock || product.quantity < item.quantity) {
        throw new AppError(
          StatusCodes.BAD_REQUEST,
          `Insufficient stock for Product ID ${item.productId}`,
        );
      }

      // Prepare data for bulk update
      const remainingQuantity = product.quantity - item.quantity;
      productUpdates.push({
        updateOne: {
          filter: { _id: product._id },
          update: {
            $set: {
              quantity: remainingQuantity,
              inStock: remainingQuantity > 0,
            },
          },
        },
      });
    }
    // Perform bulk update for all products
    await Product.bulkWrite(productUpdates, { session });
    const newOrderData = {
      ...orderData,
      orderId,
    };

    const createdOrder = await Order.create([newOrderData], { session });
    await User.findByIdAndUpdate(
      { _id: orderData.userId },
      { shippingAddress: orderData.shippingAddress },
      { session },
    );
    await session.commitTransaction();
    await session.endSession();
    return createdOrder[0];
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(
      400,
      'Failed to create order',
      (error as Error)?.message,
    );
  }
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
const getOrderById = async (orderId: string): Promise<TOrder | null> => {
  const result = await Order.findById(orderId).populate([
    {
      path: 'products.productId',
    },
    {
      path: 'userId',
    },
  ]);
  if (!result)
    throw new AppError(
      StatusCodes.NOT_FOUND,
      `Order with ID ${orderId} not found`,
    );
  return result;
};

const getAllOrders = async (query: Record<string, unknown>) => {
  const queryBuilder = new QueryBuilder(
    Order.find({}).populate([
      {
        path: 'products.productId',
      },
      {
        path: 'userId',
      },
    ]),
    query,
  )
    .filter()
    .sort()
    .search()
    .paginate();
  const data = await queryBuilder.modelQuery;
  const meta = await queryBuilder.countTotal();
  return {
    meta,
    data,
  };
};

const updateOrder = async (
  orderId: string,
  status: Record<string, unknown>,
) => {
  const result = await Order.findByIdAndUpdate(
    orderId,
    { status },
    { new: true },
  );
  return result;
};

export const orderService = {
  createOrder,
  getRevenue,
  getAllOrders,
  getOrderById,
  updateOrder,
};
