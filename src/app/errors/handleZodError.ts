import { ZodError } from 'zod';
import { TErrorDetails, TGenericErrorResponse } from '../interface/error';

const handleZodError = (err: ZodError): TGenericErrorResponse => {
  const statusCode = 400;
  const errorDetails: TErrorDetails = err.issues.map((issue) => {
    return {
      path: issue?.path[issue.path.length - 1],
      message: issue.message,
    };
  });
  return {
    success: false,
    statusCode,
    message: 'Validation errors',
     errorDetails,
  };
};

export default handleZodError;
