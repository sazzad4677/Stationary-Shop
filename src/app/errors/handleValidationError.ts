import mongoose from 'mongoose';
import { TErrorDetails, TGenericErrorResponse } from '../interface/error';

const handleValidationError = (
  err: mongoose.Error.ValidationError,
): TGenericErrorResponse => {
  const statusCode = 400;
  const errorDetails: TErrorDetails = Object.values(err.errors).map(
    (val: mongoose.Error.ValidatorError | mongoose.Error.CastError) => {
      return {
        path: val?.path,
        message: val?.message,
      };
    },
  );

  return {
    success: false,
    statusCode,
    message: 'Validation errors',
   errorDetails,
  };
};

export default handleValidationError;
