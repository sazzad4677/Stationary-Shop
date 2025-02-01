import { z } from 'zod';
import { UserRole } from '../users/users.constant';

const registerUserSchema = z.object({
  name: z.string({
    required_error: 'Name is required',
  }),
  email: z
    .string({
      required_error: 'Email is required',
    })
    .email('Invalid email format'),
  password: z
    .string({
      required_error: 'Password is required',
    })
    .min(6, 'Password minimum 6 characters long'),
  role: z.enum(Object.values(UserRole) as [string]).default('user'),
  isBlocked: z.boolean().default(false),
});

const loginUserSchema = z.object({
  email: z
    .string({
      required_error: 'Email is required',
    })
    .email('Invalid email format'),
  password: z.string({
    required_error: 'Password is required',
  }),
});


export const AuthValidation = {
  registerUserSchema,
  loginUserSchema,
};
