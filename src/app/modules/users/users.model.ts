import { model, Schema } from 'mongoose';
import { IUser, UserModel } from './users.interface';
import bcrypt from 'bcrypt';

import { UserRole } from './users.constant';
import config from '../../config';

const userSchema = new Schema<IUser, UserModel>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: 0 },
  role: { type: String, enum: Object.values(UserRole), default: 'user' },
  isBlocked: { type: Boolean, default: false },
  shippingAddress: {
    address1: {
      type: String,
    },
    address2: {
      type: String,
    },
    country: {
      type: String,
    },
    city: {
      type: String,
    },
    state: {
      type: String,
    },
    zipCode: {
      type: String,
    },
  },

}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true },

});

userSchema.pre('save', async function (next) {
  this.password = await bcrypt.hash(
    this.password,
    Number(config.bcrypt_salt_rounds),
  );
  next();
});

userSchema.statics.isUserExist = async function (
  email: string,
): Promise<IUser | null> {
  const user = await this.findOne({ email }).select('+password');
  return user;
};

userSchema.statics.isPasswordMatched = async function (
  password: string,
  hash: string,
): Promise<boolean> {
  return await bcrypt.compare(password, hash);
};

userSchema.virtual('isShippingAddressAdded').get(function () {
  const shippingAddress = this.shippingAddress;
  return !!(
    shippingAddress?.address1 &&
    shippingAddress?.country &&
    shippingAddress?.city &&
    shippingAddress?.state &&
    shippingAddress?.zipCode
  );
});

export const User = model<IUser, UserModel>('User', userSchema);
