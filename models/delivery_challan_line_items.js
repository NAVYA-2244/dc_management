module.exports = (sequelize, DataTypes) => {
  const DeliveryChallanLineItem = sequelize.define(
    "delivery_challan_line_items",
    {
      id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },

      deliverychallan_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },

      zoho_line_item_id: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      item_id: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      item_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      item_order: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },

      item_type: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      rate: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },

      quantity: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },

      unit: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      discount: {
        type: DataTypes.DECIMAL(10, 2),
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

      tax_type: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      tax_percentage: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
      },

      item_total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },

      product_type: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      hsn_or_sac: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      is_invoiced: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },

      quantity_returned: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
      },

      location_id: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      location_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },

    },
    {
      tableName: "delivery_challan_line_items",
      timestamps: false,
    }
  );


  DeliveryChallanLineItem.associate = (models) => {

    DeliveryChallanLineItem.belongsTo(
      models.delivery_challans,
      {
        foreignKey: "deliverychallan_id",
        as: "delivery_challan",
      }
    );

  };


  return DeliveryChallanLineItem;
};