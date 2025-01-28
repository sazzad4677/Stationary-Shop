import { TErrorDetails, TGenericErrorResponse } from '../interface/error';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleDuplicateError = (err: any): TGenericErrorResponse => {
  const match = err.message.match(/"([^"]*)"/);
  const extractedMessage = match && match[1];
  const errorDetails: TErrorDetails = [
    {
      path: '',
      message: `${extractedMessage} is already exists`,
    },
  ];

  const statusCode = 400;

  return {
    success: false,
    statusCode,
    message: 'Duplicate Data Error',
   errorDetails,
  };
};

export default handleDuplicateError;
