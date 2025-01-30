import { User } from './users.model';


const getAllUser = async () => {
  const result = await User.find({});
  return result;
};

const getMyProfile = async (userId: string) => {
  const result = await User.findById(userId);
  return result;
}

export const UserService = {
  getAllUser,
  getMyProfile
};