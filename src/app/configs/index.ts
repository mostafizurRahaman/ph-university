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
  node_env: process.env.NODE_ENV,
  jwt_access_token: process.env.JWT_ACCESS_SECRET,
  jwt_refresh_token: process.env.JWT_REFRESH_SECRET,
  jwt_access_expiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
  jwt_refresh_expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
};
