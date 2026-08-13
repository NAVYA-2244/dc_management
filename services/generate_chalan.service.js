const { Op } = require("sequelize");
const db = require("../models");
const puppeteer = require("puppeteer");
const zohoService = require("./zoho.service");

const DeliveryChallan = db.DeliveryChallan;

const DeliveryChallanDetails = db.DeliveryChallanDetails;

const DeliveryChallanLineItem = db.DeliveryChallanLineItem;

const DeliveryChallanTransaction = db.DeliveryChallanTransaction;
const DeliveryChallanSerialNumber = db.DeliveryChallanSerialNumber;
const Organizations = db.Organizations;

const fs = require("fs");
const path = require("path");

const logo = fs.readFileSync(path.join(__dirname, "../uploads/image.png"));

const logoBase64 = logo.toString("base64");

exports.generateChallan = async (deliverychallan_id, user) => {
  console.log("User:", user);
  const challan = await DeliveryChallan.findOne({
    where: { deliverychallan_id },
  });


console.log("Delivery Challan ID:", deliverychallan_id);
console.log("PO Number:", challan.cf_po_number);
console.log("Challan:", challan.dataValues);


  if (!challan) {
    throw new Error("Delivery Challan not found");
  }

  
  const details = await DeliveryChallanDetails.findOne({
    where: { deliverychallan_id },
  });

  const lineItems = await DeliveryChallanLineItem.findAll({
    where: { deliverychallan_id },
  });

  const totalItems = lineItems.length;

  const totalQuantity = lineItems.reduce(
    (sum, item) => sum + Number(item.quantity),
    0,
  );

  const scannedQuantity = lineItems.reduce(
    (sum, item) => sum + Number(item.scanned_qty),
    0,
  );

  await DeliveryChallanTransaction.create({
    deliverychallan_id,

    transaction_type: "GENERATE_CHALLAN",

    old_status: challan.status,

    new_status: challan.status,

    remarks: "Delivery Challan Generated",

    performed_by: user.name,
  });

  return {
    message: "Delivery Challan Generated Successfully",

    deliverychallan_number: challan.deliverychallan_number,

    customer_name: details.customer_name,

    //po_number: details.cf_po_number,

po_number: challan.cf_po_number,   

    dc_date: details.date,

    summary: {
      total_items: totalItems,

      total_quantity: totalQuantity,

      scanned_quantity: scannedQuantity,
    },
  };
};

exports.generatePdf = async (deliverychallan_id) => {
  const challan = await DeliveryChallan.findOne({
    where: {
      deliverychallan_id,
    },
  });

  if (!challan) {
    throw new Error("Delivery Challan not found");
  }

  const items = await DeliveryChallanLineItem.findAll({
    where: {
      deliverychallan_id,
    },
  });

  const serialNumbers = await DeliveryChallanSerialNumber.findAll({
    where: {
      deliverychallan_id,
    },
  });

  return {
    company_name: "Entro Labs IT Solutions Pvt. Ltd.",

    customer_name: challan.customer_name,

    customer_address: challan.company_name,

    dc_number: challan.deliverychallan_number,

    dc_date: challan.date,

    po_number: challan.cf_po_number,

    po_date: challan.cf_po_date,

    contact_person: challan.cf_contact_name,

    contact_number: challan.cf_contact_mobile_number,

    products: items.map((item) => ({
      item_name: item.item_name,

      quantity: item.quantity,

      warranty: "-",

      serial_numbers: serialNumbers
        .filter((s) => s.line_item_id === item.line_item_id)
        .map((s) => s.serial_number),
    })),
  };
};

exports.downloadPdf = async (deliverychallan_id, res) => {
  const challan = await DeliveryChallan.findOne({
    where: {
      deliverychallan_id,
    },
    raw: true,
  });

  if (!challan) {
    throw new Error("Delivery Challan not found");
  }

  // Address lives in delivery_challan_details.shipping_address (JSON: { address: "..." })
  const challanDetails = await DeliveryChallanDetails.findOne({
    where: { deliverychallan_id },
    raw: true,
  });

  // let customerAddress = "";
  // if (challanDetails && challanDetails.shipping_address) {
  //   try {
  //     const parsedAddress =
  //       typeof challanDetails.shipping_address === "string"
  //         ? JSON.parse(challanDetails.shipping_address)
  //         : challanDetails.shipping_address;
  //     customerAddress = (parsedAddress && parsedAddress.address) || "";
  //   } catch (e) {
  //     customerAddress = "";
  //   }
  // }
  let customerAddress = "";
  if (challanDetails && challanDetails.shipping_address) {
    try {
      const a =
        typeof challanDetails.shipping_address === "string"
          ? JSON.parse(challanDetails.shipping_address)
          : challanDetails.shipping_address;

      // Zoho address object splits street/city/state/zip/country into separate keys —
      // concatenate all of them so the full address prints (not just the street line).
      const addressParts = [
        a.address,
        a.street2,
        [a.city, a.state].filter(Boolean).join(", "),
        [a.zip, a.country].filter(Boolean).join(" "),
      ].filter((part) => part && part.trim() !== "");

      customerAddress = addressParts.join("\n");
    } catch (e) {
      customerAddress = "";
    }
  }

  // Entro Labs sign-off rep details — organizations table nunchi (only 1 row, Entro Labs own org)
  const orgInfo = await Organizations.findOne({ raw: true });
  const entroRepName = (orgInfo && orgInfo.contact_name) || "";
  const entroRepPhone = (orgInfo && orgInfo.phone) || "";

  const items = await DeliveryChallanLineItem.findAll({
    where: {
      deliverychallan_id,
    },
    raw: true,
  });

  // Get serial numbers for every item
  for (const item of items) {
    item.serials = await DeliveryChallanSerialNumber.findAll({
      where: {
        line_item_id: item.line_item_id,
      },
      raw: true,
    });
  }

  // ---------- Product table rows ----------
  let productRows = "";

  items.forEach((item, index) => {
    productRows += `
      <tr>
        <td class="center">${index + 1}</td>
        <td>${item.item_name}</td>
        <td class="center">${item.quantity}</td>
        <td class="center">-</td>
      </tr>
    `;
  });

  // ---------- Helper: build 3-column serial number table (Figma style) ----------
  const buildSerialTable = (serials) => {
    if (!serials || !serials.length) {
      return `
        <table class="serial-table" cellspacing="0" cellpadding="6">
          <tr><td colspan="6" align="center">No Serial Numbers</td></tr>
        </table>
      `;
    }

    const colCount = 3;
    const perCol = Math.ceil(serials.length / colCount);
    const columns = [];
    for (let c = 0; c < colCount; c++) {
      columns.push(serials.slice(c * perCol, c * perCol + perCol));
    }

    let rows = "";
    for (let r = 0; r < perCol; r++) {
      rows += "<tr>";
      for (let c = 0; c < colCount; c++) {
        const rowItem = columns[c][r];
        if (rowItem) {
          const serialIndex = c * perCol + r + 1;
          rows += `
            <td class="sno">${serialIndex}</td>
            <td>${rowItem.serial_number}</td>
          `;
        } else {
          rows += `<td class="sno"></td><td></td>`;
        }
      }
      rows += "</tr>";
    }

    return `
      <table class="serial-table" width="100%" cellspacing="0" cellpadding="6">
        ${rows}
      </table>
    `;
  };

  let serialSections = "";
  items.forEach((item) => {
    serialSections += `
      <div class="serial-heading">
        ITEM : ${item.item_name} &ndash; ${item.quantity} NOS SERIAL NOS
      </div>
      ${buildSerialTable(item.serials)}
    `;
  });

  // ---------- Final HTML (Figma design) ----------
  const html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  * { box-sizing: border-box; }
  body {
    font-family: Arial, Helvetica, sans-serif;
    padding: 30px;
    font-size: 12px;
    color: #1a1a1a;
  }
  table {
    width: 100%;
    border-collapse: collapse;
  }
  .center { text-align: center; }

  /* Header */
  .header-table td { border: none; padding: 0; vertical-align: top; }
  .company-name { font-size: 16px; font-weight: 700 !important; color: #000; }
  .company-meta { font-size: 11px; margin-top: 4px; line-height: 1.6; }
  .logo-block { text-align: right; }


  h1.title {
    text-align: center;
    font-weight: 800px;
    color: #003366;
    font-size: 18px;
    margin: 22px 0 20px 0;
  }

  /* DELIVERED TO block */
  .info-table {
    width: 100%;
    border-collapse: collapse;
    border: 1px solid #12305e;
    margin-bottom: 20px;
    table-layout: fixed;
  }
  .info-table td {
    border: 1px solid #12305e;
    padding: 10px 12px;
    vertical-align: top;
    word-wrap: break-word;
  }

  .info-header {
    background: #003366;
    color: #fff;
    font-weight: bold;
    font-size: 14px;
  }

  .info-value { font-size: 14px; font-weight: 700; color: #003366; }
  .info-values { font-size: 12px; margin-top: 4px; color: #1f2937; line-height: 1.5; }

  .kv-key { font-weight: bold; color: #1a1a1a; font-size: 11px; }
  .kv-val { font-size: 12px; color: #1a1a1a; }

  /* Product table */
  .product-table { margin-bottom: 25px; border: 1px solid #12305e; }
  .product-table th {
    background: #12305e;
    color: #fff;
    padding: 8px;
    font-size: 11px;
    text-align: left;
  }
  .product-table td { border: 1px solid #ccc; padding: 7px; font-size: 11px; }

  /* Serial section */
  .serial-heading {
    background: #eaf1fb;
    border: 1px solid #12305e;
    color: #12305e;
    font-weight: bold;
    font-size: 11px;
    padding: 7px 10px;
    margin-top: 22px;
  }
  .serial-table { border: 1px solid #ccc; margin-bottom: 5px; }
  .serial-table td {
    border: 1px solid #ccc;
    padding: 5px 8px;
    font-size: 10.5px;
  }
  .serial-table td.sno {
    width: 30px;
    text-align: center;
    color: #12305e;
    font-weight: bold;
  }

  /* Sign off */
  .signoff-title {
    background: #12305e;
    color: #fff;
    font-weight: bold;
    font-size: 12px;
    padding: 8px 10px;
    margin-top: 30px;
  }
  .signoff-table { border: 1px solid #12305e; border-top: none; }
  .signoff-table td { border: 1px solid #12305e; padding: 10px; vertical-align: top; font-size: 11px; }
  .signoff-subheader { color: #2e7d32; font-weight: bold; text-align: center; font-size: 11px; }
  .signoff-key { font-weight: bold; color: #333; width: 35%; }
  .signoff-seal { height: 45px; }
</style>
</head>
<body>

  <table class="header-table">
    <tr>
  <td width="45%" style="vertical-align:middle;">
    <div class="company-name">ENTRO LABS IT SOLUTIONS PVT. LTD.</div>
    <div class="company-meta">
      Corp Office: 1st Floor, Plot No:479, Rd No:10,<br>
      Kakatiya Hills, Madhapur, Hyderabad&ndash; 500081
    </div>
  </td>
  <td width="25%" style="text-align:left; vertical-align:middle;">
    <div class="cin-number" style="font-size:12px; color:#333;">
      <span style="font-weight:700; color:#1a1a1a;text-align: left;">CIN Number:</span><br>
      U72200AP2015PTC097811
    </div>
  </td>
  <td width="20%" style="text-align:right; vertical-align:middle;">
  <img
 src="data:image/png;base64,${logoBase64}"
 style="max-width:150px;width:100%;height:auto;"
/>
   
  </td>
</tr>
  </table>

  <h1 class="title">DELIVERY CHALLAN &amp; INSTALLATION REPORT</h1>

<table class="info-table">
  <colgroup>
    <col style="width:34%">
    <col style="width:22%">
    <col style="width:44%">
  </colgroup>
  <tr>
    <td class="info-header">DELIVERED TO</td>
  <td class="kv-key">DATE</td>
    <td class="kv-val">${challan.date || ""}</td>
  </tr>
  <tr>
    <td rowspan="4">
      <div class="info-value">${challan.customer_name || ""}</div>
      <div class="info-values" style="white-space:pre-line;">${customerAddress}</div>
    </td>
 <td class="kv-key">D.C. NO.</td>
    <td class="kv-val">${challan.deliverychallan_number || ""}</td>
  </tr>
  <tr>
   <td class="kv-key">PO NO.</td>
    <td class="kv-val">${challan.cf_po_number || ""}</td>
  </tr>
  <tr>
    <td class="kv-key">CONTACT PERSON</td>
    <td class="kv-val">${challan.cf_contact_name || ""}</td>
  </tr>
  <tr>
  <td class="kv-key">CONTACT NUMBER</td>
    <td class="kv-val">${challan.cf_contact_mobile_number || ""}</td>
  </tr>
</table>

  <table class="product-table" cellspacing="0" cellpadding="0">
    <tr>
      <th width="8%">S.NO</th>
      <th width="52%">PRODUCT DESCRIPTION</th>
      <th width="20%">QTY</th>
      <th width="20%">WARRANTY</th>
    </tr>
    ${productRows}
  </table>

  ${serialSections}

  <div class="signoff-title">INSTALLATION SIGN OFF</div>
  <table class="signoff-table" cellspacing="0" cellpadding="0">
    <tr>
      <td width="50%" class="signoff-subheader">FOR ${(challan.customer_name || "").toUpperCase()}</td>
      <td width="50%" class="signoff-subheader">FOR ENTRO LABS IT SOLUTIONS PVT. LTD.</td>
    </tr>
    <tr>
      <td>
        <span class="signoff-key">Name &amp; Designation</span><br>
        ${challan.cf_contact_name || ""}
      </td>
      <td>
        <span class="signoff-key">Name &amp; Designation</span><br>
        ${entroRepName}
      </td>
    </tr>
    <tr>
      <td>
        <span class="signoff-key">Contact Number</span><br>
        ${challan.cf_contact_mobile_number || ""}
      </td>
      <td>
        <span class="signoff-key">Contact Number</span><br>
        ${entroRepPhone}
      </td>
    </tr>
    <tr>
      <td class="signoff-seal"><span class="signoff-key">Seal &amp; Signature</span></td>
      <td class="signoff-seal"><span class="signoff-key">Seal &amp; Signature</span></td>
    </tr>
  </table>

</body>
</html>
`;

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  await page.setContent(html, {
    waitUntil: "networkidle0",
  });

  const pdf = await page.pdf({
    format: "A4",
    printBackground: true,
    margin: { top: "20px", bottom: "20px", left: "20px", right: "20px" },
  });

  await browser.close();

  res.setHeader("Content-Type", "application/pdf");

  res.setHeader(
    "Content-Disposition",
    `attachment; filename=${challan.deliverychallan_number}.pdf`,
  );

  return res.send(pdf);
};
