const express = require("express");
const router = express.Router();

const customerController = require("../controllers/customer.controller");
const verifyToken = require("../middleware/auth.middleware");

router.post("/sync", customerController.syncCustomers);

module.exports = router;