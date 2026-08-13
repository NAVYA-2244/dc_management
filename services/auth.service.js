const jwt = require("jsonwebtoken");
const { sendSMS } = require("../config/smsConfig")

const axios = require("axios");
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const db = require("../models");


(async () => {
  const hash = await bcrypt.hash("123456", 10);
  console.log(hash);
})();




exports.login = async ({ username, password, remember_me }) => {

    const user = await db.users.findOne({

        where: {
            [Op.or]: [
                { email: username },
                { mobile: username }
            ],
            status: true
        }

    });

    if (!user) {
        throw new Error("Invalid Email or Mobile");
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
        throw new Error("Invalid Password");
    }

    await user.update({
        last_login: new Date()
    });

    const tokenPayload = {
        username: user.email || user.mobile,
        id: user.id
    };

    const token = jwt.sign(
        tokenPayload,
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );

    const refresh_token = jwt.sign(
        tokenPayload,
        process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
        { expiresIn: "365d" }
    );

    return {

        login: true,
        result: "success",

        token,
        // refresh_token,

        expires_in: "365d",
        remember_me: remember_me || false,

        username: user.email || user.mobile,
        name: user.full_name,
        mobile: user.mobile,
        email: user.email,

        userlevel: user.role,
        // designation: user.designation || "",
        // employee_id: user.employee_id || "",
        // employee_name: user.full_name,

        branch: user.branch || null,
        role: user.role,


    };

};


exports.forgotPassword = async (mobile) => {
  // Check user exists
  const user = await db.users.findOne({
    where: {
      mobile,
      status: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // Generate OTP
  const otp = Math.floor(100000 + Math.random() * 900000);

  console.log("OTP:", otp);

  // Send SMS
  await sendSMS(mobile, otp);

  // Save OTP (recommended)
  await user.update({
    otp,
    otp_created_at: new Date(),
  });

  return {
    success: true,
    message: "OTP sent successfully",
  };
};

exports.verifyOtp = async ({ mobile, otp }) => {
  const user = await db.users.findOne({
    where: {
      mobile,
      status: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  if (String(user.otp) !== String(otp)) {
    throw new Error("Invalid OTP");
  }

  return {
    success: true,
    message: "OTP Verified",
  };
};


exports.resetPassword = async ({ mobile, newPassword }) => {
  // Check user exists
  const user = await db.users.findOne({
    where: {
      mobile,
      status: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // Hash new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Update password & clear OTP
  await user.update({
    password: hashedPassword,
    otp: null,
    otp_created_at: null,
  });

  return {
    success: true,
    message: "Password Updated Successfully",
  };
};


exports.logout = async () => {
  return {
    result: "success",
    message: "Logout successful",
  };
};