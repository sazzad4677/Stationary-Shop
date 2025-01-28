import { Types } from 'mongoose';

export interface IRegisterUser {
  name: string;
  email: string;
  _id: Types.ObjectId
}

export interface ILoginUser {
  email: string;
  password: string;
}

export interface IToken {
  token: string;
}