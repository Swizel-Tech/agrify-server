const { config } = require("dotenv");
config();

const {
  PORT,
  SESSION_SECRET,
  DB_NAME,
  DB_USER,
  DB_HOST,
  DB_PASSWORD,
  DB_DIALECT,
  API_KEY,
  CORS_ORIGIN,

  EMAIL_FROM,
  EMAIL_PASSWORD,
  EMAIL_HOST,
  EMAIL_SENDER,

  PAYSTACK_SECRET_KEY,
} = process.env;

module.exports = {
  // APP
  PORT,
  QUERY_LIMIT: 1000,
  QUERY_PAGE: 1,
  API_KEY,
  SESSION_SECRET,
  CORS_ORIGIN,

  //   EMAIL
  EMAIL_FROM,
  EMAIL_PASSWORD,
  EMAIL_HOST,
  EMAIL_SENDER,

  // DATABASE
  database: DB_NAME,
  username: DB_USER,
  host: DB_HOST,
  password: DB_PASSWORD,
  dialect: DB_DIALECT || "mysql",

  // Paystack
  PAYSTACK_SECRET_KEY,
};
