const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authenticate = require("../middleware/auth.middleware");

router.get("/users", authenticate, userController.getUsers);
router.get("/users/:id", authenticate, userController.getUserById);
router.put("/users/:id", authenticate, userController.updateUser);
router.delete("/users/:id", authenticate, userController.deleteUser);

module.exports = router;