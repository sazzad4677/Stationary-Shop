import { v2 as cloudinary } from 'cloudinary';
import config from '../config';
import AppError from '../errors/AppError';
import { StatusCodes } from 'http-status-codes';

type TDeleteMultipleImages = {
  urls: string[];
};

export const cloudinaryDeleteMultipleImages = async (
  files: TDeleteMultipleImages,
) => {
  cloudinary.config({
    cloud_name: config.cloudinary_cloud_name,
    api_key: config.cloudinary_api_key,
    api_secret: config.cloudinary_api_secret,
  });

  try {
    const deletedResults = await Promise.all(
      files.urls.map(async (url) => {
        const publicId = url.split('/').pop()?.split('.')[0]; // This assumes the naming convention is consistent
        if (!publicId) throw new AppError(StatusCodes.BAD_REQUEST, `Invalid URL: ${url}`);

        const result = await cloudinary.uploader.destroy(publicId);
        return result;
      }),
    );

    return deletedResults; // Return the results of deletion
  } catch (error) {
    console.error('Error deleting image(s) from Cloudinary:', error);
    throw error;
  }
};