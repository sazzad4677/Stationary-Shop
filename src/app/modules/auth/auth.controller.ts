import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AuthService } from './auth.service';
import { IRegisterUser, IToken } from './auth.interface';
import config from '../../config';

const registerUser = catchAsync(async (req, res) => {
  const user = req.body;
  const result = await AuthService.registerUser(user);
  const refinedData = {
    name: result.name,
    email: result.email,
    _id: result._id,
  };
  sendResponse<IRegisterUser>(res, {
    statusCode: 200,
    message: 'User Registered Successfully',
    success: true,
    data: refinedData,
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

export const AuthController = {
  registerUser,
  loginUser,
  logoutUser,
};
