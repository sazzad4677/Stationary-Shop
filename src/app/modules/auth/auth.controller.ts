import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AuthService } from './auth.service';
import { IRegisterUser, IToken } from './auth.interface';
import config from '../../config';
import { StatusCodes } from 'http-status-codes';

const registerUser = catchAsync(async (req, res) => {
  const user = req.body;
  const result = await AuthService.registerUser(user);
  res.cookie('refreshToken', result.refreshToken, {
    secure: (config.node_env as string).toString() === 'production',
  });
  sendResponse<IRegisterUser>(res, {
    statusCode: 200,
    message: 'User Registered Successfully',
    success: true,
    data: {
      token: result.token,
    },
  });
});

const loginUser = catchAsync(async (req, res) => {
  const { token, refreshToken } = await AuthService.loginUser(req.body);
  res.cookie('refreshToken', refreshToken, {
    secure: (config.node_env as string).toString() === 'production',
  });
  sendResponse<IToken>(res, {
    statusCode: 200,
    message: 'User Logged In Successfully',
    success: true,
    data: {
      token,
    },
  });
});

const logoutUser = catchAsync(async (req, res) => {
  res.cookie('refreshToken', '', {
    httpOnly: true,
    secure: (config.node_env as string).toString() === 'production',
    expires: new Date(0),
  });

  sendResponse(res, {
    statusCode: 200,
    message: 'User Logged Out Successfully',
    success: true,
    data: null,
  });
});

const refreshToken = catchAsync(async (req, res) => {
  {
    const { refreshToken } = req.cookies;
    const result = await AuthService.refreshToken(refreshToken);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Refresh token is refreshed successfully',
      data: result,
    });
  }
});

export const AuthController = {
  registerUser,
  loginUser,
  logoutUser,
  refreshToken,
};
