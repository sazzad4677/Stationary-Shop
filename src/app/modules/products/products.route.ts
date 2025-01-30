import express from 'express';
import { productController } from './products.controller';
import validateData from '../../middleware/validateData';
import { productSchema, updateProductSchema } from './products.schema';
import auth from '../../middleware/auth';
import { UserRole } from '../users/users.constant';

const router = express.Router();

router.post('/', auth(UserRole.ADMIN), validateData(productSchema), productController.createProduct);
router.put('/:productId',auth(UserRole.ADMIN),validateData(updateProductSchema), productController.updateProduct);
router.delete('/:productId',auth(UserRole.ADMIN), productController.deleteProduct);
router.get('/:productId', productController.getProductByID);
router.get('/', productController.getProducts);

export const productRouter = router;
