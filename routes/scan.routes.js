const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth.middleware");
router.use(verifyToken); 
const scanController = require("../controllers/scan.controller");


router.post("/line-items/:line_item_id/skip-scan",scanController.skipScan);


router.get("/line-items/:line_item_id", scanController.getLineItem);


router.post(
  "/line-items/:lineItemId/serial-numbers",
  scanController.saveSerialNumbers
);


router.put(
  "/serial-numbers/:id",
  scanController.updateSerialNumber
);


router.get(
"/line-items/:line_item_id/scaned-serial-numbers",
scanController.getScannedSerialNumbers
);

module.exports = router;