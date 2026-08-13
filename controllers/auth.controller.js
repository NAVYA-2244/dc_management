// const authService = require("../services/auth.service");

// exports.login = async (req, res) => {
//   try {
//     const result = await authService.login(req.body);

//     res.status(200).json(result);
//   } catch (err) {
//     res.status(400).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };

// exports.forgotPassword = async (req, res) => {
//   try {
//     const result = await authService.forgotPassword(req.body.mobile);

//     res.json(result);
//   } catch (err) {
//     res.status(400).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };

// exports.verifyOtp = async (req, res) => {
//   try {
//     const result = await authService.verifyOtp(req.body);

//     res.json(result);
//   } catch (err) {
//     res.status(400).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };

// exports.resetPassword = async (req, res) => {
//   try {
//     const result = await authService.resetPassword(req.body);

//     res.json(result);
//   } catch (err) {
//     res.status(400).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };


const authService = require("../services/auth.service");

exports.login = async (req, res) => {
  try {
    const result = await authService.login(req.body);

    return res.status(200).json(result);
  } catch (err) {
    return res.status(400).json({
      result: "error",
      error: err.message,
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
