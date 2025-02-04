import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
  database_url: process.env.DATABASE_URL,
  port: process.env.PORT,
  node_env: process.env.NODE_ENV,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
  token_secret: process.env.TOKEN_SECRET,
  token_expires_in: process.env.TOKEN_EXPIRES_IN,
  refresh_token_secret: process.env.REFRESH_TOKEN_SECRET,
  refresh_token_expires_in: process.env.REFRESH_TOKEN_EXPIRES_IN,
  stripe_secret_key: process.env.STRIPE_SECRET_KEY,
  frontend_url: process.env.FRONTEND_URL,
  stripe_webhook_secret: process.env.STRIPE_WEBHOOK_SECRET,
  cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
  cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET,
  cloudinary_cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
};
