import * as dotenv from 'dotenv';
dotenv.config();

const MYSQL_DATABASE = process.env.MYSQL_DATABASE || 'nest_microservice';
const MYSQL_USER = process.env.MYSQL_USER || 'doannv';
const MYSQL_PASSWORD = process.env.MYSQL_PASSWORD || 'doannv';
const MYSQL_HOST = process.env.MYSQL_HOST || 'localhost';
const MYSQL_PORT = process.env.MYSQL_PORT || 3306;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
export {
  MYSQL_DATABASE,
  MYSQL_USER,
  MYSQL_PASSWORD,
  MYSQL_HOST,
  MYSQL_PORT,
  PRIVATE_KEY,
};
