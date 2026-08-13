const express = require("express");

const router = express.Router();

const Controller = require("../controllers/generate_chalan.controller");

const verifyToken = require("../middleware/auth.middleware");

router.post(
  "/delivery-challans/:id/generate-challan",
  verifyToken,
  Controller.generateChallan,
);

router.get(
  "/delivery-challans/:deliverychallan_id/pdf",

  Controller.downloadPdf,
);
module.exports = router;
