


const service = require("../services/dashboard.service");

exports.getDashboard = async (req, res) => {
  try {
    const { page, limit, search } = req.query;

    const data = await service.getDashboard(page, limit, search);

    return res.status(200).json({
      result: "success",
      data,
    });

  } catch (err) {

    return res.status(500).json({
      result: "error",
      error: err.message,
    });

  }
};

// exports.getDeliveryChallanDetails = async (req, res) => {
//   try {

//     const { id } = req.params;

//     const data = await service.getDeliveryChallanDetails(id);

//     return res.status(200).json({
//       result: "success",
//       data,
//     });

//   } catch (error) {

//     return res.status(error.statusCode || 500).json({
//       result: "error",
//       error: error.message,
//     });

//   }
// };

exports.getDeliveryChallanDetails = async (req, res) => {
  try {
    const { id } = req.params;

    // service returns { success: true, data: {...} }
    // we only need the inner "data" here, since "result: success" at the
    // top already tells the caller the request succeeded.
    const serviceResult = await service.getDeliveryChallanDetails(id);

    return res.status(200).json({
      result: "success",
      data: serviceResult.data,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      result: "error",
      error: error.message,
    });
  }
};
exports.closeDeliveryChallan = async (req, res) => {
  try {

    const { id } = req.params;

    const data = await service.closeDeliveryChallan(id, req.user);

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