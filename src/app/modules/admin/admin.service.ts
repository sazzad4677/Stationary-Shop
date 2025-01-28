import { User } from '../users/users.model';

const blockUser = async (userId: string) => {
  const result = await User.findByIdAndUpdate(userId, { isBlocked: true });
  return result;
};

export const AdminService = {
  blockUser,
};