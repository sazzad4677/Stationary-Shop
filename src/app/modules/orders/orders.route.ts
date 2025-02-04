import express from 'express';
import { orderController } from './orders.controller';
import validateData from '../../middleware/validateData';
import ordersValidation from './orders.validation';
import auth from '../../middleware/auth';
import { UserRole } from '../users/users.constant';
const router = express.Router();

router.get("/get-my-order",auth(UserRole.USER, UserRole.ADMIN), orderController.getMyOrder)
router.get("/:id", auth(UserRole.ADMIN), orderController.getOrderById );
router.patch("/:id", auth(UserRole.ADMIN), orderController.updateOrder );
router.post('/', auth(UserRole.USER, UserRole.ADMIN), validateData(ordersValidation), orderController.createOrder);
router.get('/:userId',auth(UserRole.USER, UserRole.ADMIN), orderController.getOrderByUserId)
router.get('/revenue', orderController.getRevenue);
router.get('/pay-now/:orderId', auth(UserRole.USER, UserRole.ADMIN), orderController.orderPayNow);
router.get('/cancel/:orderId', auth(UserRole.USER, UserRole.ADMIN), orderController.cancelOrder);
router.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  orderController.handleStripeWebhook
);
router.get("/initiate-refund/:orderId", auth(UserRole.ADMIN), orderController.initiateRefund)
router.get("/",  auth(UserRole.ADMIN), orderController.getOrders );

export const orderRouter = router;
