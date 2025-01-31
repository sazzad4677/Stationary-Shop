import AppError from '../../errors/AppError';
import { User } from '../users/users.model';
import { IUser } from '../users/users.interface';
import { StatusCodes } from 'http-status-codes';
import { ILoginUser } from './auth.interface';
import jwt from 'jsonwebtoken';
import config from '../../config';

const registerUser = async (payload: IUser) => {
  const isUserExist = await User.isUserExist(payload.email);
  if (isUserExist) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'User already exist');
  }
  const result = await User.create(payload);
  return result;
};

const loginUser = async (
  payload: ILoginUser,
): Promise<{ token: string; refreshToken: string }> => {
  const existUser = await User.isUserExist(payload.email);
  if (!existUser) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Invalid credentials');
  }
  const isPasswordMatch: boolean = await User.isPasswordMatched(
    payload.password,
    existUser.password,
  );
  if (!isPasswordMatch) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Invalid credentials');
  }
  if (existUser.isBlocked) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'User is blocked');
  }
  const user = {
    email: existUser.email,
    role: existUser.role,
    name: existUser.name,
    _id: existUser._id
  };
  const token = jwt.sign(user, config.token_secret as string, {
    expiresIn: 3600,
  });
  const refreshToken = jwt.sign(user, config.refresh_token_secret as string, {
    expiresIn: 604800000 ,
  });

  return {
    token,
    refreshToken,
  };
};

export const AuthService = {
  registerUser,
  loginUser,
};
