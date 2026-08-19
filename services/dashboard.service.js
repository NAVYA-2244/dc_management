const { Op } = require("sequelize");
const db = require("../models");
const zohoService = require("./zoho.service");

const DeliveryChallan = db.DeliveryChallan;

const DeliveryChallanDetails = db.DeliveryChallanDetails;

const DeliveryChallanLineItem = db.DeliveryChallanLineItem;

const DeliveryChallanContact = db.DeliveryChallanContact;

const DeliveryChallanTransaction = db.DeliveryChallanTransaction;
const Customer = db.Customer; // ? ADD THIS
const CustomerDetails = db.CustomerDetails; // ? ADD THIS

const DeliveryChallanEwaybill = db.DeliveryChallanEwaybill;

exports.getDashboard = async (page, limit, search) => {
  try {
    const challans = await zohoService.getAllDeliveryChallans(
      page,
      limit,
      search,
    );

    for (const dc of challans) {
      let deliveryChallan = await DeliveryChallan.findOne({
        where: { deliverychallan_id: dc.deliverychallan_id },
      });
      let deliveryDetail = await DeliveryChallanDetails.findOne({
        where: {
          deliverychallan_id: dc.deliverychallan_id,
        },
      });

      const detailPayload = {
        deliverychallan_id: dc.deliverychallan_id,

        documents: dc.documents,
        line_items: dc.line_items,
        billing_address: dc.billing_address,
        shipping_address: dc.shipping_address,
        ewaybills: dc.ewaybills,
        taxes: dc.taxes,
        custom_fields: dc.custom_fields,
        custom_field_hash: dc.custom_field_hash,
        registration_details: dc.registration_details,
        contact_persons: dc.contact_persons,
        tags: dc.tags,

        created_time: dc.created_time,
        last_modified_time: dc.last_modified_time,

        created_by_id: dc.created_by_id,

        template_id: dc.template_id,
        template_name: dc.template_name,
        page_width: dc.page_width,
        page_height: dc.page_height,
        orientation: dc.orientation,
        template_type: dc.template_type,

        attachment_name: dc.attachment_name,
        zoho_response: dc,
      };

      if (!deliveryDetail) {
        await DeliveryChallanDetails.create(detailPayload);
      } else {
        await deliveryDetail.update(detailPayload);
      }
      let scanStatus = "Pending";
      if (deliveryChallan) {
        scanStatus = deliveryChallan.status;
      }

      // ---- Customer backfill (contact_id is the correct column) ----
      let customer = await Customer.findOne({
        where: { contact_id: dc.customer_id },
      });

      let customerDetail = await CustomerDetails.findOne({
        where: { contact_id: dc.customer_id },
      });

      if (dc.customer_id && (!customer || !customerDetail)) {
        try {
          const response = await zohoService.getContactById(dc.customer_id);
          const contact = response.contact;

          if (contact) {
            if (!customer) {
              customer = await Customer.create({
                contact_id: contact.contact_id,
                contact_name: contact.contact_name,
                customer_name: contact.customer_name,
                vendor_name: contact.vendor_name,
                company_name: contact.company_name,
                website: contact.website,
                contact_type: contact.contact_type,
                customer_sub_type: contact.customer_sub_type,
                status: contact.status,
                gst_no: contact.gst_no,
                gst_treatment: contact.gst_treatment,
                pan_no: contact.pan_no,
                currency_code: contact.currency_code,
                currency_id: contact.currency_id,
                currency_symbol: contact.currency_symbol,
                first_name: contact.first_name,
                last_name: contact.last_name,
                phone: contact.phone,
                mobile: contact.mobile,
                email: contact.email,
                designation: contact.designation,
                department: contact.department,
                photo_url: contact.photo_url,
                branch_id: contact.branch_id,
                branch_name: contact.branch_name,
                location_id: contact.location_id,
                location_name: contact.location_name,
                place_of_contact: contact.place_of_contact,
                has_attachment: contact.has_attachment,
                custom_fields: contact.custom_fields,
                custom_field_hash: contact.custom_field_hash,
                tags: contact.tags,
                registration_details: contact.registration_details,
                billing_address: contact.billing_address,
                shipping_address: contact.shipping_address,
                contact_persons: contact.contact_persons,
                contact_tax_information: contact.contact_tax_information,
                default_templates: contact.default_templates,
                customer_currency_summaries:
                  contact.customer_currency_summaries,
                additional_information: contact.additional_information,
                created_time: contact.created_time,
                last_modified_time: contact.last_modified_time,
              });
            }

            if (!customerDetail) {
              customerDetail = await CustomerDetails.create({
                contact_id: contact.contact_id,
                is_associated_to_branch: contact.is_associated_to_branch,
                designation: contact.designation,
                department: contact.department,
                photo_url: contact.photo_url,
                primary_contact_id:
                  contact.contact_persons?.[0]?.contact_person_id || null,
                owner_id: contact.owner_id,
                owner_name: contact.owner_name,
                currency_symbol: contact.currency_symbol,
                exchange_rate: contact.exchange_rate,
                branch_id: contact.branch_id,
                branch_name: contact.branch_name,
                location_id: contact.location_id,
                location_name: contact.location_name,
                opening_balance_amount: contact.opening_balance_amount,
                unused_retainer_payments: contact.unused_retainer_payments,
                payment_reminder_enabled: contact.payment_reminder_enabled,
                is_sms_enabled: contact.is_sms_enabled,
                is_consent_agreed: contact.is_consent_agreed,
                tax_id: contact.tax_id,
                tax_name: contact.tax_name,
                tax_percentage: contact.tax_percentage,
                trader_name: contact.trader_name,
                legal_name: contact.legal_name,
                vat_reg_no: contact.vat_reg_no,
                tax_reg_no: contact.tax_reg_no,
                udyam_reg_no: contact.udyam_reg_no,
                contact_tax_information: contact.contact_tax_information,
                billing_address: contact.billing_address,
                shipping_address: contact.shipping_address,
                contact_persons: contact.contact_persons,
                default_templates: contact.default_templates,
                customer_currency_summaries:
                  contact.customer_currency_summaries,
                additional_information: contact.additional_information,
                registration_details: contact.registration_details,
              });
            }
          }
        } catch (err) {
          console.log(
            "Customer Sync Failed",
            dc.customer_id,
            err.response?.data || err.message,
          );
        }
      }

      // ---- Contact fallback values ----
      let contactName =
        dc.cf_contact_name ||
        customer?.contact_name ||
        customer?.customer_name ||
        null;
      let contactDesignation =
        dc.cf_contact_designation || customer?.designation || null;
      let contactMobile =
        dc.cf_contact_mobile_number || customer?.mobile || null;

      const challanPayload = {
        deliverychallan_id: dc.deliverychallan_id,
        zcrm_potential_id: dc.zcrm_potential_id,
        zcrm_potential_name: dc.zcrm_potential_name,

        customer_id: dc.customer_id,
        customer_name: customer?.customer_name || dc.customer_name,
        company_name: customer?.company_name || dc.company_name,

        status: scanStatus,
        challan_status: dc.challan_status,

        deliverychallan_number: dc.deliverychallan_number,
        reference_number: dc.reference_number,
        date: dc.date,

        currency_id: dc.currency_id,
        currency_code: dc.currency_code,

        total: dc.total,
        bcy_total: dc.bcy_total,

        created_time: dc.created_time,
        last_modified_time: dc.last_modified_time,

        has_attachment: dc.has_attachment,
        tags: dc.tags,

        cf_po_number: dc.cf_po_number,
        cf_po_number_unformatted: dc.cf_po_number_unformatted,
        cf_po_date: dc.cf_po_date,
        cf_po_date_unformatted: dc.cf_po_date_unformatted,

        cf_contact_name: contactName,
        cf_contact_name_unformatted: contactName,
        cf_contact_designation: contactDesignation,
        cf_contact_designation_unformatted: contactDesignation,
        cf_contact_mobile_number: contactMobile,
        cf_contact_mobile_number_unformatted: contactMobile,

        branch_id: dc.branch_id,
        location_id: dc.location_id,
        location_name: dc.location_name,

        registration_details: dc.registration_details,
        line_items: dc.line_items,
        documents: dc.documents,
        billing_address: dc.billing_address,
        shipping_address: dc.shipping_address,
        taxes: dc.taxes,
        custom_fields: dc.custom_fields,
        custom_field_hash: dc.custom_field_hash,

        zoho_response: dc,
      };

      if (!deliveryChallan) {
        challanPayload.status = "Pending";
        deliveryChallan = await DeliveryChallan.create(challanPayload);
      } else {
        challanPayload.status = deliveryChallan.status;
        await deliveryChallan.update(challanPayload);
      }
    }

    // ==============================
    // Search + Fetch (with Customer JOIN)
    // ==============================
    let where = {};

    if (search) {
      const term = `%${search}%`;

      // matching customer_ids fetch first
      const matchedCustomers = await Customer.findAll({
        where: {
          [Op.or]: [
            { contact_name: { [Op.like]: term } },
            { company_name: { [Op.like]: term } },
            { mobile: { [Op.like]: term } },
            { email: { [Op.like]: term } },
          ],
        },
        attributes: ["contact_id"],
        raw: true,
      });

      const matchedCustomerIds = matchedCustomers.map((c) => c.contact_id);

      where[Op.or] = [
        { deliverychallan_number: { [Op.like]: term } },
        { cf_po_number: { [Op.like]: term } },
        { reference_number: { [Op.like]: term } },
        ...(matchedCustomerIds.length
          ? [{ customer_id: { [Op.in]: matchedCustomerIds } }]
          : []),
      ];
    }

    const records = await DeliveryChallan.findAll({
      where,
      include: [
        {
          model: Customer,
          attributes: [
            "contact_name",
            "customer_name",
            "company_name",
            "mobile",
            "email",
            "designation",
          ],
          include: [{ model: CustomerDetails }],
        },
      ],
      order: [["date", "DESC"]],
    });

    const response = records.map((dc) => ({
      id: dc.id,
      deliverychallan_id: dc.deliverychallan_id,
      deliverychallan_number: dc.deliverychallan_number,

      challan_status: dc.challan_status,
      status: dc.status,

      customer_name: dc.Customer?.customer_name || dc.customer_name,

      po_number: dc.cf_po_number,
      po_date: dc.cf_po_date,

      date: dc.date,
      total: dc.total,
      reference_number: dc.reference_number,
      contact_name: dc.Customer?.contact_name || dc.cf_contact_name,
      contact_mobile_number: dc.Customer?.mobile || dc.cf_contact_mobile_number,
      billing_address_full:
        dc.Customer?.CustomerDetails?.billing_address || dc.billing_address,
      shipping_address_full:
        dc.Customer?.CustomerDetails?.shipping_address || dc.shipping_address,

      location_name: dc.location_name,

      zcrm_potential_id: dc.zcrm_potential_id,
      zcrm_potential_name: dc.zcrm_potential_name,

      customer_id: dc.customer_id,
      company_name: dc.Customer?.company_name || dc.company_name,

      currency_id: dc.currency_id,
      currency_code: dc.currency_code,

      bcy_total: dc.bcy_total,

      created_time: dc.created_time,
      last_modified_time: dc.last_modified_time,

      has_attachment: dc.has_attachment,
      tags: dc.tags,

      cf_po_number: dc.cf_po_number,
      cf_po_number_unformatted: dc.cf_po_number_unformatted,
      cf_po_date: dc.cf_po_date,
      cf_po_date_unformatted: dc.cf_po_date_unformatted,

      cf_contact_name: dc.cf_contact_name,
      cf_contact_name_unformatted: dc.cf_contact_name_unformatted,
      cf_contact_designation: dc.cf_contact_designation,

      cf_contact_designation_unformatted: dc.cf_contact_designation_unformatted,
      cf_contact_mobile_number: dc.cf_contact_mobile_number,
      cf_contact_mobile_number_unformatted:
        dc.cf_contact_mobile_number_unformatted,

      branch_id: dc.branch_id,
      location_id: dc.location_id,

      registration_details: dc.registration_details,
      line_items: dc.line_items,
      documents: dc.documents,
      billing_address: dc.billing_address,
      shipping_address: dc.shipping_address,
      taxes: dc.taxes,
      custom_fields: dc.custom_fields,
      custom_field_hash: dc.custom_field_hash,

      created_at: dc.created_at,
      updated_at: dc.updated_at,
    }));

    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

exports.getDeliveryChallanDetails = async (deliverychallanId) => {
  try {
    if (!deliverychallanId) {
      const err = new Error("deliverychallan_id is required");
      err.statusCode = 400;
      throw err;
    }

    // Dashboard table lo check
    const deliveryChallan = await DeliveryChallan.findOne({
      where: {
        deliverychallan_id: deliverychallanId,
      },
    });

    if (!deliveryChallan) {
      const err = new Error("Delivery Challan not found");
      err.statusCode = 404;
      throw err;
    }

    // Zoho API
    const zohoResponse =
      await zohoService.getDeliveryChallanById(deliverychallanId);

    const dc = zohoResponse.deliverychallan || zohoResponse;

    console.log(
      "DC EWAYBILLSssssssssssssssssssssssssssssssssssssssssssssss =>",
      dc.ewaybills,
    );
    if (!dc || !dc.deliverychallan_id) {
      const err = new Error("Delivery Challan not found in Zoho");
      err.statusCode = 404;
      throw err;
    }

    // Details table lo search
    let deliveryChallanDetails = await DeliveryChallanDetails.findOne({
      where: {
        deliverychallan_id: dc.deliverychallan_id,
      },
    });

    // ================= PREPARE CONTACTS =================
    // NOTE: Zoho puts cf_contact_name / cf_contact_designation /
    // cf_contact_mobile_number / cf_supplier_contact_* INSIDE
    // dc.custom_field_hash, NOT on dc directly. Reading dc.cf_contact_name
    // (top-level) was always undefined, so nothing ever got prepared.
    let preparedContacts = [];

    const cfHash = dc.custom_field_hash || {};

    // Customer-side contact (from cf_contact_* custom fields)
    if (
      cfHash.cf_contact_name ||
      cfHash.cf_contact_designation ||
      cfHash.cf_contact_mobile_number
    ) {
      preparedContacts.push({
        contact_name: cfHash.cf_contact_name || null,
        designation: cfHash.cf_contact_designation || null,
        mobile: cfHash.cf_contact_mobile_number || null,
        email: null,
        type: "customer",
      });
    }

    // Supplier-side contact (from cf_supplier_contact_* custom fields)
    if (
      cfHash.cf_supplier_contact_person_name ||
      cfHash.cf_supplier_contact_designation ||
      cfHash.cf_supplier_contact_person_number
    ) {
      preparedContacts.push({
        contact_name: cfHash.cf_supplier_contact_person_name || null,
        designation: cfHash.cf_supplier_contact_designation || null,
        mobile: cfHash.cf_supplier_contact_person_number || null,
        email: null,
        type: "vendor",
      });
    }

    // Multiple contacts from Zoho (contact_persons array on the
    // delivery challan itself — separate from the custom fields above)
    if (Array.isArray(dc.contact_persons)) {
      preparedContacts.push(
        ...dc.contact_persons.map((c) => ({
          contact_name: c.contact_name || c.name,
          designation: c.designation,
          mobile: c.mobile || c.phone || c.mobile_number,
          email: c.email,
          type: "customer",
        })),
      );
    }

    const challanPayload = {
      deliverychallan_id: dc.deliverychallan_id,

      deliverychallan_number: dc.deliverychallan_number,

      customer_id: dc.customer_id,
      customer_name: dc.customer_name,
      company_name: dc.company_name,

      challan_status: dc.challan_status,

      reference_number: dc.reference_number,

      date: dc.date,

      currency_id: dc.currency_id,
      currency_code: dc.currency_code,

      total: dc.total,
      bcy_total: dc.bcy_total,

      created_time: dc.created_time,
      last_modified_time: dc.last_modified_time,

      has_attachment: dc.has_attachment,

      tags: dc.tags,

      cf_po_number: dc.cf_po_number,
      cf_po_date: dc.cf_po_date,

      // multi-contact JSON snapshot on delivery_challan_details
      customer_contacts: preparedContacts,

      branch_id: dc.branch_id,

      location_id: dc.location_id,
      location_name: dc.location_name,

      registration_details: dc.registration_details,

      documents: dc.documents,
      billing_address: dc.billing_address,
      shipping_address: dc.shipping_address,
      taxes: dc.taxes,

      custom_fields: dc.custom_fields,
      custom_field_hash: dc.custom_field_hash,

      zoho_response: dc,

      sync_status: "success",
    };

    // Details save/update
    if (!deliveryChallanDetails) {
      deliveryChallanDetails =
        await DeliveryChallanDetails.create(challanPayload);
    } else {
      await deliveryChallanDetails.update(challanPayload);
    }

    // Normalized contacts table: wipe old rows, re-insert current ones
    await DeliveryChallanContact.destroy({
      where: {
        deliverychallan_id: dc.deliverychallan_id,
      },
    });

    for (let i = 0; i < preparedContacts.length; i++) {
      await DeliveryChallanContact.create({
        deliverychallan_id: dc.deliverychallan_id,
        contact_type: preparedContacts[i].type || "customer",
        contact_name: preparedContacts[i].contact_name,
        designation: preparedContacts[i].designation,
        mobile: preparedContacts[i].mobile,
        email: preparedContacts[i].email,
        sequence: i + 1,
      });
    }

    // ---------------- Save Line Items ----------------

    if (dc.line_items && dc.line_items.length > 0) {
      for (const item of dc.line_items) {
        let existingLineItem = await DeliveryChallanLineItem.findOne({
          where: {
            line_item_id: item.line_item_id,
          },
        });

        const lineItemPayload = {
          deliverychallan_id: dc.deliverychallan_id,

          line_item_id: item.line_item_id,

          item_id: item.item_id,

          item_name: item.name,

          description: item.description,

          quantity: item.quantity,

          unit: item.unit,

          rate: item.rate,

          bcy_rate: item.bcy_rate,

          tax_id: item.tax_id,

          tax_name: item.tax_name,

          tax_percentage: item.tax_percentage,

          hsn_or_sac: item.hsn_or_sac,

          location_id: item.location_id,

          location_name: item.location_name,

          scanned_qty: existingLineItem ? existingLineItem.scanned_qty : 0,

          scan_required: existingLineItem
            ? existingLineItem.scan_required
            : true,

          status: existingLineItem ? existingLineItem.status : "Pending",
        };

        if (!existingLineItem) {
          await DeliveryChallanLineItem.create(lineItemPayload);
        } else {
          await existingLineItem.update(lineItemPayload);
        }
      }
    }

    // Fetch line items
    const lineItems = await DeliveryChallanLineItem.findAll({
      where: {
        deliverychallan_id: dc.deliverychallan_id,
      },
      raw: true,
    });

    // ---------------- Save Eway Bills ----------------

    if (
      dc.ewaybills &&
      Array.isArray(dc.ewaybills) &&
      dc.ewaybills.length > 0
    ) {
      console.log("Inside Ewaybill Looppppppppppppppppppppppppppppppp");
      for (const eway of dc.ewaybills) {
        let existingEway = await DeliveryChallanEwaybill.findOne({
          where: {
            deliverychallan_id: dc.deliverychallan_id,
            ewaybill_id: eway.ewaybill_id,
          },
        });

        const ewayPayload = {
          deliverychallan_id: dc.deliverychallan_id,
          ewaybill_id: eway.ewaybill_id || null,
          eway_bill_no: eway.ewaybill_number || null,
          ewaybill_status: eway.ewaybill_status || null,
          ewaybill_status_formatted: eway.ewaybill_status_formatted || null,
          ewaybill_date: eway.ewaybill_date || null,
          ewaybill_expiry_date: eway.ewaybill_expiry_date || null,
          sub_supply_type: eway.sub_supply_type || null,
          transportation_mode: eway.transportation_mode || null,
          transporter_name: eway.transporter_name || null,
          transporter_id: eway.transporter_id || null,
          transporter_registration_id: eway.transporter_registration_id || null,
        };
        console.log(
          "EWAY PAYLOADDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD =>",
          ewayPayload,
        );

        if (!existingEway) {
          console.log("Creating Eway Bill");
          await DeliveryChallanEwaybill.create(ewayPayload);
        } else {
          console.log("Updating Eway Bill");
          await existingEway.update(ewayPayload);
        }
      }
    }

    const mergedLineItems = dc.line_items.map((item) => {
      const dbItem = lineItems.find(
        (x) => x.line_item_id === item.line_item_id,
      );

      return {
        ...item,

        scanned_qty: dbItem ? dbItem.scanned_qty : 0,
        scan_required: dbItem ? dbItem.scan_required : true,
        status: dbItem ? dbItem.status : "Pending",
      };
    });

    const saved = deliveryChallanDetails.toJSON();

    saved.scan_status = deliveryChallan ? deliveryChallan.status : "Pending";

    const ewaybills = await DeliveryChallanEwaybill.findAll({
      where: { deliverychallan_id: dc.deliverychallan_id },
      raw: true,
    });

    saved.ewaybills = ewaybills;

    // Fresh contacts read-back from the normalized table for the response
    const contacts = await DeliveryChallanContact.findAll({
      where: {
        deliverychallan_id: dc.deliverychallan_id,
      },
      order: [["sequence", "ASC"]],
      raw: true,
    });

    saved.contacts = contacts;

    // Full Zoho data + Local Scan data
    saved.line_items = mergedLineItems;

    // Optional
    delete saved.zoho_response.line_items;

    return {
      success: true,
      data: saved,
    };
  } catch (error) {
    console.log("ERROR =>", error);

    console.log("ERROR RESPONSE =>", error.response?.data);

    console.log("ERROR PARENT =>", error.parent);

    console.log("ERROR ERRORS =>", error.errors);

    throw error;
  }
};

// exports.getDeliveryChallanDetails = async (deliverychallanId) => {

//     try {

//         if (!deliverychallanId) {
//             const err = new Error("deliverychallan_id is required");
//             err.statusCode = 400;
//             throw err;
//         }

//         // Dashboard table lo check
//         const deliveryChallan = await DeliveryChallan.findOne({
//             where: {
//                 deliverychallan_id: deliverychallanId
//             }
//         });

//         if (!deliveryChallan) {
//             const err = new Error("Delivery Challan not found");
//             err.statusCode = 404;
//             throw err;
//         }

//         // Zoho API
//         const zohoResponse = await zohoService.getDeliveryChallanById(deliverychallanId);

//         const dc = zohoResponse.deliverychallan || zohoResponse;

//         console.log("DC EWAYBILLSssssssssssssssssssssssssssssssssssssssssssssss =>", dc.ewaybills);
//         if (!dc || !dc.deliverychallan_id) {
//             const err = new Error("Delivery Challan not found in Zoho");
//             err.statusCode = 404;
//             throw err;
//         }

//         // Details table lo search
//         let deliveryChallanDetails = await DeliveryChallanDetails.findOne({
//             where: {
//                 deliverychallan_id: dc.deliverychallan_id
//             }
//         });

//         const challanPayload = {

//             deliverychallan_id: dc.deliverychallan_id,

//             deliverychallan_number: dc.deliverychallan_number,

//             customer_id: dc.customer_id,
//             customer_name: dc.customer_name,
//             company_name: dc.company_name,

//             // status: dc.status,
//             // challan_status: dc.challan_status,

//                 // Local Scan Status
//     // status: scanStatus,

//     // Zoho Status
//     challan_status: dc.challan_status,

//             reference_number: dc.reference_number,

//             date: dc.date,

//             currency_id: dc.currency_id,
//             currency_code: dc.currency_code,

//             total: dc.total,
//             bcy_total: dc.bcy_total,

//             created_time: dc.created_time,
//             last_modified_time: dc.last_modified_time,

//             has_attachment: dc.has_attachment,

//             tags: dc.tags,

//             cf_po_number: dc.cf_po_number,
//             cf_po_date: dc.cf_po_date,

//             cf_contact_name: dc.cf_contact_name,
//             cf_contact_designation: dc.cf_contact_designation,
//             cf_contact_mobile_number: dc.cf_contact_mobile_number,

//             branch_id: dc.branch_id,

//             location_id: dc.location_id,
//             location_name: dc.location_name,

//             registration_details: dc.registration_details,

//             // line_items: dc.line_items,

//             documents: dc.documents,
//             billing_address: dc.billing_address,
//             shipping_address: dc.shipping_address,
//             taxes: dc.taxes,

//             custom_fields: dc.custom_fields,
//             custom_field_hash: dc.custom_field_hash,

//             zoho_response: dc,

//             sync_status: "success"
//         };

//         // Details save/update
//         if (!deliveryChallanDetails) {

//             deliveryChallanDetails = await DeliveryChallanDetails.create(challanPayload);

//         } else {

//             await deliveryChallanDetails.update(challanPayload);

//         }

//         // ---------------- Save Line Items ----------------

//         if (dc.line_items && dc.line_items.length > 0) {

//             for (const item of dc.line_items) {

//                 let existingLineItem = await DeliveryChallanLineItem.findOne({
//                     where: {
//                         line_item_id: item.line_item_id
//                     }
//                 });

//                 const lineItemPayload = {

//                     deliverychallan_id: dc.deliverychallan_id,

//                     line_item_id: item.line_item_id,

//                     item_id: item.item_id,

//                     item_name: item.name,

//                     description: item.description,

//                     quantity: item.quantity,

//                     unit: item.unit,

//                     rate: item.rate,

//                     bcy_rate: item.bcy_rate,

//                     tax_id: item.tax_id,

//                     tax_name: item.tax_name,

//                     tax_percentage: item.tax_percentage,

//                     hsn_or_sac: item.hsn_or_sac,

//                     location_id: item.location_id,

//                     location_name: item.location_name,

//                     scanned_qty: existingLineItem ? existingLineItem.scanned_qty : 0,

//                     scan_required: existingLineItem ? existingLineItem.scan_required : true,

//                     status: existingLineItem ? existingLineItem.status : "Pending"

//                 };

//                 if (!existingLineItem) {

//                     await DeliveryChallanLineItem.create(lineItemPayload);

//                 } else {

//                     await existingLineItem.update(lineItemPayload);

//                 }

//             }

//         }
// // Fetch line items
// const lineItems = await DeliveryChallanLineItem.findAll({
//     where: {
//         deliverychallan_id: dc.deliverychallan_id
//     },
//     raw: true
// });
//     // ---------------- Save Eway Bills ----------------

// if (dc.ewaybills && Array.isArray(dc.ewaybills) && dc.ewaybills.length > 0) {
//  console.log("Inside Ewaybill Looppppppppppppppppppppppppppppppp");
//     for (const eway of dc.ewaybills) {

//         let existingEway = await DeliveryChallanEwaybill.findOne({
//             where: {
//                 deliverychallan_id: dc.deliverychallan_id,
//                 ewaybill_id: eway.ewaybill_id
//             }
//         });

//         const ewayPayload = {
//             deliverychallan_id: dc.deliverychallan_id,
//             ewaybill_id: eway.ewaybill_id || null,
//             eway_bill_no: eway.ewaybill_number || null,
//             ewaybill_status: eway.ewaybill_status || null,
//             ewaybill_status_formatted: eway.ewaybill_status_formatted || null,
//             ewaybill_date: eway.ewaybill_date || null,
//             ewaybill_expiry_date: eway.ewaybill_expiry_date || null,
//             sub_supply_type: eway.sub_supply_type || null,
//             transportation_mode: eway.transportation_mode || null,
//             transporter_name: eway.transporter_name || null,
//             transporter_id: eway.transporter_id || null,
//             transporter_registration_id: eway.transporter_registration_id || null,
//         };
//         console.log("EWAY PAYLOADDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD =>", ewayPayload);

//         if (!existingEway) {
//               console.log("Creating Eway Bill");
//             await DeliveryChallanEwaybill.create(ewayPayload);
//         } else {
//             console.log("Updating Eway Bill");
//             await existingEway.update(ewayPayload);
//         }
//     }
// }

// const mergedLineItems = dc.line_items.map(item => {

//     const dbItem = lineItems.find(
//         x => x.line_item_id === item.line_item_id
//     );

//     return {
//         ...item,

//         scanned_qty: dbItem ? dbItem.scanned_qty : 0,
//         scan_required: dbItem ? dbItem.scan_required : true,
//         status: dbItem ? dbItem.status : "Pending"
//     };

// });

// const saved = deliveryChallanDetails.toJSON();

// saved.scan_status = deliveryChallan
//     ? deliveryChallan.status
//     : "Pending";

//     const ewaybills = await DeliveryChallanEwaybill.findAll({
//     where: { deliverychallan_id: dc.deliverychallan_id },
//     raw: true,
// });

// saved.ewaybills = ewaybills;

// // Full Zoho data + Local Scan data
// saved.line_items = mergedLineItems;

// // Optional
// delete saved.zoho_response.line_items;

// return {
//     success: true,
//     data: saved
// };
//         // ---------------- Response ----------------

//     } catch (error) {

//          console.log("ERROR =>", error);

//     console.log("ERROR RESPONSE =>", error.response?.data);

//     console.log("ERROR PARENT =>", error.parent);

//     console.log("ERROR ERRORS =>", error.errors);
//         throw error;

//     }

// };

// exports.closeDeliveryChallan = async (deliverychallan_id, user) => {

//     // Check Delivery Challan
//     const challan = await DeliveryChallan.findOne({
//         where: {
//             deliverychallan_id
//         }
//     });

//     if (!challan) {
//         throw new Error("Delivery Challan not found");
//     }

//     // Check pending items
//     // const pending = await DeliveryChallanLineItem.count({
//     //     where: {
//     //         deliverychallan_id,
//     //         status: {
//     //             [Op.ne]: "Completed"
//     //         }
//     //     }
//     // });

//     // if (pending > 0) {
//     //     throw new Error("Some items are still pending");
//     // }

//     // Save old status before update
// const oldStatus = challan.status;

// // Update DC Status
// await challan.update({
//     status: "Closed"
// });
//     // Update DC Status
//     // await challan.update({
//     //     status: "Closed"
//     // });

//     // Insert Transaction
// //     await DeliveryChallanTransaction.create({

// //         deliverychallan_id,

// //         transaction_type: "CLOSE_DC",

// //         old_status: "In Progress",

// //         new_status: "Closed",

// //         remarks: "Delivery Challan Closed",

// //         performed_by: user.id,
// //  performed_by_name: user.name
// //     });

// await DeliveryChallanTransaction.create({
//     deliverychallan_id,

//     transaction_type: "CLOSE_DC",

//     old_status: oldStatus,

//     new_status: "Closed",

//     remarks: "Delivery Challan Closed",

//     performed_by: user.id,

//     performed_by_name: user.name
// });

//     // +````````````````````
//     return {
//         message: "Delivery Challan Closed Successfully"
//     };

// };
