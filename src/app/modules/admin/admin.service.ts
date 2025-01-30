import { User } from '../users/users.model';
import { StatusCodes } from 'http-status-codes';
import AppError from '../../errors/AppError';

const blockUser = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User not found');
  }
  const updatedState = !user.isBlocked;
  const result = await User.findByIdAndUpdate(
    userId,
    { isBlocked: updatedState },
    { new: true },
  );
  return result;
};

export const AdminService = {
  blockUser,
};
