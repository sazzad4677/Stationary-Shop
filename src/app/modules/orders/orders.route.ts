import express from 'express';
import { orderController } from './orders.controller';
import validateData from '../../middleware/validateData';
import ordersValidation from './orders.validation';
import auth from '../../middleware/auth';
import { UserRole } from '../users/users.constant';
const router = express.Router();

router.post('/', auth(UserRole.USER, UserRole.ADMIN), validateData(ordersValidation), orderController.createOrder);
router.get('/revenue', orderController.getRevenue);

export const orderRouter = router;
