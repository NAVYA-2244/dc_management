module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "DeliveryChallan",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      deliverychallan_id: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },

      zcrm_potential_id: DataTypes.STRING,
      zcrm_potential_name: DataTypes.STRING,

      customer_id: DataTypes.STRING,
      customer_name: DataTypes.STRING,
      company_name: DataTypes.STRING,

      status: DataTypes.STRING,
      challan_status: DataTypes.STRING,

      deliverychallan_number: DataTypes.STRING,
      reference_number: DataTypes.STRING,

      date: DataTypes.DATEONLY,

      currency_id: DataTypes.STRING,
      currency_code: DataTypes.STRING,

      total: DataTypes.DECIMAL(18, 2),
      bcy_total: DataTypes.DECIMAL(18, 2),

      created_time: DataTypes.STRING,
      last_modified_time: DataTypes.STRING,

      has_attachment: DataTypes.BOOLEAN,

      tags: DataTypes.JSON,

      cf_po_number: DataTypes.STRING,
      cf_po_number_unformatted: DataTypes.STRING,

      cf_po_date: DataTypes.STRING,
      cf_po_date_unformatted: DataTypes.DATEONLY,

      cf_contact_name: DataTypes.STRING,
      cf_contact_name_unformatted: DataTypes.STRING,

      cf_contact_designation: DataTypes.STRING,
      cf_contact_designation_unformatted: DataTypes.STRING,

      cf_contact_mobile_number: DataTypes.STRING,
      cf_contact_mobile_number_unformatted: DataTypes.STRING,

      branch_id: DataTypes.STRING,

      location_id: DataTypes.STRING,
      location_name: DataTypes.STRING,

      registration_details: DataTypes.JSON,
      line_items: {
  type: DataTypes.JSON
},

documents: {
  type: DataTypes.JSON
},

billing_address: {
  type: DataTypes.JSON
},

shipping_address: {
  type: DataTypes.JSON
},

taxes: {
  type: DataTypes.JSON
},

custom_fields: {
  type: DataTypes.JSON
},

custom_field_hash: {
  type: DataTypes.JSON
},

zoho_response: {
  type: DataTypes.JSON
},
 
    },
    {
      tableName: "delivery_challans",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
};