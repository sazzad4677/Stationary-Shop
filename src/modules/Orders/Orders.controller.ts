import { Request, Response } from 'express';
import { orderService } from './Orders.service';
import IResponse from '../../helper/responseType';
import TOrder from './Orders.interface';
import { Product } from '../Products/Products.model';

const createOrder = async (req: Request, res: Response) => {
  try {
    const orderData = req.body;
    const product = await Product.findById(orderData.product);
    if (!product) {
      res.status(404).json({
        message: 'Product not found',
        success: false,
      });
      return;
    }
    if (!product.inStock) {
      res.status(404).json({
        message: 'Insufficient product in stock',
        success: false,
      });
      return;
    }
    const reduceQuantity = product.quantity - orderData.quantity;
    if (reduceQuantity < 0) {
      res.status(404).json({
        message: 'Insufficient product quantity',
        success: false,
      });
      return;
    }
    if (reduceQuantity === 0) {
      product.inStock = false;
    }
    product.quantity = reduceQuantity;
    // update product stock in db
    await product.save();
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
