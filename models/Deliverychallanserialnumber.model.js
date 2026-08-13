module.exports = (sequelize, DataTypes) => {
  const DeliveryChallanSerialNumber = sequelize.define(
    "DeliveryChallanSerialNumber",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      line_item_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      serial_number: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      scanned_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: "delivery_challan_serial_numbers",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  return DeliveryChallanSerialNumber;
};