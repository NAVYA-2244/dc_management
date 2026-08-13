// const express = require("express");

// const router = express.Router();

// const dashboardController = require("../controllers/dashboard.controller");

// const verifyToken = require("../middleware/auth.middleware");

// router.get(
//     "/delivery-challans/dashboard",
//     dashboardController.getDashboard
// );

// router.get(
//     "/delivery-challans/:id",
//     dashboardController.getDeliveryChallanDetails
// );

// module.exports = router;

const express = require("express");

const router = express.Router();

const dashboardController = require("../controllers/dashboard.controller");

const verifyToken = require("../middleware/auth.middleware");

router.get(
  "/delivery-challans/dashboard",
  verifyToken,
  dashboardController.getDashboard,
);

router.get(
  "/delivery-challans/:id",
  verifyToken,
  dashboardController.getDeliveryChallanDetails,
);

router.put(
    "/delivery-challans/:id/close",
    verifyToken,
  dashboardController.closeDeliveryChallan
);
module.exports = router;
