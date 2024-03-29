import dotenv from 'dotenv';
import path from 'path';

// dotenv setup with process.cwd() :
dotenv.config({ path: path.join(process.cwd(), '.env') });
// console.log(process.cwd() + ".env");

export = {
  port: process.env.PORT,
  database_url: process.env.DATABASE_URI,
  bcrypt_solt_rounds: process.env.BCRYPT_SOLT_ROUNDS,
  default_password: process.env.DEFAULT_PASSWORD,
  superAdminPassword: process.env.SUPER_ADMIN_PASS,
  node_env: process.env.NODE_ENV,
  jwt_access_token: process.env.JWT_ACCESS_SECRET,
  jwt_refresh_token: process.env.JWT_REFRESH_SECRET,
  jwt_access_expiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
  jwt_refresh_expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
  jwt_reset_token: process.env.JWT_RESET_TOKEN,
  jwt_reset_expiresIn: process.env.JWT_RESET_EXPIRES_IN,
  my_gmail_app_password: process.env.MY_GMAIL_APP_PASSWORD,
  reset_password_frontend_url: process.env.RESET_PASSWORD_FRONTEND_URL,
  cloud_name: process.env.CLOUD_NAME,
  cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
  cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET,
};
