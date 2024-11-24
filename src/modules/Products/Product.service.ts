import TProduct from './Products.interface';
import { Product } from './Products.model';

// Fetch all products from the database
const getProducts = async (): Promise<TProduct[]> => {
  const result = await Product.find({});
  return result;
};

const createProduct = async (productData: TProduct): Promise<TProduct> => {
  const result = await Product.create(productData);
  return result;
};

const getProductByID = async (id: string): Promise<TProduct | null> => {
  const result = await Product.findById(id);
  return result;
};

const updateProduct = async (
  id: string,
  productData: Partial<TProduct>,
): Promise<TProduct | null> => {
  const result = await Product.findByIdAndUpdate(id, productData, {
    new: true,
  });
  return result;
};

const deleteProduct = async (id: string): Promise<TProduct | null> => {
  const result = await Product.findByIdAndDelete(id);
  return result;
};

export const productService = {
  getProducts,
  createProduct,
  getProductByID,
  updateProduct,
  deleteProduct,
};
