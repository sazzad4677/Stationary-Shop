/* eslint-disable no-unused-vars */
import { Model, Types } from 'mongoose';
import { UserRole } from './users.constant';

export interface IUser {
  _id: Types.ObjectId
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  isBlocked: boolean;
}

export interface UserModel extends Model<IUser> {
  isUserExist(email: string): IUser | null;
  isPasswordMatched(password: string, hash: string): boolean;
}

export type TUserRole = (typeof UserRole)[keyof typeof UserRole];