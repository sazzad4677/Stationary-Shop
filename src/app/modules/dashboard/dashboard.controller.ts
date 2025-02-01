import catchAsync from '../../utils/catchAsync';
import { DashboardService } from './dashboard.service';
import sendResponse from '../../utils/sendResponse';

const getDashboardInfo = catchAsync(async (req, res) => {
  const dashboardInfo = await DashboardService.getDashboardInfo()
  sendResponse(res, {
    statusCode: 200,
    message: 'Dashboard Info',
    success: true,
    data: dashboardInfo,
  })
})

export const DashboardController = {
  getDashboardInfo,
}