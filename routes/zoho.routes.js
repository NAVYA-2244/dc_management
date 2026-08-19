const express=require("express");

const router=express.Router();

const controller=require("../controllers/zoho.controller");

router.get("/organizations",controller.organizations);

router.get("/contacts",controller.contacts);



// All delivery challans
// router.get("/delivery-challans", controller.deliveryChallans);

// Delivery challans by customer/contact
router.get(
  "/delivery-challans/contact/:contactId",
  controller.deliveryChallansByContact
);

router.get(
  "/delivery-challans/:id",
  controller.deliveryChallanById
);

router.get(
  "/delivery-challans",
  controller.allDeliveryChallans
);



// New APIs
router.get("/items", controller.items);
router.get("/items/:id", controller.itemById);

router.get("/sales-orders", controller.salesOrders);
router.get("/sales-orders/:id", controller.salesOrderById);

router.get("/invoices", controller.invoices);
router.get("/invoices/:id", controller.invoiceById);

router.get("/packages", controller.packages);
router.get("/packages/:id", controller.packageById);

router.get("/shipments", controller.shipments);
router.get("/shipments/:id", controller.shipmentById);

router.get("/locations", controller.locations);

router.get("/callback", controller.callback);



router.post("/organizations/sync", controller.syncOrganizations);

router.post("/customers/sync", controller.syncCustomers);

router.post("/delivery-challans/sync", controller.syncDeliveryChallans);

router.post("/customers/save", controller.syncCustomers);
router.post(
  "/customer-details/sync",
  controller.syncCustomerDetails
);


module.exports=router;