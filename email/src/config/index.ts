import * as dotenv from 'dotenv';
dotenv.config();
// kafka
const EMAIL_TOPIC: string = process.env.EMAIL_TOPIC;

// email
const EMAIL_DEFAULT: string = process.env.EMAIL_DEFAULT;
const SMTP_SERVER: string = process.env.SMTP_SERVER;
const SMTP_USER : string = process.env.SMTP_USER;
const SMTP_PASSWORD : string = process.env.SMTP_PASSWORD;
const SMTP_PORT = process.env.SMTP_PORT;

// OAuth
const OAUTH_CLIENT_SECRET = process.env.OAUTH_CLIENT_SECRET;
const OAUTH_CLIENT_ID = process.env.OAUTH_CLIENT_ID;
const OAUTH_REFRESH_TOKEN = process.env.OAUTH_REFRESH_TOKEN;


export {
  EMAIL_TOPIC,
  EMAIL_DEFAULT,
  SMTP_USER,
  SMTP_PASSWORD,
  OAUTH_CLIENT_SECRET,
  OAUTH_CLIENT_ID,
  OAUTH_REFRESH_TOKEN,
  SMTP_SERVER,
  SMTP_PORT
};