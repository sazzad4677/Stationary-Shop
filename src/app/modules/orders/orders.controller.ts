import { Request, Response } from 'express';
import { orderService } from './orders.service';
import IResponse from '../../helper/responseType';
import TOrder from './orders.interface';

const createOrder = async (req: Request, res: Response) => {
  try {
    const orderData = req.body;
    const result = await orderService.createOrder(orderData);
    const response: IResponse<TOrder> = {
      message: 'Order created successfully',
      success: true,
      data: result,
    };
    res.status(200).json(response);
  } catch (error) {
    res.status(404).json({
      message: 'Failed to create order',
      success: false,
      error: error,
    });
  }
};

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

export const orderController = {
  createOrder,
  getRevenue,
};
