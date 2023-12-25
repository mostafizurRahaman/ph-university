import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import { notFound } from './app/middlewares/notFound';
import router from './app/routes';
import cookieParser from 'cookie-parser';

// create application :
const app: Application = express();

// parsers :
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: ['http://localhost:5173'] }));

// test route:
app.get('/test', (req: Request, res: Response) => {
  const a = 20;
  const b = 40;
  res.send({ a, b });
});

// application routes:
app.use('/api/v1', router);
// main route:
app.get('/', (req: Request, res: Response) => {
  res.send('Yah!!! our server is running now.......');
});

// global Error Handler:
app.use(globalErrorHandler);

// notFound:
app.use(notFound);

// export :

export default app;
