import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import routes from './app/routes';
import globalErrorHandler from './app/middleware/globalErrorHandler';
const app: Application = express();
// Config
app.use((req, res, next) => {
  if (req.path === '/api/orders/webhook') {
    next();
  } else {
    express.json()(req, res, next);
  }
});
app.use(cookieParser())
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use('/api', routes);

// Main routes
app.get('/', (req: Request, res: Response) => {
  res.send('hello world');
});

app.use(globalErrorHandler);

export default app;
