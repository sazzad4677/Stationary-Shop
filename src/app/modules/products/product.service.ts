import TProduct from './products.interface';
import { Product } from './products.model';
import QueryBuilder from '../../QueryBuilder';

// Fetch all products from the database
const getProducts = async (
  query: Record<string, unknown>,
) => {
  const queryBuilder = new QueryBuilder(Product.find({}), query)
    .filter()
    .sort()
    .search()
    .paginate();
  const result = await queryBuilder.modelQuery;
  const meta = await queryBuilder.countTotal();
  return {
    meta,
    result,
  };
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
