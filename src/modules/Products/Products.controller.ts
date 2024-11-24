import { Request, Response } from 'express';
import { productService } from './Product.service';
import IResponse from '../../helper/responseType';
import TProduct from './Products.interface';
const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await productService.getProducts();
    const response: IResponse<TProduct[]> = {
      message: 'Products retrieved successfully',
      success: true,
      data: products,
    };
    res.status(200).json(response);
  } catch (error) {
    res.status(404).json({
      message: 'Failed to get products',
      success: false,
      error: error,
    });
  }
};

const createProduct = async (req: Request, res: Response) => {
  try {
    const product = req.body;
    const newProduct = await productService.createProduct(product);
    const response: IResponse<TProduct> = {
      message: 'Product Created successfully',
      success: true,
      data: newProduct,
    };
    res.status(201).json(response);
  } catch (error) {
    res.status(404).json({
      message: 'Failed to create product',
      success: false,
      error: error,
    });
  }
};

const getProductByID = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const result = await productService.getProductByID(productId);
    const response: IResponse<TProduct | null> = {
      message: 'Product retrieved successfully',
      success: true,
      data: result,
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
const updateProduct = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const productData = req.body;
    const result = await productService.updateProduct(productId, productData);
    const response: IResponse<TProduct | null> = {
      message: 'Product updated successfully',
      success: true,
      data: result,
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
