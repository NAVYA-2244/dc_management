
const db = require("../models");
const zohoService = require("./zoho.service");

const Customer = db.Customer;
const CustomerDetails = db.CustomerDetails;

exports.syncCustomers = async () => {
console.time("Customer Sync");
 console.log("Inside customer.service.js");

  const contacts = await zohoService.getContacts();

 console.log("Total Contacts =>", contacts.length);

  const batchSize = 100;
  let synced = 0;

  for (let i = 0; i < contacts.length; i += batchSize) {
    const batch = contacts.slice(i, i + batchSize);

    await Promise.all(
      batch.map(contact =>
        Customer.upsert({
          contact_id: contact.contact_id,
          contact_name: contact.contact_name,
          customer_name: contact.customer_name,
          vendor_name: contact.vendor_name,
          company_name: contact.company_name,
          website: contact.website,
          language_code: contact.language_code,
          language_code_formatted: contact.language_code_formatted,
          contact_type: contact.contact_type,
          contact_type_formatted: contact.contact_type_formatted,
          status: contact.status,
          customer_sub_type: contact.customer_sub_type,
          source: contact.source,
          is_linked_with_zohocrm: contact.is_linked_with_zohocrm,
          payment_terms: contact.payment_terms,
          payment_terms_id: contact.payment_terms_id,
          payment_terms_label: contact.payment_terms_label,
          currency_id: contact.currency_id,
          currency_code: contact.currency_code,
          twitter: contact.twitter,
          facebook: contact.facebook,
          outstanding_receivable_amount: contact.outstanding_receivable_amount,
          outstanding_receivable_amount_bcy: contact.outstanding_receivable_amount_bcy,
          outstanding_payable_amount: contact.outstanding_payable_amount,
          outstanding_payable_amount_bcy: contact.outstanding_payable_amount_bcy,
          unused_credits_receivable_amount: contact.unused_credits_receivable_amount,
          unused_credits_receivable_amount_bcy: contact.unused_credits_receivable_amount_bcy,
          unused_credits_payable_amount: contact.unused_credits_payable_amount,
          unused_credits_payable_amount_bcy: contact.unused_credits_payable_amount_bcy,
          first_name: contact.first_name,
          last_name: contact.last_name,
          email: contact.email,
          phone: contact.phone,
          mobile: contact.mobile,
          portal_status: contact.portal_status,
          portal_status_formatted: contact.portal_status_formatted,
          created_time: contact.created_time,
          created_time_formatted: contact.created_time_formatted,
          last_modified_time: contact.last_modified_time,
          last_modified_time_formatted: contact.last_modified_time_formatted,
          gst_no: contact.gst_no,
          gst_treatment: contact.gst_treatment,
          place_of_contact: contact.place_of_contact,
          place_of_contact_formatted: contact.place_of_contact_formatted,
          has_attachment: contact.has_attachment,
          pan_no: contact.pan_no,
          custom_fields: contact.custom_fields,
          custom_field_hash: contact.custom_field_hash,
          contactperson_custom_fields: contact.contactperson_custom_fields,
          tags: contact.tags,
          registration_details: contact.registration_details
        })
      )
    );

    synced += batch.length;

    console.log(`Synced ${synced}/${contacts.length}`);
  }

console.timeEnd("Customer Sync");

  return {
    total: contacts.length,
    synced
  };
};

// exports.syncCustomers = async () => {
//   const contacts = await zohoService.getContacts();

//   let synced = 0;

//   for (const contact of contacts) {
    
//     await Customer.upsert({
//       contact_id: contact.contact_id,
//       contact_name: contact.contact_name,
//       customer_name: contact.customer_name,
//       vendor_name: contact.vendor_name,
//       company_name: contact.company_name,
//       website: contact.website,
//       language_code: contact.language_code,
//       language_code_formatted: contact.language_code_formatted,
//       contact_type: contact.contact_type,
//       contact_type_formatted: contact.contact_type_formatted,
//       status: contact.status,
//       customer_sub_type: contact.customer_sub_type,
//       source: contact.source,
//       is_linked_with_zohocrm: contact.is_linked_with_zohocrm,
//       payment_terms: contact.payment_terms,
//       payment_terms_id: contact.payment_terms_id,
//       payment_terms_label: contact.payment_terms_label,
//       currency_id: contact.currency_id,
//       currency_code: contact.currency_code,
//       twitter: contact.twitter,
//       facebook: contact.facebook,
//       outstanding_receivable_amount: contact.outstanding_receivable_amount,
//       outstanding_receivable_amount_bcy: contact.outstanding_receivable_amount_bcy,
//       outstanding_payable_amount: contact.outstanding_payable_amount,
//       outstanding_payable_amount_bcy: contact.outstanding_payable_amount_bcy,
//       unused_credits_receivable_amount: contact.unused_credits_receivable_amount,
//       unused_credits_receivable_amount_bcy: contact.unused_credits_receivable_amount_bcy,
//       unused_credits_payable_amount: contact.unused_credits_payable_amount,
//       unused_credits_payable_amount_bcy: contact.unused_credits_payable_amount_bcy,
//       first_name: contact.first_name,
//       last_name: contact.last_name,
//       email: contact.email,
//       phone: contact.phone,
//       mobile: contact.mobile,
//       portal_status: contact.portal_status,
//       portal_status_formatted: contact.portal_status_formatted,
//       created_time: contact.created_time,
//       created_time_formatted: contact.created_time_formatted,
//       last_modified_time: contact.last_modified_time,
//       last_modified_time_formatted: contact.last_modified_time_formatted,
//       gst_no: contact.gst_no,
//       gst_treatment: contact.gst_treatment,
//       place_of_contact: contact.place_of_contact,
//       place_of_contact_formatted: contact.place_of_contact_formatted,
//       has_attachment: contact.has_attachment,
//       pan_no: contact.pan_no,
//       custom_fields: contact.custom_fields,
//       custom_field_hash: contact.custom_field_hash,
//       contactperson_custom_fields: contact.contactperson_custom_fields,
//       tags: contact.tags,
//       registration_details: contact.registration_details
//     });

//     synced++;
//   }

//   return {
//     total: contacts.length,
//     synced
//   };
// };