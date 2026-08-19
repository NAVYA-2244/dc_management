const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");
const verifyToken = require("../middleware/auth.middleware");
router.post("/login", authController.login);

router.post("/create-user", authController.createUser);

router.post("/change-password", verifyToken, authController.changePassword);

router.post("/forgot-password", authController.forgotPassword);

router.post("/verify-otp", authController.verifyOtp);

router.post("/reset-password", authController.resetPassword);

router.post("/logout", authController.logout);

module.exports = router;
