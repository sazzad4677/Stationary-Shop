import { Request, Response } from 'express';
import { orderService } from './orders.service';
import TOrder from './orders.interface';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';

const createOrder = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user._id;
    const orderData = {
      userId,
      ...req.body,
    };
    const result = await orderService.createOrder(orderData);
    sendResponse<TOrder>(res, {
      statusCode: 200,
      message: 'Orders retrieved successfully',
      success: true,
      data: result,
    });
})

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

const getOrderByUserId = catchAsync(async (req, res) => {{
  const result = await orderService.getOrderByUserId(req.params.userId);
  sendResponse<TOrder[]>(res, {
    statusCode: 200,
    message: 'Orders successfully Retrieved',
    success: true,
    data: result,
  });
}})

export const orderController = {
  createOrder,
  getRevenue,
  getOrders,
  getOrderById,
  updateOrder,
  getOrderByUserId,
};
