

const authService = require("../services/auth.service");

exports.login = async (req, res) => {
  try {
    const result = await authService.login(req.body);

    return res.status(200).json(result);
  } catch (err) {
    return res.status(400).json({
      result: "error",
      error: err.message,
       message: err.message,
    });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const result = await authService.forgotPassword(req.body.mobile);

    return res.status(200).json(result);
  } catch (err) {
    return res.status(400).json({
      result: "error",
      error: err.message,
       message: err.message,
    });


  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const result = await authService.verifyOtp(req.body);

    return res.status(200).json(result);
  } catch (err) {
    return res.status(400).json({
      result: "error",
      error: err.message,
       message: err.message,
    });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const result = await authService.resetPassword(req.body);

    return res.status(200).json(result);
  } catch (err) {
    return res.status(400).json({
      result: "error",
      error: err.message,
       message: err.message,
    });
  }
};


exports.logout = async (req, res) => {
  try {
    return res.status(200).json({
      result: "success",
      message: "Logout successful",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,

    });
  }
};


exports.createUser = async (req, res) => {
  try {
    const result = await authService.createUser(req.body);

    return res.status(201).json(result);
  } catch (err) {
    return res.status(400).json({
      result: "error",
      error: err.message,
      message: err.message,
    });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const userId = req.user.id; // JWT middleware nunchi decoded token lo id vastundi
    const { newPassword } = req.body;

    const result = await authService.changePassword({ userId, newPassword });

    return res.status(200).json(result);
  } catch (err) {
    return res.status(400).json({
      result: "error",
      error: err.message,
      message: err.message,
    });
  }
};