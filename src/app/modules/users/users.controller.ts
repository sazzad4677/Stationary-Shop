import catchAsync from '../../utils/catchAsync';
import { UserService } from './users.service';
import sendResponse from '../../utils/sendResponse';
import { IUser } from './users.interface';

const getAllUser = catchAsync(async (req, res) => {
  const result = await UserService.getAllUser();
  sendResponse<IUser[]>(res, {
    statusCode: 200,
    message: 'User Successfully created',
    success: true,
    data: result,
  });
});

const getMyProfile = catchAsync(async (req, res) => {
  const result = await UserService.getMyProfile(req.user._id);
  sendResponse<IUser>(res, {
    statusCode: 200,
    message: 'User Information Retrieved Successfully',
    success: true,
    data: result
  })
})



export const UserController = {
  getAllUser,
  getMyProfile
};