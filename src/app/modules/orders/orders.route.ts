import express from 'express';
import { orderController } from './orders.controller';
import validateData from '../../middleware/validateData';
import ordersValidation from './orders.validation';
import auth from '../../middleware/auth';
import { UserRole } from '../users/users.constant';
const router = express.Router();

router.get("/",  orderController.getOrders );
router.get("/:id", auth(UserRole.ADMIN), orderController.getOrderById );
router.patch("/:id", auth(UserRole.ADMIN), orderController.updateOrder );
router.post('/', auth(UserRole.USER, UserRole.ADMIN), validateData(ordersValidation), orderController.createOrder);
router.get('/:userId',auth(UserRole.USER, UserRole.ADMIN), orderController.getOrderByUserId)
router.get('/revenue', orderController.getRevenue);
router.post('/create-payment-intent', auth(UserRole.USER, UserRole.ADMIN), orderController.createPaymentIntent)
export const orderRouter = router;
