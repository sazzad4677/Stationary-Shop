import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { productRouter } from './modules/Products/Products.route';
import { orderRouter } from './modules/Orders/Orders.route';
const app: Application = express();

// Config
app.use(express.json());
app.use(cors());

// app routes
app.use('/api/products', productRouter);
app.use('/api/orders', orderRouter);

// Main routes
app.get('/', (req: Request, res: Response) => {
  res.send('hello world');
});

export default app;
