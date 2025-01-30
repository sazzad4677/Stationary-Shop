import { Response } from 'express';

interface IResponse<T> {
  success: boolean;
  message: string;
  statusCode: number;
  data?: T | null;
}

const sendResponse = <T>(res: Response, data: IResponse<T>) => {
  res.status(data.statusCode).json({
    success: true,
    message: data.message,
    statusCode: data?.statusCode,
    data: data?.data,
  });
};

export default sendResponse;