import express from 'express';
import { orderController } from './orders.controller';
const router = express.Router();

router.post('/', orderController.createOrder);
router.get('/revenue', orderController.getRevenue);

export const orderRouter = router;
