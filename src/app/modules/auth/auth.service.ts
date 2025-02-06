import AppError from '../../errors/AppError';
import { User } from '../users/users.model';
import { IUser } from '../users/users.interface';
import { StatusCodes } from 'http-status-codes';
import { ILoginUser } from './auth.interface';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../../config';
import { StringValue } from 'ms';

const registerUser = async (payload: IUser) => {
  const isUserExist = await User.isUserExist(payload.email);
  if (isUserExist) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'User already exist');
  }
  const result = await User.create({
    ...payload,
    role: 'user',
  });
  const user = {
    email: result.email,
    role: result.role,
    name: result.name,
    _id:  result._id
  };
  const token = jwt.sign(user, config.token_secret as string, {
    expiresIn: config.token_expires_in as StringValue,
  });
  const refreshToken = jwt.sign(user, config.refresh_token_secret as string, {
    expiresIn: config.refresh_token_expires_in as StringValue,
  });
  return {
    token,
    refreshToken,
  };
};

const loginUser = async (
  payload: ILoginUser,
): Promise<{ token: string; refreshToken: string }> => {
  const [existUser] = await Promise.all([User.isUserExist(payload.email)]);
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
    expiresIn: config.token_expires_in as StringValue,
  });
  const refreshToken = jwt.sign(user, config.refresh_token_secret as string, {
    expiresIn: config.refresh_token_expires_in as StringValue,
  });

  return {
    token,
    refreshToken,
  };
};


const refreshToken = async (refreshToken: string) => {
  const decoded = jwt.verify(
    refreshToken,
    config.refresh_token_secret as string,
  ) as JwtPayload;

  const { email } = decoded;

  const existUser = await User.isUserExist(email);
  if (!existUser) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User not found!');
  }
  //   check if user already deleted
  const isBlockedUser = existUser.isBlocked;
  if (isBlockedUser) {
    throw new AppError(StatusCodes.FORBIDDEN, 'User Blocked!');
  }

  const user = {
    email: existUser.email,
    role: existUser.role,
    name: existUser.name,
    _id: existUser._id
  };
  const token = jwt.sign(user, config.token_secret as string, {
    expiresIn: config.refresh_token_expires_in as StringValue,
  });
  return {
    token,
  };
};

export const AuthService = {
  registerUser,
  loginUser,
  refreshToken
};
