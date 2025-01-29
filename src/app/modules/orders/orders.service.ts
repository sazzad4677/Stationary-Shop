import TOrder from './orders.interface';
import { Order } from './orders.model';
import { Product } from '../products/products.model';
import AppError from '../../errors/AppError';
import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';

const createOrder = async (orderData: TOrder): Promise<TOrder> => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
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
    };

    const createdOrder = await Order.create([newOrderData], { session });
    await session.commitTransaction();
    await session.endSession();
    return createdOrder[0];
  } catch (error) {
    // Rollback the transaction in case of errors
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }

  // const product = await Product.findById(orderData.product);
  // if (!product) {
  //   throw new AppError(StatusCodes.NOT_FOUND, 'User already exist');
  // }
  // if (!product.inStock) {
  //   throw new AppError(
  //     StatusCodes.BAD_REQUEST,
  //     'Insufficient product in stock',
  //   );
  // }
  // const reduceQuantity = product.quantity - orderData.quantity;
  // if (reduceQuantity < 0) {
  //   throw new AppError(
  //     StatusCodes.BAD_REQUEST,
  //     'Insufficient product quantity',
  //   );
  // }
  // if (reduceQuantity === 0) {
  //   product.inStock = false;
  // }
  // product.quantity = reduceQuantity;
  // // update product stock in db
  // await product.save();
  // const result = await Order.create(orderData);
  // return result;
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
