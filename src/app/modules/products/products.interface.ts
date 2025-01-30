import { categories } from './products.constants';

type TProduct = {
  name: string;
  brand: string;
  price: number;
  category: typeof categories[number];
  description: string;
  quantity: number;
  inStock: boolean;
};

export default TProduct;
