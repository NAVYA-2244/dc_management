module.exports = (sequelize, DataTypes) => {

  const DeliveryChallanEwaybill = sequelize.define(
    "delivery_challan_ewaybills",
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

      eway_bill_no: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      vehicle_number: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      transporter_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      transporter_id: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      }

    },
    {
      tableName: "delivery_challan_ewaybills",
      timestamps:false
    }
  );


  DeliveryChallanEwaybill.associate = (models)=>{

    DeliveryChallanEwaybill.belongsTo(
      models.delivery_challans,
      {
        foreignKey:"deliverychallan_id",
        as:"delivery_challan"
      }
    );

  };


  return DeliveryChallanEwaybill;

};