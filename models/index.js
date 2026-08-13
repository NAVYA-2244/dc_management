const sequelize = require("../config/database");

const db = {};

db.Sequelize = require("sequelize");
db.sequelize = sequelize;

db.Organization = require("./organization.model")(sequelize, db.Sequelize);
db.Customer = require("./customer.model")(sequelize, db.Sequelize);
db.CustomerDetails = require("./customerDetails.model")(sequelize, db.Sequelize);
db.DeliveryChallan = require("./deliveryChallan.model")(sequelize, db.Sequelize);
db.users = require("./user.model")(sequelize, db.Sequelize);
db.DeliveryChallanDetails = require("./deliveryChallanDetails.model")(sequelize, db.Sequelize);
db.DeliveryChallanLineItem = require("./deliveryChallanLineItem.model")(sequelize, db.Sequelize);
db.DeliveryChallanSerialNumber = require("./deliveryChallanSerialNumber.model")(sequelize, db.Sequelize);
db.DeliveryChallanTransaction = require("./deliverychallantransaction.model")(sequelize, db.Sequelize);
db.Organizations= require("./organization.model")(sequelize, db.Sequelize);
db.DeliveryChallanEwaybill = require("./delivery_challan_ewaybills")(sequelize, db.Sequelize);
db.DeliveryChallan.belongsTo(db.Customer, { foreignKey: "customer_id", targetKey: "contact_id" });
db.Customer.hasMany(db.DeliveryChallan, { foreignKey: "customer_id", sourceKey: "contact_id" });
db.Customer.hasOne(db.CustomerDetails, { foreignKey: "contact_id", sourceKey: "contact_id" });
db.CustomerDetails.belongsTo(db.Customer, { foreignKey: "contact_id", targetKey: "contact_id" });
module.exports = db;