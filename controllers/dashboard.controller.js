// const service = require("../services/dashboard.service");

// exports.getDashboard = async (req, res) => {
//   try {
//     // const page = Number(req.query.page) || 1;
//     // const limit = Number(req.query.limit) || 2000;
//     const { page, limit ,search} = req.query;
//     // const data = await dashboardService.getDashboard(page, limit);
//     const data = await service.getDashboard(page, limit,search);
//     res.json({
//       success: true,
//       data,
//     });
//   } catch (err) {
//     res.status(500).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };
// exports.getDeliveryChallanDetails = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const data = await service.getDeliveryChallanDetails(id);

//     res.json({
//       success: true,

//       data: data,
//     });
//   } catch (error) {
//     res.status(error.statusCode || 500).json({
//       success: false,

//       message: error.message,
//     });
//   }
// };



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

exports.getDeliveryChallanDetails = async (req, res) => {
  try {

    const { id } = req.params;

    const data = await service.getDeliveryChallanDetails(id);

    return res.status(200).json({
      result: "success",
      data,
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