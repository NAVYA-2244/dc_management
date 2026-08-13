const axios = require("axios");

const SMS_API_URL = process.env.SMS_API_URL;

const SMS_CONFIG = {
  sendSMS: "1",
  username: process.env.SMS_USERNAME,
  sender_id: process.env.SMS_SENDER_ID,
  entity_id: process.env.SMS_ENTITY_ID,
  apikey: process.env.SMS_API_KEY,
  template_id: process.env.SMS_TEMPLATE_ID,
};

// SEND SMS
async function sendSMS(mobile, otp) {
  try {
    const message = `Dear User, your OTP for FRS App password reset is ${otp}. Do not share it. – Entro Labs`;

    const payload = {
      ...SMS_CONFIG,
      msg: message,
      mobile,
    };

    const response = await axios.post(SMS_API_URL, payload, {
      headers: { "Content-Type": "application/json" },
    });

    console.log("📱 SMS Response:", JSON.stringify(response.data, null, 2));

    if (response.data?.result === "success") {
      return true;
    }

    throw new Error(response.data?.error || "SMS failed");
  } catch (error) {
    console.error("❌ SMS Error:", error.message);
    throw error;
  }
}

module.exports = { sendSMS };
