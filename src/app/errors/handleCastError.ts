import mongoose from 'mongoose';
import { TErrorDetails, TGenericErrorResponse } from '../interface/error';

const handleCastError = (
  err: mongoose.Error.CastError,
): TGenericErrorResponse => {
  const statusCode = 500;
  const errorDetails: TErrorDetails = [
    {
      path: err.path,
      message: err.message,
    },
  ];
  return {
    success: false,
    statusCode,
    message: 'Cast errors',
    errorDetails,
  };
};
export default handleCastError;
