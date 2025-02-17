import { Schema, model } from 'mongoose';
import TProduct from './products.interface';
import { categories } from './products.constants';

const productSchema = new Schema<TProduct>(
  {
    productId: {
      type: String,
      required: [true, 'Product ID is required'],
      unique: true,
    },
    name: {
      type: String,
      required: [true, 'Product name is required'],
      maxLength: [20, "Product name can't exceed 20 characters"],
    },
    brand: {
      type: String,
      required: [true, 'Product brand is required'],
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Product price must be a positive number'],
    },
    category: {
      type: String,
      required: [true, 'Product category is required'],
      enum: [...categories],
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
    },
    quantity: {
      type: Number,
      required: [true, 'Product quantity is required'],
      min: [0, 'Product quantity must be a positive number'],
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    images: {
      type: [String],
      validate: {
        validator: function (value: string[]) {
          return value.length >= 1 && value.length <= 4;
        },
        message: 'You must provide at least 1 and at most 4 images.',
      },
    },
  },
  { timestamps: true, versionKey: false },
);

export const Product = model<TProduct>('Product', productSchema);
