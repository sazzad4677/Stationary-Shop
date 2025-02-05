import TProduct from './products.interface';
import { Product } from './products.model';
import QueryBuilder from '../../QueryBuilder';
import { cloudinaryUploadMultipleImage } from '../../utils/uploadToCloudnary';
import { generateCustomID } from '../../utils/generateCustomId';
import { StatusCodes } from 'http-status-codes';
import AppError from '../../errors/AppError';
import { cloudinaryDeleteMultipleImages } from '../../utils/deleteImageFromCloudinary';
import config from '../../config';
import OpenAI from 'openai';

// Fetch all products from the database
const getProducts = async (query: Record<string, unknown>) => {
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
  const generateProductId = await generateCustomID(
    Product,
    'productId',
    'PROD',
  );
  const imageData = {
    paths: productData.images,
    imageName: generateProductId,
  };
  const uploadedImages = await cloudinaryUploadMultipleImage(imageData);
  const uploadedImagesUrls = uploadedImages.map((image) => image.secure_url);
  const productDataWithImages = {
    ...productData,
    inStock: productData.quantity >= 0,
    productId: generateProductId,
    images: uploadedImagesUrls,
  };
  const result = await Product.create(productDataWithImages);
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
  const existingProduct = await Product.findById(id);
  if (!existingProduct) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Product not found');
  }
  const existingImages = existingProduct.images || [];

  const providedImages = productData.images || [];
  const retainedImages = existingImages.filter((image) =>
    providedImages.includes(image),
  );

  const imagesToDelete = existingImages.filter(
    (image) => !providedImages.includes(image),
  );
  if (imagesToDelete.length > 0) {
    await cloudinaryDeleteMultipleImages({ urls: imagesToDelete });
  }

  const newLocalImages = providedImages.filter(
    (image) => !existingImages.includes(image) && !image.startsWith('http'),
  );

  let newImageUrls: string[] = [];
  if (newLocalImages.length > 0) {
    const imageData = {
      paths: newLocalImages.filter((image) => !image.startsWith('http')),
      imageName: existingProduct.productId,
    };
    const uploadedImages = await cloudinaryUploadMultipleImage(imageData);
    newImageUrls = uploadedImages.map((image) => image.secure_url);
  }
  const updatedImages = [...retainedImages, ...newImageUrls];
  const result = await Product.findByIdAndUpdate(
    id,
    {
      ...productData,
      images: updatedImages,
      inStock: (productData.quantity ?? 0) >= 0,
    },
    { new: true },
  );

  return result;
};

const deleteProduct = async (id: string): Promise<TProduct | null> => {
  const result = await Product.findByIdAndDelete(id);
  return result;
};

const generateProductDescription = async ({name, category, brand}: {name: string, category: string, brand: string}) => {
  const openai = new OpenAI({
    baseURL: config.openai_base_url,
    apiKey: config.openai_api_key as string,
  });
  try {
    const completion = await openai.chat.completions.create({
      model: config.openai_api_model as string,
      messages: [
        {
          role: 'user',
          content: `Suppose you are adding a product in a E-Commerce site. Now Generate a professional product description for a ${category} named "${name}" from the brand "${brand}".`,
        },
      ],
    });
    return completion.choices[0].message.content;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error occurred';
    throw new AppError(
      400,
      'Failed to generate product description',
      errorMessage,
    );
  }
};

export const productService = {
  getProducts,
  createProduct,
  getProductByID,
  updateProduct,
  deleteProduct,
  generateProductDescription,
};
