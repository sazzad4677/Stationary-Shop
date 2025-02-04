import TOrder, { TPaymentData } from './orders.interface';
import { Order } from './orders.model';
import { Product } from '../products/products.model';
import AppError from '../../errors/AppError';
import { StatusCodes } from 'http-status-codes';
import mongoose, { ObjectId } from 'mongoose';
import QueryBuilder from '../../QueryBuilder';
import config from '../../config';
import Stripe from 'stripe';
import { orderStatus } from './orders.constants';
import { generateCustomID } from '../../utils/generateCustomId';

const stripe = new Stripe(config.stripe_secret_key as string);

const createOrder = async (
  orderData: TOrder,
): Promise<{ clientSecret: string }> => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const generateOrderId = await generateCustomID(Order, "orderId", "ORD")
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
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(orderData.totalPrice * 100),
      currency: 'usd',
      payment_method_types: ['card', 'link', 'affirm'],
      metadata: {
        orderId: generateOrderId,
      },
    });
    const newOrderData = {
      ...orderData,
      orderId: generateOrderId,
      paymentData: { paymentIntentId: paymentIntent.id },
      isPaid: false,
    };
    await Order.create([newOrderData], { session });
    await session.commitTransaction();
    await session.endSession();
    return {
      clientSecret: paymentIntent.client_secret || '',
    };
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

const updateOrderPaymentData = async (
  paymentIntentId: string,
  paymentData: TPaymentData,
  status: (typeof orderStatus)[number],
) => {
  const updatedOrder = await Order.findOneAndUpdate(
    { 'paymentData.paymentIntentId': paymentIntentId },
    { $set: { paymentData, status, isPaid: true } },
    { new: true },
  );

  if (!updatedOrder) {
    throw new AppError(
      404,
      `Order with PaymentIntent ID ${paymentIntentId} not found`,
    );
  }

  return updatedOrder;
};

const getOrderByUserId = async (userId: string): Promise<TOrder[]> => {
  const result = await Order.find({ userId });
  return result;
};

const getMyOrders = async (userId: ObjectId): Promise<TOrder[]> => {
  const result = await Order.find({ userId }).populate(['products.productId']).sort({ createdAt: -1 });
  return result;
};

const orderPayNow = async (orderId: string) => {
  const orderInfo = await Order.findOne({ _id: orderId });
  if (!orderInfo) throw new AppError(404, `Order with ID ${orderId} not found`);
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(orderInfo.totalPrice * 100),
    currency: 'usd',
    payment_method_types: ['card', 'link', 'affirm'],
    metadata: {
      orderId,
    },
  });
  await Order.findByIdAndUpdate(orderId, {
    paymentData: { paymentIntentId: paymentIntent.id },
  });
  return {
    clientSecret: paymentIntent.client_secret || '',
  };
};

const cancelOrder = async (orderId: string) => {
  const updatedOrder = await Order.findByIdAndUpdate(
    orderId,
    {
      status: 'Cancelled',
    },
    {
      new: true,
    },
  );
  return updatedOrder;
};

const initiateRefund = async (orderId: string) => {
  const orderInfo = await Order.findOne({ _id: orderId });

  if (!orderInfo) throw new AppError(404, `Order with ID ${orderId} not found`);

  if (orderInfo.status !== 'Canceled')
    throw new AppError(404, `Order with ID ${orderId} is not cancelled`);

  if (!orderInfo.paymentData?.paymentStatus)
    throw new AppError(404, `Order with ID ${orderId} has no payment data`);

  const paymentIntent = await stripe.paymentIntents.retrieve(
    orderInfo.paymentData.paymentIntentId,
  );
  const charges = await stripe.charges.list({
    payment_intent: paymentIntent.id,
  });
  const chargeId = charges.data[0]?.id;
  const refund = await stripe.refunds.create({
    charge: chargeId,
  });
  orderInfo.status = 'Refunded';
  orderInfo.paymentData.paymentStatus = 'reversed';
  await orderInfo.save();
  return refund;
};

export const orderService = {
  createOrder,
  getRevenue,
  getAllOrders,
  getOrderById,
  updateOrder,
  getOrderByUserId,
  updateOrderPaymentData,
  getMyOrders,
  orderPayNow,
  cancelOrder,
  initiateRefund,
};
