module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "DeliveryChallanEwaybill",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      delivery_challan_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      ewaybill_id: DataTypes.STRING,
      eway_bill_no: DataTypes.STRING,
      ewaybill_status: DataTypes.STRING,
      ewaybill_status_formatted: DataTypes.STRING,
      ewaybill_date: DataTypes.STRING,
      ewaybill_expiry_date: DataTypes.STRING,
      sub_supply_type: DataTypes.STRING,
      transportation_mode: DataTypes.STRING,
      vehicle_number: DataTypes.STRING,
      transporter_name: DataTypes.STRING,
      transporter_id: DataTypes.STRING,
      transporter_registration_id: DataTypes.STRING,
    },
    {
      tableName: "delivery_challan_ewaybills",
      timestamps: false,
      createdAt: "created_at",
    }
  );
};