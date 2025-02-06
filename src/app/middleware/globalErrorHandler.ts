/* eslint-disable no-unused-vars */
import { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { TErrorDetails, TGenericErrorResponse } from '../interface/error';
import config from '../config';
import handleZodError from '../errors/handleZodError';
import handleValidationError from '../errors/handleValidationError';
import handleCastError from '../errors/handleCastError';
import handleDuplicateError from '../errors/handleDuplicateError';
import AppError from '../errors/AppError';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  let statusCode = err?.statusCode || 500;
  let message = err.message || 'Something went wrong!';
  let errorDetails: TErrorDetails = [
    {
      path: '',
      message: err.message || 'Something went wrong',
    },
  ];

  if (err instanceof ZodError) {
    const simplifiedError: TGenericErrorResponse = handleZodError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorDetails = simplifiedError.errorDetails;
  } else if (err?.name === 'ValidationError') {
    const simplifiedError: TGenericErrorResponse = handleValidationError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorDetails = simplifiedError.errorDetails;
  } else if (err?.name === 'CastError') {
    const simplifiedError: TGenericErrorResponse = handleCastError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorDetails = simplifiedError.errorDetails;
  } else if (err?.code === 11000) {
    const simplifiedError: TGenericErrorResponse = handleDuplicateError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorDetails = simplifiedError.errorDetails;
  } else if (err instanceof AppError) {
    statusCode = err?.statusCode;
    message = err.message;
    errorDetails = [
      {
        path: '',
        message: err?.message,
      },
    ];
  } else if (err instanceof Error) {
    message = err.message;
    errorDetails = [
      {
        path: '',
        message: err?.message,
      },
    ];
  }
  res.status(statusCode).json({
    success: false,
    message,
    error: errorDetails,
    stack: !config.node_env ? err?.stack : null,
  });
};
export default globalErrorHandler;
