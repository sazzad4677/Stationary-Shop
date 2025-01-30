import catchAsync from '../../utils/catchAsync';
import { UserService } from './users.service';
import sendResponse from '../../utils/sendResponse';
import { IUser } from './users.interface';
import { StatusCodes } from 'http-status-codes';

const getAllUser = catchAsync(async (req, res) => {
  const result = await UserService.getAllUser(req.query);
  sendResponse<IUser[]>(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'User Successfully Retrieved',
    data: result.result,
    meta: result.meta,
  });
});

const getMyProfile = catchAsync(async (req, res) => {
  const result = await UserService.getMyProfile(req.user._id);
  sendResponse<IUser>(res, {
    statusCode: 200,
    message: 'User Information Retrieved Successfully',
    success: true,
    data: result,
  });
});

const updateMyProfile = catchAsync(async (req, res) => {
  const result = await UserService.updateMyProfile(req.user._id, req.body);
  sendResponse<IUser>(res, {
    statusCode: 200,
    message: 'User Information Updated Successfully',
    success: true,
    data: result,
  });
});

export const UserController = {
  getAllUser,
  getMyProfile,
  updateMyProfile,
};
