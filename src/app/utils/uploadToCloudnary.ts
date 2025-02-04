/* eslint-disable */
import { v2 as cloudinary } from 'cloudinary';
import config from '../config';
import * as fs from 'node:fs/promises';

type TUploadMultipleImage = {
  paths: string[];
  imageName: string;
};

export const cloudinaryUploadMultipleImage = async (
  files: TUploadMultipleImage,
) => {
  cloudinary.config({
    cloud_name: config.cloudinary_cloud_name,
    api_key: config.cloudinary_api_key,
    api_secret: config.cloudinary_api_secret,
  });

  try {
    const uploadedImages = await Promise.all(
      files.paths.map(async (path, index) => {
        const fileName = files.imageName + `_${index + 1}`;
        const uploadResult = await cloudinary.uploader.upload(path, {
          public_id: fileName,
        });
        // Await the unlink action for proper async handling
        await fs.unlink(path);
        console.log('File deleted successfully');
        return uploadResult; // Return the upload result
      }),
    );
    return uploadedImages;
  } catch (error) {
    console.error('Error uploading image(s):', error);
    throw error;
  }
};