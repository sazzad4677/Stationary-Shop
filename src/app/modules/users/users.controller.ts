import catchAsync from '../../utils/catchAsync';
import { UserService } from './users.service';
import sendResponse from '../../utils/sendResponse';
import { IUser } from './users.interface';

const getAllUser = catchAsync(async (req, res, next) => {
  const result = await UserService.getAllUser();
  sendResponse<IUser[]>(res, {
    statusCode: 200,
    message: 'User Successfully created',
    success: true,
    data: result,
  });
});



export const UserController = {
  getAllUser,
};