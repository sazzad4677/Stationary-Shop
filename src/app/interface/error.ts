export type TErrorDetails = {
  path: string | number;
  message: string;
}[];

export type TGenericErrorResponse = {
  success: false;
  message: string;
  statusCode: number;
  errorDetails: TErrorDetails;
};
