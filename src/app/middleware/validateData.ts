import catchAsync from '../utils/catchAsync';
import { AnyZodObject } from 'zod';

const validateData = (schema: AnyZodObject) => {
  return catchAsync(async (req, res, next) => {
    await schema.parseAsync(req.body);
    next();
  });
};

export default validateData;
