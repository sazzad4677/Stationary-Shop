import { Schema, model } from 'mongoose';
import TProduct from './products.interface';

const productSchema = new Schema<TProduct>(
  {
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
      enum: [
        'Writing',
        'Office Supplies',
        'Art Supplies',
        'Educational',
        'Technology',
      ],
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
      maxLength: [200, "Product description can't exceed 200 characters"],
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
  },
  { timestamps: true, versionKey: false },
);

export const Product = model<TProduct>('Product', productSchema);
