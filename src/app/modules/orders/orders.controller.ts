import { Request, Response } from 'express';
import { orderService } from './orders.service';
import TOrder from './orders.interface';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import AppError from '../../errors/AppError';
import config from '../../config';
import Stripe from 'stripe';

const createOrder = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user._id;
  const orderData = {
    userId,
    ...req.body,
  };
  const result = await orderService.createOrder(orderData);
  sendResponse<{ clientSecret: string }>(res, {
    statusCode: 200,
    message: 'Orders retrieved successfully',
    success: true,
    data: result,
  });
});

const getOrderById = catchAsync(async (req: Request, res: Response) => {
  const result = await orderService.getOrderById(req.params.id);
  res.status(200).json(result);
});

const getRevenue = async (req: Request, res: Response) => {
  try {
    const result = await orderService.getRevenue();
    res.status(200).json(result);
  } catch (error) {
    res.status(404).json({
      message: 'Failed to get revenue',
      success: false,
      error: error,
    });
  }
};

const getOrders = catchAsync(async (req: Request, res: Response) => {
  const result = await orderService.getAllOrders(req.query);
  sendResponse<TOrder[]>(res, {
    statusCode: 200,
    message: 'Orders retrieved successfully',
    success: true,
    data: result.data,
    meta: result.meta,
  });
});

const updateOrder = catchAsync(async (req: Request, res: Response) => {
  const result = await orderService.updateOrder(req.params.id, req.body.status);
  sendResponse<TOrder>(res, {
    statusCode: 200,
    message: 'Orders successfully updated',
    success: true,
    data: result,
  });
});

const getOrderByUserId = catchAsync(async (req, res) => {
  {
    const result = await orderService.getOrderByUserId(req.params.userId);
    sendResponse<TOrder[]>(res, {
      statusCode: 200,
      message: 'Orders successfully Retrieved',
      success: true,
      data: result,
    });
  }
});

const getMyOrder = catchAsync(async (req, res) => {
  {
    const result = await orderService.getMyOrders(req.user._id);
    sendResponse<TOrder[]>(res, {
      statusCode: 200,
      message: 'Orders successfully Retrieved',
      success: true,
      data: result,
    })
  }
})

const handleStripeWebhook = async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'];
  try {
    if (!sig) {
      throw new AppError(400, 'Missing Stripe signature');
    }
    const webhookSecret = config.stripe_webhook_secret as string;
    const stripe = new Stripe(config.stripe_secret_key as string, { apiVersion: '2025-01-27.acacia' });
    const event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        webhookSecret,
    );
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentData = {
          paymentIntentId: paymentIntent.id,
          stripeCustomerId: paymentIntent.customer as string,
          amountPaid: paymentIntent.amount / 100, // Convert to decimal format
          currency: paymentIntent.currency,
          paymentStatus: paymentIntent.status,
          paymentMethodType: paymentIntent.payment_method_types[0],
          customerEmail: paymentIntent.receipt_email, // Stripe sends receipt_email
          paymentCreatedAt: new Date(paymentIntent.created * 1000), // Convert timestamp
        };

        await orderService.updateOrderPaymentData(
          paymentIntent.id,
          paymentData,
          "Paid"
        );
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentData = {
          paymentIntentId: paymentIntent.id,
          stripeCustomerId: paymentIntent.customer as string,
          paymentStatus: paymentIntent.status,
          failedCode: paymentIntent.last_payment_error?.code,
          failedMessage: paymentIntent.last_payment_error?.message,
          paymentCreatedAt: new Date(paymentIntent.created * 1000),
        };

        await orderService.updateOrderPaymentData(
          paymentIntent.id,
          paymentData,
          "Failed"
        );
        break;
      }

      default:
        break;
    }

    res.status(200).json({ received: true });
  } catch (err) {
    // console.log(err);
    res.status(400).send(`Webhook Error: ${(err as Error)?.message}`);
  }
};

export const orderController = {
  createOrder,
  getRevenue,
  getOrders,
  getOrderById,
  updateOrder,
  getOrderByUserId,
  handleStripeWebhook,
  getMyOrder
};
