const dotenv = require("dotenv");
dotenv.config({ path: "config.env" });

const config = {
  DB_DEV: process.env.DB_DEV,
  PORT: process.env.PORT,
  DB: process.env.DB,
  ENV: process.env.ENV,
  API_KEY: process.env.API_KEY,
  PAYSTACK_API_KEY: process.env.PAYSTACK_API_KEY,
};

module.exports = config;
