import express from 'express';
import { productController } from './Products.controller';

const router = express.Router();

router.post('/', productController.createProduct);
router.put('/:productId', productController.updateProduct);
router.delete('/:productId', productController.deleteProduct);
router.get('/:productId', productController.getProductByID);
router.get('/', productController.getProducts);

export const productRouter = router;
