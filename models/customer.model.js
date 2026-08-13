module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "Customer",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      contact_id: {
        type: DataTypes.STRING,
        unique: true,
      },

      contact_name: DataTypes.STRING,
      customer_name: DataTypes.STRING,
      vendor_name: DataTypes.STRING,
      company_name: DataTypes.STRING,

      website: DataTypes.STRING,

      language_code: DataTypes.STRING,
      language_code_formatted: DataTypes.STRING,

      contact_type: DataTypes.STRING,
      contact_type_formatted: DataTypes.STRING,

      status: DataTypes.STRING,

      customer_sub_type: DataTypes.STRING,

      source: DataTypes.STRING,

      is_linked_with_zohocrm: DataTypes.BOOLEAN,

      payment_terms: DataTypes.INTEGER,

      payment_terms_id: DataTypes.STRING,

      payment_terms_label: DataTypes.STRING,

      currency_id: DataTypes.STRING,

      currency_code: DataTypes.STRING,

      twitter: DataTypes.STRING,

      facebook: DataTypes.STRING,

      outstanding_receivable_amount: DataTypes.DECIMAL(18,2),

      outstanding_receivable_amount_bcy: DataTypes.DECIMAL(18,2),

      outstanding_payable_amount: DataTypes.DECIMAL(18,2),

      outstanding_payable_amount_bcy: DataTypes.DECIMAL(18,2),

      unused_credits_receivable_amount: DataTypes.DECIMAL(18,2),

      unused_credits_receivable_amount_bcy: DataTypes.DECIMAL(18,2),

      unused_credits_payable_amount: DataTypes.DECIMAL(18,2),

      unused_credits_payable_amount_bcy: DataTypes.DECIMAL(18,2),

      first_name: DataTypes.STRING,

      last_name: DataTypes.STRING,

      email: DataTypes.STRING,

      phone: DataTypes.STRING,

      mobile: DataTypes.STRING,

      portal_status: DataTypes.STRING,

      portal_status_formatted: DataTypes.STRING,

      created_time: DataTypes.STRING,

      created_time_formatted: DataTypes.STRING,

      last_modified_time: DataTypes.STRING,

      last_modified_time_formatted: DataTypes.STRING,

      gst_no: DataTypes.STRING,

      gst_treatment: DataTypes.STRING,

      place_of_contact: DataTypes.STRING,

      place_of_contact_formatted: DataTypes.STRING,

      has_attachment: DataTypes.BOOLEAN,

      pan_no: DataTypes.STRING,

      custom_fields: DataTypes.JSON,

      custom_field_hash: DataTypes.JSON,

      contactperson_custom_fields: DataTypes.JSON,

      tags: DataTypes.JSON,

      registration_details: DataTypes.JSON,



      designation: DataTypes.STRING,
department: DataTypes.STRING,
photo_url: DataTypes.TEXT,

branch_id: DataTypes.STRING,
branch_name: DataTypes.STRING,

location_id: DataTypes.STRING,
location_name: DataTypes.STRING,

currency_symbol: DataTypes.STRING,

billing_address: DataTypes.JSON,
shipping_address: DataTypes.JSON,
contact_persons: DataTypes.JSON,
contact_tax_information: DataTypes.JSON,
default_templates: DataTypes.JSON,
customer_currency_summaries: DataTypes.JSON,
additional_information: DataTypes.JSON,
    },
    {
      tableName: "customers",
      timestamps: false,
    }
  );
};