const db = require("../models");
const zohoService = require("./zoho.service");

// Organization
exports.syncOrganizations = async () => {
  const response = await zohoService.getOrganizations();

  for (const org of response.organizations) {
    await db.Organization.upsert(org);
  }

  return response.organizations;
};



exports.syncCustomers = async () => {
 const customers = await zohoService.getContacts();

for (const customer of customers) {
    const details = await zohoService.getContactById(customer.contact_id);

    await db.Customer.upsert(details.contact);
}
  return customers;
};



exports.syncCustomerDetails = async () => {
  const customers = await zohoService.getContacts();

  console.log("Customers:", customers.length);

  for (const customer of customers) {
    console.log("Fetching:", customer.contact_id);

    const response = await zohoService.getContactById(customer.contact_id);

    console.log("Saving:", customer.contact_id);

    await db.CustomerDetails.upsert(response.contact);
  }

  return customers;
};

// exports.syncDeliveryChallans = async () => {


//  const challans = await zohoService.getAllDeliveryChallans();


//  for(const challan of challans){


//    // Save header data
//    await db.DeliveryChallan.upsert({

//       deliverychallan_id:
//       challan.deliverychallan_id,

//       customer_id:
//       challan.customer_id,

//       customer_name:
//       challan.customer_name,

//       company_name:
//       challan.company_name,

//       status:
//       challan.status,

//       challan_status:
//       challan.challan_status,

//       deliverychallan_number:
//       challan.deliverychallan_number,

//       date:
//       challan.date,

//       currency_code:
//       challan.currency_code,

//       total:
//       challan.total,

//       branch_id:
//       challan.branch_id,

//       location_id:
//       challan.location_id,

//       location_name:
//       challan.location_name

//    });



//    // Get full details by ID

//    const detail =
//    await zohoService.getDeliveryChallanById(
//        challan.deliverychallan_id
//    );


//    const dc = detail.deliverychallan;



//    // Save complete details

//    await db.DeliveryChallanDetails.upsert({

//       deliverychallan_id:
//       dc.deliverychallan_id,


//       line_items:
//       dc.line_items,


//       billing_address:
//       dc.billing_address,


//       shipping_address:
//       dc.shipping_address,


//       taxes:
//       dc.taxes,


//       custom_fields:
//       dc.custom_fields,


//       custom_field_hash:
//       dc.custom_field_hash,


//       zoho_response:
//       dc

//    });


//  }


//  return challans;

// };


exports.syncDeliveryChallans = async()=>{


 const challans =
 await zohoService.getAllDeliveryChallans();


 for(const challan of challans){


   const response =
   await zohoService.getDeliveryChallanById(
      challan.deliverychallan_id
   );


   const dc=response.deliverychallan;


   // Header table

   await db.DeliveryChallan.upsert({

     deliverychallan_id:dc.deliverychallan_id,

     customer_id:dc.customer_id,

     customer_name:dc.customer_name,

     company_name:dc.customer_name,

     status:dc.challan_status,

     challan_status:dc.challan_status,

     deliverychallan_number:
     dc.deliverychallan_number,

     date:dc.date,

     currency_code:
     dc.currency_code,

     total:
     dc.total,

     branch_id:
     dc.branch_id,

     location_id:
     dc.location_id,

     location_name:
     dc.location_name

   });



   // Detail table

   await db.DeliveryChallanDetails.upsert({

     deliverychallan_id:
     dc.deliverychallan_id,


     line_items:
     dc.line_items,


     billing_address:
     dc.billing_address,


     shipping_address:
     dc.shipping_address,


     taxes:
     dc.taxes,


     custom_fields:
     dc.custom_fields,


     custom_field_hash:
     dc.custom_field_hash,


     zoho_response:
      dc

   });


 }


 return challans;

};