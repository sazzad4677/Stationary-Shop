import { categories } from './products.constants';

type TProduct = {
  productId: string;
  name: string;
  brand: string;
  price: number;
  category: typeof categories[number];
  description: string;
  quantity: number;
  inStock: boolean;
  images: string[];
};

export default TProduct;
