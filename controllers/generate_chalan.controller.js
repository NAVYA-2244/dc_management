


const service = require("../services/generate_chalan.service");

// controllers/dashboard.controller.js

exports.generateChallan = async (req, res) => {
  console.log("req.user:", req.user);
    try {

        const { id } = req.params;

        const data = await service.generateChallan(id, req.user);

        return res.status(200).json({
            result: "success",
            data
        });

    } catch (err) {

        return res.status(400).json({
            result: "error",
            error: err.message
        });

    }
};

exports.generatePdf = async (req, res) => {
  try {

    const data = await service.generatePdf(
      req.params.deliverychallan_id
    );

    res.status(200).json({
      result: "success",
      data
    });

  } catch (err) {

    res.status(400).json({
      result: "error",
      error: err.message
    });

  }
};



exports.downloadPdf = async (req, res) => {
  try {

    await service.downloadPdf(
      req.params.deliverychallan_id,
      res
    );

  } catch (err) {

    res.status(400).json({
      result: "error",
      error: err.message
    });

  }
};