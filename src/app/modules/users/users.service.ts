import { User } from './users.model';
import { IUser } from './users.interface';
import QueryBuilder from '../../QueryBuilder';

const getAllUser = async (query: Record<string, unknown>) => {
  const queryBuilder = new QueryBuilder(User.find({}), query)
    .filter()
    .sort()
    .search()
    .paginate();
  const result = await queryBuilder.modelQuery;
  const meta = await queryBuilder.countTotal();
  return { result, meta };
};

const getMyProfile = async (userId: string) => {
  const result = await User.findById(userId);
  return result;
};

const updateMyProfile = async (userId: string, data: IUser) => {
  const result = await User.findByIdAndUpdate(userId, data, { new: true });
  return result;
};

export const UserService = {
  getAllUser,
  getMyProfile,
  updateMyProfile,
};
