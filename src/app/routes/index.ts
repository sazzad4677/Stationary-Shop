import Router, { IRouter } from 'express';
import { AuthRouter } from '../modules/auth/auth.router';
import { AdminRouter } from '../modules/admin/admin.router';
import { UsersRouter } from '../modules/users/users.router';
import { productRouter } from '../modules/products/products.route';
import { orderRouter } from '../modules/orders/orders.route';

const router = Router();

interface IRoute {
  path: string;
  route: IRouter;
}

const routes: IRoute[] = [
  {
    path: '/auth',
    route: AuthRouter,
  },
  {
    path: '/user',
    route: UsersRouter,
  },
  {
    path: '/admin',
    route: AdminRouter,
  },
  {
    path: '/products',
    route: productRouter,
  },
  {
    path: '/orders',
    route: orderRouter,
  },
];

routes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
