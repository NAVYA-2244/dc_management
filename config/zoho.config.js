require("dotenv").config();

module.exports = {
  PORT: process.env.PORT || 3001,

  ORGANIZATION_ID: process.env.ZOHO_ORGANIZATION_ID,

  REFRESH_TOKEN: process.env.ZOHO_REFRESH_TOKEN,

  CLIENT_ID: process.env.ZOHO_CLIENT_ID,

  CLIENT_SECRET: process.env.ZOHO_CLIENT_SECRET,

  REDIRECT_URI: process.env.ZOHO_REDIRECT_URI,

  ACCOUNTS_URL: "https://accounts.zoho.com",

  API_URL: "https://www.zohoapis.com",
};