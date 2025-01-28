import { User } from '../modules/users/users.model';
import AppError from '../errors/AppError';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../utils/catchAsync';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import { TUserRole } from '../modules/users/users.interface';

const auth = (...roles: string[]) => {
  return catchAsync(async (req, res, next) => {
    const token = req.headers.authorization as string;
    if (!token) {
      throw new AppError(StatusCodes.UNAUTHORIZED, 'You are not authorized');
    }
    const decodedToken = jwt.verify(
      token.split(' ')[1],
      config.token_secret as string,
    ) as JwtPayload;

    const { email, role } = decodedToken;
    const existUser = await User.isUserExist(email);
    if (!existUser) {
      throw new AppError(StatusCodes.UNAUTHORIZED, 'User does not exist');
    }

    if (existUser.isBlocked) {
      throw new AppError(StatusCodes.UNAUTHORIZED, 'User is blocked');
    }

    if (!roles.includes(role as TUserRole)) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        'You are not authorized to access this resource',
      );
    }
    req.user = decodedToken
    next();
  });
};

export default auth;
