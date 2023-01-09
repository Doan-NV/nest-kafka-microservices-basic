import * as dotenv from 'dotenv';
dotenv.config();

const MICROSERVICE_DATABASE =
  process.env.MICROSERVICE_DATABASE || 'nest_microservice';
const MYSQL_USERNAME = process.env.MYSQL_USERNAME || 'doannv';
const MYSQL_PASSWORD = process.env.MYSQL_PASSWORD || '1';
const MYSQL_HOST = process.env.MYSQL_HOST || 'localhost';
const MYSQL_PORT = process.env.MYSQL_PORT || 3306;

export {
  MICROSERVICE_DATABASE,
  MYSQL_USERNAME,
  MYSQL_PASSWORD,
  MYSQL_HOST,
  MYSQL_PORT,
};
