// const zohoService=require("../services/zoho.service");

// exports.organizations=async(req,res)=>{

// try{

// const data=await zohoService.getOrganizations();

// res.json(data);

// }catch(err){

// res.status(500).json(err.message);

// }

// };

// exports.contacts=async(req,res)=>{

// try{

// const data=await zohoService.getContacts();

// res.json(data);

// }catch(err){

// res.status(500).json(err.message);

// }

// };

// exports.deliveryChallans = async (req, res) => {
//   try {
//     const data = await zohoService.getDeliveryChallans(
//       req.query.customer_id
//     );

//     res.json(data);
//   } catch (err) {
//     res.status(500).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };

// exports.deliveryChallansByContact = async (req, res) => {
//   try {
//     const data = await zohoService.getDeliveryChallans(
//       req.params.contactId
//     );

//     res.json(data);
//   } catch (err) {
//     res.status(500).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };

// exports.deliveryChallanById = async (req, res) => {
//   try {
//     const data = await zohoService.getDeliveryChallanById(req.params.id);
//     res.json(data);
//   } catch (err) {
//     res.status(500).json(err.message);
//   }
// };

// exports.allDeliveryChallans = async (req, res) => {
//   try {
//     const data = await zohoService.getAllDeliveryChallans();
//     res.json(data);
//   } catch (err) {
//     res.status(500).json(err.message);
//   }
// };




// // Items
// exports.items = async (req, res) => {
//   try {
//     const data = await zohoService.getItems();
//     res.json(data);
//   } catch (err) {
//     res.status(500).json(err.response?.data || err.message);
//   }
// };

// exports.itemById = async (req, res) => {
//   try {
//     const data = await zohoService.getItemById(req.params.id);
//     res.json(data);
//   } catch (err) {
//     res.status(500).json(err.response?.data || err.message);
//   }
// };

// // Sales Orders
// exports.salesOrders = async (req, res) => {
//   try {
//     const data = await zohoService.getSalesOrders();
//     res.json(data);
//   } catch (err) {
//     res.status(500).json(err.response?.data || err.message);
//   }
// };

// exports.salesOrderById = async (req, res) => {
//   try {
//     const data = await zohoService.getSalesOrderById(req.params.id);
//     res.json(data);
//   } catch (err) {
//     res.status(500).json(err.response?.data || err.message);
//   }
// };

// // Invoices
// exports.invoices = async (req, res) => {
//   try {
//     const data = await zohoService.getInvoices();
//     res.json(data);
//   } catch (err) {
//     res.status(500).json(err.response?.data || err.message);
//   }
// };

// exports.invoiceById = async (req, res) => {
//   try {
//     const data = await zohoService.getInvoiceById(req.params.id);
//     res.json(data);
//   } catch (err) {
//     res.status(500).json(err.response?.data || err.message);
//   }
// };

// // Packages
// exports.packages = async (req, res) => {
//   try {
//     const data = await zohoService.getPackages();
//     res.json(data);
//   } catch (err) {
//     res.status(500).json(err.response?.data || err.message);
//   }
// };

// exports.packageById = async (req, res) => {
//   try {
//     const data = await zohoService.getPackageById(req.params.id);
//     res.json(data);
//   } catch (err) {
//     res.status(500).json(err.response?.data || err.message);
//   }
// };

// // Shipments
// exports.shipments = async (req, res) => {
//   try {
//     const data = await zohoService.getShipments();
//     res.json(data);
//   } catch (err) {
//     res.status(500).json(err.response?.data || err.message);
//   }
// };

// exports.shipmentById = async (req, res) => {
//   try {
//     const data = await zohoService.getShipmentById(req.params.id);
//     res.json(data);
//   } catch (err) {
//     res.status(500).json(err.response?.data || err.message);
//   }
// };

// // Locations
// exports.locations = async (req, res) => {
//   try {
//     const data = await zohoService.getLocations();
//     res.json(data);
//   } catch (err) {
//     res.status(500).json(err.response?.data || err.message);
//   }
// };













// const syncService = require("../services/sync.service");

// exports.syncOrganizations = async (req, res) => {
//   try {
//     const result = await syncService.syncOrganizations();

//     res.status(200).json({
//       success: true,
//       message: "Organizations synced successfully",
//       total: result.length,
//     });
//   } catch (err) {
//     res.status(500).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };

// exports.syncCustomers = async (req, res) => {
//   try {
//     const result = await syncService.syncCustomers();

//     res.json({
//       success: true,
//       total: result.length,
//       message: "Customers saved successfully"
//     });
//   } catch (err) {
//     res.status(500).json({
//       success: false,
//       message: err.message
//     });
//   }
// };

// exports.syncDeliveryChallans = async (req, res) => {
//   try {
//     const result = await syncService.syncDeliveryChallans();

//     res.status(200).json({
//       success: true,
//       message: "Delivery Challans synced successfully",
//       total: result.length,
//     });
//   } catch (err) {
//     res.status(500).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };


// exports.syncCustomerDetails = async (req, res) => {
//   try {
//     const result = await syncService.syncCustomerDetails();

//     res.json({
//       success: true,
//       total: result.length,
//       message: "Customer Details Synced Successfully"
//     });

//   } catch (err) {
//     res.status(500).json({
//       success: false,
//       message: err.message
//     });
//   }
// };

// exports.contactById = async (req, res) => {
//   try {

//     const data = await zohoService.getContactById(
//       req.params.contactId
//     );

//     res.json(data);

//   } catch (err) {

//     res.status(500).json({
//       success: false,
//       message: err.message
//     });

//   }
// };

const axios = require("axios");

const zohoService = require("../services/zoho.service");
const syncService = require("../services/sync.service");

// Common helper — Zoho API error unte aa clean message extract chestundi,
// lekapothe normal err.message vadutundi. Anni catch blocks lo id? vadali.
function extractErrorMessage(err) {
  return (
    err.response?.data?.message ||
    err.response?.data?.error_description ||
    err.message ||
    "Something went wrong"
  );
}

exports.callback = async (req, res) => {
  try {
    const { code } = req.query;
    if (!code) {
      return res.status(400).json({
        result: "error",
        message: "Authorization code not received from Zoho",
      });
    }
    console.log("=== ZOHO CALLBACK ===");
    console.log("Authorization code received");

    const axios = require("axios");
    const config = require("../config/zoho.config");

    const tokenResponse = await axios.post(
      `${config.ACCOUNTS_URL}/oauth/v2/token`,
      null,
      {
        params: {
          grant_type: "authorization_code",
          client_id: config.CLIENT_ID,
          client_secret: config.CLIENT_SECRET,
          redirect_uri: config.REDIRECT_URI,
          code,
        },
      }
    );

    console.log("=== ZOHO TOKEN EXCHANGE RESPONSE ===");
    console.log(tokenResponse.data);

    if (!tokenResponse.data.refresh_token) {
      return res.status(400).json({
        result: "error",
        message:
          "No refresh_token in Zoho response (code may be reused/expired, or app already authorized before without prompt=consent)",
        data: tokenResponse.data,
      });
    }

    console.log(
      "=== NEW REFRESH TOKEN (copy this into .env as ZOHO_REFRESH_TOKEN) ==="
    );
    console.log(tokenResponse.data.refresh_token);

    return res.json({
      result: "success",
      message:
        "Token exchange successful. Copy refresh_token into .env as ZOHO_REFRESH_TOKEN, then pm2 restart with --update-env",
      access_token: tokenResponse.data.access_token,
      refresh_token: tokenResponse.data.refresh_token,
      expires_in: tokenResponse.data.expires_in,
    });
  } catch (err) {
    console.error("ZOHO CALLBACK ERROR:", err.response?.data || err.message);
    return res.status(500).json({
      result: "error",
      message: err.message,
      data: err.response?.data,
    });
  }
};

exports.organizations = async (req, res) => {
  try {
    const data = await zohoService.getOrganizations();
    res.json(data);
  } catch (err) {
    res.status(500).json({ result: "error", error: extractErrorMessage(err) });
  }
};

exports.contacts = async (req, res) => {
  try {
    const data = await zohoService.getContacts();
    res.json(data);
  } catch (err) {
    res.status(500).json({ result: "error", error: extractErrorMessage(err) });
  }
};

exports.deliveryChallans = async (req, res) => {
  try {
    const data = await zohoService.getDeliveryChallans(req.query.customer_id);
    res.json(data);
  } catch (err) {
    res.status(500).json({ result: "error", error: extractErrorMessage(err) });
  }
};

exports.deliveryChallansByContact = async (req, res) => {
  try {
    const data = await zohoService.getDeliveryChallans(req.params.contactId);
    res.json(data);
  } catch (err) {
    res.status(500).json({ result: "error", error: extractErrorMessage(err) });
  }
};

exports.deliveryChallanById = async (req, res) => {
  try {
    const data = await zohoService.getDeliveryChallanById(req.params.id);
    res.json(data);
  } catch (err) {
    res.status(500).json({ result: "error", error: extractErrorMessage(err) });
  }
};

exports.allDeliveryChallans = async (req, res) => {
  try {
    const data = await zohoService.getAllDeliveryChallans();
    res.json(data);
  } catch (err) {
    res.status(500).json({ result: "error", error: extractErrorMessage(err) });
  }
};

// Items
exports.items = async (req, res) => {
  try {
    const data = await zohoService.getItems();
    res.json(data);
  } catch (err) {
    res.status(500).json({ result: "error", error: extractErrorMessage(err) });
  }
};

exports.itemById = async (req, res) => {
  try {
    const data = await zohoService.getItemById(req.params.id);
    res.json(data);
  } catch (err) {
    res.status(500).json({ result: "error", error: extractErrorMessage(err) });
  }
};

// Sales Orders
exports.salesOrders = async (req, res) => {
  try {
    const data = await zohoService.getSalesOrders();
    res.json(data);
  } catch (err) {
    res.status(500).json({ result: "error", error: extractErrorMessage(err) });
  }
};

exports.salesOrderById = async (req, res) => {
  try {
    const data = await zohoService.getSalesOrderById(req.params.id);
    res.json(data);
  } catch (err) {
    res.status(500).json({ result: "error", error: extractErrorMessage(err) });
  }
};

// Invoices
exports.invoices = async (req, res) => {
  try {
    const data = await zohoService.getInvoices();
    res.json(data);
  } catch (err) {
    res.status(500).json({ result: "error", error: extractErrorMessage(err) });
  }
};

exports.invoiceById = async (req, res) => {
  try {
    const data = await zohoService.getInvoiceById(req.params.id);
    res.json(data);
  } catch (err) {
    res.status(500).json({ result: "error", error: extractErrorMessage(err) });
  }
};

// Packages
exports.packages = async (req, res) => {
  try {
    const data = await zohoService.getPackages();
    res.json(data);
  } catch (err) {
    res.status(500).json({ result: "error", error: extractErrorMessage(err) });
  }
};

exports.packageById = async (req, res) => {
  try {
    const data = await zohoService.getPackageById(req.params.id);
    res.json(data);
  } catch (err) {
    res.status(500).json({ result: "error", error: extractErrorMessage(err) });
  }
};

// Shipments
exports.shipments = async (req, res) => {
  try {
    const data = await zohoService.getShipments();
    res.json(data);
  } catch (err) {
    res.status(500).json({ result: "error", error: extractErrorMessage(err) });
  }
};

exports.shipmentById = async (req, res) => {
  try {
    const data = await zohoService.getShipmentById(req.params.id);
    res.json(data);
  } catch (err) {
    res.status(500).json({ result: "error", error: extractErrorMessage(err) });
  }
};

// Locations
exports.locations = async (req, res) => {
  try {
    const data = await zohoService.getLocations();
    res.json(data);
  } catch (err) {
    res.status(500).json({ result: "error", error: extractErrorMessage(err) });
  }
};

// ---------------- Sync Endpoints ----------------

exports.syncOrganizations = async (req, res) => {
  try {
    const result = await syncService.syncOrganizations();
    res.status(200).json({
      result: "success",
      message: "Organizations synced successfully",
      total: result.length,
    });
  } catch (err) {
    res.status(500).json({ result: "error", error: extractErrorMessage(err) });
  }
};

exports.syncCustomers = async (req, res) => {
  try {
    const result = await syncService.syncCustomers();
    res.json({
      result: "success",
      total: result.length,
      message: "Customers saved successfully",
    });
  } catch (err) {
    res.status(500).json({ result: "error", error: extractErrorMessage(err) });
  }
};

exports.syncDeliveryChallans = async (req, res) => {
  try {
    const result = await syncService.syncDeliveryChallans();
    res.status(200).json({
      result: "success",
      message: "Delivery Challans synced successfully",
      total: result.length,
    });
  } catch (err) {
    res.status(500).json({ result: "error", error: extractErrorMessage(err) });
  }
};

exports.syncCustomerDetails = async (req, res) => {
  try {
    const result = await syncService.syncCustomerDetails();
    res.json({
      result: "success",
      total: result.length,
      message: "Customer Details Synced Successfully",
    });
  } catch (err) {
    res.status(500).json({ result: "error", error: extractErrorMessage(err) });
  }
};

exports.contactById = async (req, res) => {
  try {
    const data = await zohoService.getContactById(req.params.contactId);
    res.json(data);
  } catch (err) {
    res.status(500).json({ result: "error", error: extractErrorMessage(err) });
  }
};