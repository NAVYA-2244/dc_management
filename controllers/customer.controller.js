const customerService = require("../services/customer.service");

console.log("customerService =>", customerService);

exports.syncCustomers = async (req, res) => {
  try {

    // Background lo run avuthundi
    customerService.syncCustomers()
      .then((result) => {
        console.log("Customer Sync Completed");
        console.log(result);
      })
      .catch((err) => {
        console.error("Customer Sync Failed:", err);
      });

    // Immediate response
    return res.status(200).json({
      result: "success",
      message: "Customer sync started. Please wait until it completes."
    });

  } catch (err) {
    return res.status(400).json({
      result: "error",
      error: err.message
    });
  }
};