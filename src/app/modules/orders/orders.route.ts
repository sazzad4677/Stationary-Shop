import express from 'express';
import { orderController } from './orders.controller';
import validateData from '../../middleware/validateData';
import ordersValidation from './orders.validation';
const router = express.Router();

router.post('/', validateData(ordersValidation), orderController.createOrder);
router.get('/revenue', orderController.getRevenue);

export const orderRouter = router;
