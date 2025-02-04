import { Request, Response } from 'express';
import { productService } from './products.service';
import IResponse from '../../helper/responseType';
import AppError from '../../errors/AppError';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';

const getProducts = catchAsync(async (req: Request, res: Response) => {
  const products = await productService.getProducts(req.query);
  sendResponse(res, {
    statusCode: 200,
    message: 'Products retrieved successfully',
    success: true,
    data: products.result,
    meta: products.meta,
  });
});

const createProduct = catchAsync(async (req: Request, res: Response) => {
  if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
    throw new AppError(400, 'No files were uploaded');
  }
  const images = (req.files as Express.Multer.File[]).map((file) => file.path);
  const product = { ...req.body , images};
  const newProduct = await productService.createProduct(product);
  sendResponse(res, {
    statusCode: 200,
    message: 'Product Created successfully',
    success: true,
    data: newProduct,
  });
});

const getProductByID = async (req: Request, res: Response) => {
  const { productId } = req.params;
  const result = await productService.getProductByID(productId);
  sendResponse(res, {
    statusCode: 200,
    message: 'Product retrieved successfully',
    success: true,
    data: result,
  })
};
const updateProduct = async (req: Request, res: Response) => {
    const { productId } = req.params;
    const productData = req.body;
    const result = await productService.updateProduct(productId, productData);
    sendResponse(res, {
      statusCode: 200,
      message: 'Product updated successfully',
      success: true,
      data: result,
    })
};

const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const result = await productService.deleteProduct(productId);
    if (!result) {
      res.status(404).json({
        message: 'Product not found',
        success: false,
      });
      return;
    }
    const response: IResponse<object> = {
      message: 'Product deleted successfully',
      success: true,
      data: {},
    };
    res.status(200).json(response);
  } catch (error) {
    res.status(404).json({
      message: 'Failed to get product',
      success: false,
      error: error,
    });
  }
};

export const productController = {
  getProducts,
  createProduct,
  getProductByID,
  updateProduct,
  deleteProduct,
};
