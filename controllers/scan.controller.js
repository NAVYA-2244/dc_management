const scanService = require("../services/scan.service");

exports.getLineItem = async (req, res) => {
  try {
    const data = await scanService.getLineItem(
      req.params.line_item_id
    );

    res.status(200).json({
      result: "success",
      data,
    });

  } catch (err) {
    res.status(500).json({
      result: "failed",
      message: err.message,
    });
  }
};


exports.skipScan = async (req, res) => {
console.log(req.body);
  try {
    const data = await scanService.skipScan(
      req.params.line_item_id
    );

    res.status(200).json({
      result: "success",
      data,
    });

  } catch (err) {
    res.status(500).json({
      result: "failed",
      message: err.message,
    });
  }
};


exports.saveSerialNumbers = async (req, res) => {
  try {
    console.log("Params:", req.params);
    console.log("Body:", req.body);

    const data = await scanService.saveSerialNumbers(
      req.params.lineItemId,
      req.body
    );

    res.status(200).json({
      result: "success",
      data,
    });

  } catch (err) {
    res.status(400).json({
      result: "failed",
      message: err.message,
    });
  }
};


exports.getScannedSerialNumbers = async (req, res) => {
  try {
    const data =
      await scanService.getScannedSerialNumbers(
        req.params.line_item_id
      );

    res.status(200).json({
      result: "success",
      data,
    });

  } catch (error) {
    res.status(400).json({
      result: "failed",
      message: error.message,
    });
  }
};


exports.updateSerialNumber = async (req, res) => {
  try {
    const data = await scanService.updateSerialNumber(
      req.params.id,
      req.body.serial_number
    );

    res.status(200).json({
      result: "success",
      data,
    });

  } catch (err) {
    res.status(400).json({
      result: "failed",
      message: err.message,
    });
  }
};