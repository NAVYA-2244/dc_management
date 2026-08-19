// const jwt = require("jsonwebtoken");
// const { sendSMS } = require("../config/smsConfig")

// const axios = require("axios");
// const bcrypt = require("bcrypt");
// const { Op } = require("sequelize");
// const db = require("../models");

// (async () => {
//   const hash = await bcrypt.hash("123456", 10);
//   console.log(hash);
// })();

// exports.login = async ({ username, password, remember_me }) => {

//     const user = await db.users.findOne({

//         where: {
//             [Op.or]: [
//                 { email: username },
//                 { mobile: username }
//             ],
//             status: true
//         }

//     });

//     if (!user) {
//         throw new Error("Invalid Email or Mobile");
//     }

//     const match = await bcrypt.compare(password, user.password);

//     if (!match) {
//         throw new Error("Invalid Password");
//     }

//     await user.update({
//         last_login: new Date()
//     });

//     const tokenPayload = {
//         username: user.email || user.mobile,
//         id: user.id
//     };

//     const token = jwt.sign(
//         tokenPayload,
//         process.env.JWT_SECRET,
//         { expiresIn: "1d" }
//     );

//     const refresh_token = jwt.sign(
//         tokenPayload,
//         process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
//         { expiresIn: "365d" }
//     );

//     return {

//         login: true,
//         result: "success",

//         token,
//         // refresh_token,

//         expires_in: "365d",
//         remember_me: remember_me || false,

//         username: user.email || user.mobile,
//         name: user.full_name,
//         mobile: user.mobile,
//         email: user.email,

//         userlevel: user.role,
//         // designation: user.designation || "",
//         // employee_id: user.employee_id || "",
//         // employee_name: user.full_name,

//         branch: user.branch || null,
//         role: user.role,

//     };

// };

// exports.forgotPassword = async (mobile) => {
//   // Check user exists
//   const user = await db.users.findOne({
//     where: {
//       mobile,
//       status: true,
//     },
//   });

//   if (!user) {
//     throw new Error("User not found");
//   }

//   // Generate OTP
//   const otp = Math.floor(100000 + Math.random() * 900000);

//   console.log("OTP:", otp);

//   // Send SMS
//   await sendSMS(mobile, otp);

//   // Save OTP (recommended)
//   await user.update({
//     otp,
//     otp_created_at: new Date(),
//   });

//   return {
//     success: true,
//     message: "OTP sent successfully",
//   };
// };

// exports.verifyOtp = async ({ mobile, otp }) => {
//   const user = await db.users.findOne({
//     where: {
//       mobile,
//       status: true,
//     },
//   });

//   if (!user) {
//     throw new Error("User not found");
//   }

//   if (String(user.otp) !== String(otp)) {
//     throw new Error("Invalid OTP");
//   }

//   return {
//     success: true,
//     message: "OTP Verified",
//   };
// };

// exports.resetPassword = async ({ mobile, newPassword }) => {
//   // Check user exists
//   const user = await db.users.findOne({
//     where: {
//       mobile,
//       status: true,
//     },
//   });

//   if (!user) {
//     throw new Error("User not found");
//   }

//   // Hash new password
//   const hashedPassword = await bcrypt.hash(newPassword, 10);

//   // Update password & clear OTP
//   await user.update({
//     password: hashedPassword,
//     otp: null,
//     otp_created_at: null,
//   });

//   return {
//     success: true,
//     message: "Password Updated Successfully",
//   };
// };

// exports.logout = async () => {
//   return {
//     result: "success",
//     message: "Logout successful",
//   };
// };

const jwt = require("jsonwebtoken");
const { sendSMS } = require("../config/smsConfig");
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const db = require("../models");

const OTP_EXPIRY_MINUTES = 5;
const MAX_OTP_VERIFY_ATTEMPTS = 5;
const MAX_OTP_RESEND_COUNT = 3;
const OTP_RESEND_WINDOW_MINUTES = 15;

const PASSWORD_POLICY_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
// min 8 chars, 1 upper, 1 lower, 1 digit, 1 special char

exports.login = async ({ username, password, remember_me }) => {
  const user = await db.users.findOne({
    where: {
      [Op.or]: [{ email: username }, { mobile: username }],
      status: true,
    },
  });

  if (!user) {
    throw new Error("Invalid Email or Mobile");
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    throw new Error("Invalid Password");
  }

  await user.update({ last_login: new Date() });

  const tokenPayload = { username: user.email || user.mobile, id: user.id };

  const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  return {
    login: true,
    result: "success",
    token,
    expires_in: "365d",
    remember_me: remember_me || false,
    username: user.email || user.mobile,
    name: user.full_name,
    mobile: user.mobile,
    email: user.email,
    userlevel: user.role,
    branch: user.branch || null,
    role: user.role,
    force_password_reset: !!user.force_password_reset,
  };
};

// ---------------- FORGOT PASSWORD ----------------
exports.forgotPassword = async (mobile) => {
  if (!mobile) {
    throw new Error("Mobile number is required");
  }

  const user = await db.users.findOne({
    where: { mobile, status: true },
  });

  // Issue 1: proper error message for wrong/unregistered mobile
  if (!user) {
    throw new Error("No account found with this mobile number");
  }

  // Issue 4: resend OTP max limit within a time window
  const now = new Date();
  let resendCount = user.otp_resend_count || 0;
  let windowStart = user.otp_resend_window_start;

  const windowExpired =
    !windowStart ||
    (now - new Date(windowStart)) / 60000 > OTP_RESEND_WINDOW_MINUTES;

  if (windowExpired) {
    // reset window
    resendCount = 0;
    windowStart = now;
  }

  if (resendCount >= MAX_OTP_RESEND_COUNT) {
    throw new Error(
      `Maximum OTP resend limit reached. Please try again after ${OTP_RESEND_WINDOW_MINUTES} minutes`,
    );
  }

  const otp = Math.floor(100000 + Math.random() * 900000);

  await sendSMS(mobile, otp);

  await user.update({
    otp,
    otp_created_at: now,
    otp_attempts: 0, // reset wrong-attempt counter on new OTP
    otp_resend_count: resendCount + 1,
    otp_resend_window_start: windowStart,
  });

  return {
    success: true,
    message: "OTP sent successfully",
  };
};

// ---------------- VERIFY OTP ----------------
exports.verifyOtp = async ({ mobile, otp }) => {
  if (!mobile || !otp) {
    throw new Error("Mobile and OTP are required");
  }

  const user = await db.users.findOne({
    where: { mobile, status: true },
  });

  if (!user) {
    throw new Error("No account found with this mobile number");
  }

  if (!user.otp || !user.otp_created_at) {
    throw new Error("No OTP request found. Please request a new OTP");
  }

  // OTP expiry check
  const ageMinutes = (new Date() - new Date(user.otp_created_at)) / 60000;
  if (ageMinutes > OTP_EXPIRY_MINUTES) {
    await user.update({ otp: null, otp_created_at: null, otp_attempts: 0 });
    throw new Error("OTP has expired. Please request a new OTP");
  }

  // Issue 2: max attempts for OTP entry
  const attempts = user.otp_attempts || 0;
  if (attempts >= MAX_OTP_VERIFY_ATTEMPTS) {
    await user.update({ otp: null, otp_created_at: null, otp_attempts: 0 });
    throw new Error("Maximum OTP attempts exceeded. Please request a new OTP");
  }

  // Issue 3: proper error message for wrong OTP
  if (String(user.otp) !== String(otp)) {
    await user.update({ otp_attempts: attempts + 1 });
    const remaining = MAX_OTP_VERIFY_ATTEMPTS - (attempts + 1);
    throw new Error(
      remaining > 0
        ? `Invalid OTP`
        : "Invalid OTP. Maximum attempts exceeded, please request a new OTP",
    );
  }

  // OTP correct — mark verified, reset attempts (keep otp until reset done, or clear here if you prefer single-use immediately)
  await user.update({ otp_attempts: 0, otp_verified: true });

  return {
    success: true,
    message: "OTP Verified",
  };
};

// ---------------- RESET / CHANGE PASSWORD ----------------
exports.resetPassword = async ({ mobile, newPassword }) => {
  if (!mobile || !newPassword) {
    throw new Error("Mobile and new password are required");
  }

  const user = await db.users.findOne({
    where: { mobile, status: true },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // Require OTP to have been verified for this flow
  if (!user.otp_verified) {
    throw new Error("OTP verification required before resetting password");
  }

  // Issue 5: password policy
  if (!PASSWORD_POLICY_REGEX.test(newPassword)) {
    throw new Error(
      "Password must be at least 8 characters and include uppercase, lowercase, a number, and a special character",
    );
  }

  // Issue 6: old password should not be accepted as new password
  if (user.password) {
    const sameAsOld = await bcrypt.compare(newPassword, user.password);
    if (sameAsOld) {
      throw new Error("New password cannot be the same as the old password");
    }
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await user.update({
    password: hashedPassword,
    otp: null,
    otp_created_at: null,
    otp_attempts: 0,
    otp_resend_count: 0,
    otp_resend_window_start: null,
    otp_verified: false,
    force_password_reset: false,
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

exports.createUser = async ({
  full_name,
  email,
  mobile,
  role,
  designation,
  employee_id,
  branch,
  filepath,
  status,
}) => {
  if (!full_name || !email || !mobile) {
    throw new Error("Full name, email and mobile are required");
  }

  const existingEmail = await db.users.findOne({ where: { email } });
  if (existingEmail) {
    throw new Error("Email already exists");
  }

  const existingMobile = await db.users.findOne({ where: { mobile } });
  if (existingMobile) {
    throw new Error("Mobile number already exists");
  }

  // default password — must satisfy PASSWORD_POLICY_REGEX
  const DEFAULT_PASSWORD = "Abc@123";

  const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, 10);

  const user = await db.users.create({
    full_name,
    email,
    mobile,
    password: hashedPassword,
    role: role || "user",
    designation: designation || null,
    employee_id: employee_id || null,
    branch: branch || null,
    filepath: filepath || null,
    status: status !== undefined ? status : true,
    force_password_reset: true, // user must change password on first login
  });

  return {
    result: "success",
    message: "User created successfully. Default password set.",
    default_password: DEFAULT_PASSWORD, // send to admin UI to share with user, remove if not needed
    user: {
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      mobile: user.mobile,
      role: user.role,
      designation: user.designation,
      employee_id: user.employee_id,
      branch: user.branch,
      filepath: user.filepath,
      status: user.status,
      force_password_reset: user.force_password_reset,
    },
  };
};


// ---------------- CHANGE PASSWORD (first-login / logged-in user) ----------------
exports.changePassword = async ({ userId, newPassword }) => {
  if (!userId || !newPassword) {
    throw new Error("User and new password are required");
  }

  const user = await db.users.findOne({
    where: { id: userId, status: true },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // Password policy check
  if (!PASSWORD_POLICY_REGEX.test(newPassword)) {
    throw new Error(
      "Password must be at least 8 characters and include uppercase, lowercase, a number, and a special character"
    );
  }

  // old password తో సేమ్ కాదని check
  if (user.password) {
    const sameAsOld = await bcrypt.compare(newPassword, user.password);
    if (sameAsOld) {
      throw new Error("New password cannot be the same as the old password");
    }
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await user.update({
    password: hashedPassword,
    force_password_reset: false,
  });

  return {
    success: true,
    message: "Password changed successfully",
  };
};
// exports.createUser = async ({
//   full_name,
//   email,
//   mobile,
//   password,
//   role,
//   designation,
//   employee_id,
//   branch,
//   filepath,
//   status,
// }) => {
//   if (!full_name || !email || !mobile || !password) {
//     throw new Error("Full name, email, mobile and password are required");
//   }

//   // Check email already exists
//   const existingEmail = await db.users.findOne({
//     where: { email },
//   });

//   if (existingEmail) {
//     throw new Error("Email already exists");
//   }

//   // Check mobile already exists
//   const existingMobile = await db.users.findOne({
//     where: { mobile },
//   });

//   if (existingMobile) {
//     throw new Error("Mobile number already exists");
//   }

//   // Password validation
//   if (!PASSWORD_POLICY_REGEX.test(password)) {
//     throw new Error(
//       "Password must be at least 8 characters and include uppercase, lowercase, a number, and a special character"
//     );
//   }

//   // Hash password
//   const hashedPassword = await bcrypt.hash(password, 10);

//   const user = await db.users.create({
//     full_name,
//     email,
//     mobile,
//     password: hashedPassword,
//     role: role || "user",
//     designation: designation || null,
//     employee_id: employee_id || null,
//     branch: branch || null,
//     filepath: filepath || null,
//     status: status !== undefined ? status : true,
//   });

//   return {
//     result: "success",
//     message: "User created successfully",
//     user: {
//       id: user.id,
//       full_name: user.full_name,
//       email: user.email,
//       mobile: user.mobile,
//       role: user.role,
//       designation: user.designation,
//       employee_id: user.employee_id,
//       branch: user.branch,
//       filepath: user.filepath,
//       status: user.status,
//     },
//   };
// };
