// module.exports = (sequelize, DataTypes) => {
//   return sequelize.define(
//     "Organization",
//     {
//       organization_id: {
//         type: DataTypes.STRING,
//         primaryKey: true,
//       },
//       name: DataTypes.STRING,
//       contact_name: DataTypes.STRING,
//       email: DataTypes.STRING,
//       phone: DataTypes.STRING,
//       country: DataTypes.STRING,
//       currency_code: DataTypes.STRING,
//       currency_symbol: DataTypes.STRING,
//       time_zone: DataTypes.STRING,
//       state: DataTypes.STRING,
//       plan_name: DataTypes.STRING,
//       plan_period: DataTypes.STRING,
//       account_created_date: DataTypes.STRING,
//       org_type: DataTypes.STRING,
//       version: DataTypes.STRING,
//       raw_data: DataTypes.JSON,
//     },
//     {
//       tableName: "organizations",
//       timestamps: true,
//     }
//   );
// };




module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "Organization",
    {
      organization_id: {
        type: DataTypes.STRING,
        primaryKey: true,
      },

      isOrgNotSupported: DataTypes.BOOLEAN,
      name: DataTypes.STRING,
      contact_name: DataTypes.STRING,
      email: DataTypes.STRING,
      source: DataTypes.INTEGER,
      country: DataTypes.STRING,
      country_code: DataTypes.STRING,
      org_settings: DataTypes.BOOLEAN,
      is_ziedition: DataTypes.BOOLEAN,
      custom_field_type: DataTypes.INTEGER,

      is_sku_enabled: DataTypes.BOOLEAN,
      phone: DataTypes.STRING,
      org_type: DataTypes.STRING,
      state_code: DataTypes.STRING,
      state: DataTypes.STRING,
      zoho_one_org: DataTypes.STRING,
      zi_zb_edition: DataTypes.INTEGER,
      org_created_app_source: DataTypes.INTEGER,
      zi_zb_client: DataTypes.INTEGER,
      is_solo_org: DataTypes.BOOLEAN,
      partners_domain: DataTypes.STRING,
      version: DataTypes.STRING,
      version_formatted: DataTypes.STRING,
      is_search360_enabled: DataTypes.STRING,
      is_sales_inclusive_tax_enabled: DataTypes.BOOLEAN,
      sales_tax_type: DataTypes.STRING,
      tax_group_enabled: DataTypes.BOOLEAN,
      language_code: DataTypes.STRING,
      fiscal_year_start_month: DataTypes.INTEGER,
      time_zone: DataTypes.STRING,
      field_separator: DataTypes.STRING,
      time_zone_formatted: DataTypes.STRING,
      can_change_timezone: DataTypes.BOOLEAN,
      digital_signature_mode: DataTypes.STRING,
      is_dsign_required: DataTypes.BOOLEAN,
      can_sign_invoice: DataTypes.BOOLEAN,
      is_user_dsign_mandatory: DataTypes.BOOLEAN,

      currency_id: DataTypes.STRING,
      currency_code: DataTypes.STRING,
      currency_symbol: DataTypes.STRING,
      currency_format: DataTypes.STRING,
      price_precision: DataTypes.INTEGER,

      is_designated_zone: DataTypes.BOOLEAN,
      is_free_zone: DataTypes.BOOLEAN,
      is_registered_for_composite_scheme: DataTypes.BOOLEAN,
      is_sales_reverse_charge_enabled: DataTypes.BOOLEAN,
      is_export_with_payment_enabled: DataTypes.BOOLEAN,
      is_registered_for_tax: DataTypes.BOOLEAN,
      is_tax_registered: DataTypes.BOOLEAN,
      is_international_trade_enabled: DataTypes.BOOLEAN,
      is_gst_india_version: DataTypes.BOOLEAN,
      is_registered_for_gst: DataTypes.BOOLEAN,
      is_multientity_org: DataTypes.BOOLEAN,
      is_multientity_enabled: DataTypes.BOOLEAN,
      isOrgActive: DataTypes.BOOLEAN,

      plan_type: DataTypes.INTEGER,
      plan_name: DataTypes.STRING,
      plan_period: DataTypes.STRING,

      account_created_date: DataTypes.STRING,
      account_created_date_formatted: DataTypes.STRING,

      is_org_active: DataTypes.BOOLEAN,
      is_quick_setup_completed: DataTypes.BOOLEAN,
      is_trial_period_extended: DataTypes.BOOLEAN,
      is_trial_expired: DataTypes.BOOLEAN,
      is_invoice_pmt_tds_allowed: DataTypes.BOOLEAN,
      is_hsn_or_sac_enabled: DataTypes.BOOLEAN,

      mode: DataTypes.STRING,
      support_email: DataTypes.STRING,

      can_show_document_tab: DataTypes.BOOLEAN,
      is_scan_preference_enabled: DataTypes.BOOLEAN,

      is_user_accountant: DataTypes.BOOLEAN,
      is_user_last_admin: DataTypes.BOOLEAN,
      is_user_super_admin: DataTypes.BOOLEAN,

      user_status: DataTypes.INTEGER,
      user_status_formatted: DataTypes.STRING,

      org_action: DataTypes.STRING,

      is_zpayroll_grid: DataTypes.BOOLEAN,
      is_default_org: DataTypes.BOOLEAN,
      is_subscription_paused: DataTypes.BOOLEAN,

      custom_fields: DataTypes.JSON,
      org_joined_app_list: DataTypes.JSON,
      other_active_services: DataTypes.JSON,
      AppList: DataTypes.JSON,
    },
    {
      tableName: "organizations",
      timestamps: true,
    }
  );
};