import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AdminService } from './admin.service';

const blockUser = catchAsync(async (req, res) => {
  await AdminService.blockUser(req.params.userId);
  sendResponse(res, {
    statusCode: 200,
    message: 'User Status updated successfully',
    success: true,
  })
})

export const AdminController = {
  blockUser,
}