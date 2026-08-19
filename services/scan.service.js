const db = require("../models");
const { Op } = require("sequelize");

const DeliveryChallan = db.DeliveryChallan;

const DeliveryChallanLineItem = db.DeliveryChallanLineItem;
const DeliveryChallanSerialNumber = db.DeliveryChallanSerialNumber;
exports.getLineItem = async (line_item_id) => {
  const item = await DeliveryChallanLineItem.findOne({
    where: {
      line_item_id,
    },
  });

  if (!item) throw new Error("Line item not found");

  return item;
};

exports.skipScan = async (line_item_id) => {
  const item = await DeliveryChallanLineItem.findOne({
    where: {
      line_item_id,
    },
  });

  if (!item) {
    throw new Error("Line item not found");
  }

  item.scan_required = false;
  //item.scanned_qty = item.quantity;
  item.status = "Completed";

  await item.save();

  await updateDeliveryChallanStatus(item.deliverychallan_id);

  return item;
};

exports.scanSerial = async (line_item_id, serial_number) => {

console.log("Received Serial Numberrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr =>", serial_number);

  const item = await DeliveryChallanLineItem.findOne({
    where: {
      line_item_id,
    },
  });

  if (!item) throw new Error("Item not found");

 // const exists = await DeliveryChallanSerialNumber.findOne({
  //   where: {
  //     line_item_id,
  //     serial_number,
  //   },
  // });

  // if (exists) throw new Error("Serial already scanned");

  const exists = await DeliveryChallanSerialNumber.findOne({
  where: {
    serial_number,
  },
});

if (exists) {
  throw new Error("This serial number has already been scanned.");
}


  await DeliveryChallanSerialNumber.create({
    line_item_id,

    serial_number,

    scanned_at: new Date(),
  });

  item.scanned_qty += 1;

  if (item.scanned_qty >= item.quantity) {
    item.status = "Completed";
  } else {
    item.status = "In Progress";
  }

  await item.save();

  await updateDeliveryChallanStatus(item.deliverychallan_id);

  return item;
};

async function updateDeliveryChallanStatus(deliverychallan_id) {
  const challan = await DeliveryChallan.findOne({
    where: { deliverychallan_id },
  });

  if (!challan) {
    return;
  }

  // Count items not completed
  const pendingItems = await DeliveryChallanLineItem.count({
    where: {
      deliverychallan_id,
      status: {
        [Op.ne]: "Completed",
      },
    },
  });

  challan.status = pendingItems === 0 ? "Completed" : "In Progress";

  await challan.save();
}

exports.saveSerialNumbers = async (line_item_id, body) => {
  const item = await DeliveryChallanLineItem.findOne({
    where: { line_item_id },
  });

  if (!item) {
    throw new Error("Line item not found");
  }

  // Already scanned count
  const count = await DeliveryChallanSerialNumber.count({
    where: {
      line_item_id,
    },
  });

  // Quantity limit check
  if (count >= item.quantity) {
    throw new Error("Required quantity already scanned");
  }

  const serial_number = body.serial_number;

 // const exists = await DeliveryChallanSerialNumber.findOne({
  //   where: {
  //     line_item_id,
  //     serial_number,
  //   },
  // });

  // if (exists) {
  //   throw new Error("Serial already scanned");
  // }


  const exists = await DeliveryChallanSerialNumber.findOne({
  where: {
    serial_number,
  },
});

if (exists) {
  throw new Error("This serial number has already been scanned.");
}


  await DeliveryChallanSerialNumber.create({
    deliverychallan_id: item.deliverychallan_id,
    line_item_id,
    serial_number,
    scanned_at: new Date(),
  });

  const updatedCount = await DeliveryChallanSerialNumber.count({
    where: {
      line_item_id,
    },
  });

  item.scanned_qty = updatedCount;

  if (item.scanned_qty >= item.quantity) {
    item.status = "Completed";
    item.scan_required = false;
  } else {
    item.status = "In Progress";
  }

  await item.save();

  await updateDeliveryChallanStatus(item.deliverychallan_id);

  return item;
};

exports.getScannedSerialNumbers = async (line_item_id) => {
  const item = await DeliveryChallanLineItem.findOne({
    where: {
      line_item_id,
    },
  });

  if (!item) {
    throw new Error("Line item not found");
  }

  const serials = await DeliveryChallanSerialNumber.findAll({
    where: {
      line_item_id,
    },
    order: [["id", "ASC"]],
  });

  let status = "In Progress";

  if (item.scanned_qty >= item.quantity) {
    status = "Completed";
  }

  return {
    line_item_id: item.line_item_id,

    item_name: item.item_name,

    quantity: item.quantity,

    scanned_qty: item.scanned_qty,

    remaining_qty: item.quantity - item.scanned_qty,

    scan_required: item.scan_required,

    status,

    serial_numbers: serials,
  };
};

exports.updateSerialNumber = async (id, serial_number) => {
  const serial = await DeliveryChallanSerialNumber.findByPk(id);

  if (!serial) {
    throw new Error("Serial number not found");
  }

  const duplicate = await DeliveryChallanSerialNumber.findOne({
    where: {
      serial_number,
      id: {
        [Op.ne]: id,
      },
    },
  });

  if (duplicate) {
    throw new Error("Serial number already exists");
  }

  serial.serial_number = serial_number;

  await serial.save();

  return serial;
};

exports.updateDeliveryChallanStatus = updateDeliveryChallanStatus;
