module.exports = (sequelize, DataTypes) => {
  const DeliveryChallanLineItem = sequelize.define(
    "DeliveryChallanLineItem",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      deliverychallan_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      line_item_id: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },

      item_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      item_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },

      scanned_qty: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },

      scan_required: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
description: {
  type: DataTypes.TEXT,
  allowNull: true,
},

unit: {
  type: DataTypes.STRING,
  allowNull: true,
},

rate: {
  type: DataTypes.DECIMAL(15, 2),
  allowNull: true,
},

bcy_rate: {
  type: DataTypes.DECIMAL(15, 2),
  allowNull: true,
},

tax_id: {
  type: DataTypes.STRING,
  allowNull: true,
},

tax_name: {
  type: DataTypes.STRING,
  allowNull: true,
},

tax_percentage: {
  type: DataTypes.DECIMAL(10, 2),
  allowNull: true,
},

hsn_or_sac: {
  type: DataTypes.STRING,
  allowNull: true,
},

location_id: {
  type: DataTypes.STRING,
  allowNull: true,
},

location_name: {
  type: DataTypes.STRING,
  allowNull: true,
},
      status: {
        type: DataTypes.ENUM(
          "Pending",
          "In Progress",
          "Completed"
        ),


        allowNull: false,
        defaultValue: "Pending",
      },
    },
    {
      tableName: "delivery_challan_line_items",
      timestamps: false,
    }
  );

  return DeliveryChallanLineItem;
};