import express from 'express';
import { productController } from './products.controller';
import validateData from '../../middleware/validateData';
import { productSchema, updateProductSchema } from './products.schema';
import auth from '../../middleware/auth';
import { UserRole } from '../users/users.constant';
import upload from '../../middleware/upload';
import { Request, Response, NextFunction } from 'express';

const router = express.Router();

router.post(
  '/',
  auth(UserRole.ADMIN),
  upload.array('images', 4),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next()
  },
  validateData(productSchema),
  productController.createProduct,
);
router.put(
  '/:productId',
  auth(UserRole.ADMIN),
  upload.array('images', 4),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next()
  },
  validateData(updateProductSchema),
  productController.updateProduct,
);
router.delete(
  '/:productId',
  auth(UserRole.ADMIN),
  productController.deleteProduct,
);
router.get('/:productId', productController.getProductByID);
router.get('/', productController.getProducts);
router.post("/generate-product-description", productController.generateProductDescription)

export const productRouter = router;
