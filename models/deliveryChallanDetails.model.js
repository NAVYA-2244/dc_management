// module.exports = (sequelize, DataTypes) => {

//     const ZohoDeliveryChallan = sequelize.define(
//         "ZohoDeliveryChallan",
//         {

//             id: {
//                 type: DataTypes.BIGINT,
//                 autoIncrement: true,
//                 primaryKey: true
//             },

//             deliverychallan_id: {
//                 type: DataTypes.STRING(50),
//                 unique: true,
//                 allowNull: false
//             },

//             deliverychallan_number: {
//                 type: DataTypes.STRING(100)
//             },


//             customer_id: {
//                 type: DataTypes.STRING(50)
//             },

//             customer_name: {
//                 type: DataTypes.STRING(255)
//             },


//             gst_no: {
//                 type: DataTypes.STRING(50)
//             },


//             date: {
//                 type: DataTypes.DATEONLY
//             },


//             challan_type: {
//                 type: DataTypes.STRING(100)
//             },


//             challan_status: {
//                 type: DataTypes.STRING(50)
//             },


//             invoice_conversion_type: {
//                 type: DataTypes.STRING(50)
//             },


//             branch_id: {
//                 type: DataTypes.STRING(50)
//             },


//             branch_name: {
//                 type: DataTypes.STRING(255)
//             },


//             location_id: {
//                 type: DataTypes.STRING(50)
//             },


//             location_name: {
//                 type: DataTypes.STRING(255)
//             },


//             sub_total:{
//                 type:DataTypes.DECIMAL(15,2),
//                 defaultValue:0
//             },


//             tax_total:{
//                 type:DataTypes.DECIMAL(15,2),
//                 defaultValue:0
//             },


//             total:{
//                 type:DataTypes.DECIMAL(15,2),
//                 defaultValue:0
//             },


//             currency_code:{
//                 type:DataTypes.STRING(10)
//             },


//             billing_address:{
//                 type:DataTypes.JSON
//             },


//             shipping_address:{
//                 type:DataTypes.JSON
//             },


//             line_items:{
//                 type:DataTypes.JSON
//             },


//             custom_fields:{
//                 type:DataTypes.JSON
//             },


//             custom_field_hash:{
//                 type:DataTypes.JSON
//             },


//             zoho_response:{
//                 type:DataTypes.JSON,
//                 allowNull:false
//             },


//             sync_status:{
//                 type:DataTypes.ENUM(
//                     "success",
//                     "failed"
//                 ),
//                 defaultValue:"success"
//             },


//             error_message:{
//                 type:DataTypes.TEXT
//             }
            
//         },
//         {
//             tableName:"delivery_challan_details",
//             timestamps:true
//         }
//     );


//     return ZohoDeliveryChallan;
// };




module.exports = (sequelize, DataTypes) => {

    const ZohoDeliveryChallan = sequelize.define(
        "ZohoDeliveryChallan",
        {

            id: {
                type: DataTypes.BIGINT,
                autoIncrement: true,
                primaryKey: true
            },

            deliverychallan_id: {
                type: DataTypes.STRING(50),
                unique: true,
                allowNull: false
            },

            deliverychallan_number: {
                type: DataTypes.STRING(100)
            },

            customer_id: {
                type: DataTypes.STRING(50)
            },

            customer_name: {
                type: DataTypes.STRING(255)
            },

            company_name: {
                type: DataTypes.STRING(255)
            },

            gst_no: {
                type: DataTypes.STRING(50)
            },

            date: {
                type: DataTypes.DATEONLY
            },

            challan_type: {
                type: DataTypes.STRING(100)
            },

            challan_status: {
                type: DataTypes.STRING(50)
            },

            invoice_conversion_type: {
                type: DataTypes.STRING(50)
            },

            reference_number: {
                type: DataTypes.STRING(100)
            },

            currency_id: {
                type: DataTypes.STRING(50)
            },

            branch_id: {
                type: DataTypes.STRING(50)
            },

            branch_name: {
                type: DataTypes.STRING(255)
            },

            location_id: {
                type: DataTypes.STRING(50)
            },

            location_name: {
                type: DataTypes.STRING(255)
            },

            sub_total: {
                type: DataTypes.DECIMAL(15, 2),
                defaultValue: 0
            },

            tax_total: {
                type: DataTypes.DECIMAL(15, 2),
                defaultValue: 0
            },

            total: {
                type: DataTypes.DECIMAL(15, 2),
                defaultValue: 0
            },

            bcy_total: {
                type: DataTypes.DECIMAL(15, 2),
                defaultValue: 0
            },

            currency_code: {
                type: DataTypes.STRING(10)
            },

            billing_address: {
                type: DataTypes.JSON
            },

            shipping_address: {
                type: DataTypes.JSON
            },

            line_items: {
                type: DataTypes.JSON
            },

            custom_fields: {
                type: DataTypes.JSON
            },

            custom_field_hash: {
                type: DataTypes.JSON
            },

            zoho_response: {
                type: DataTypes.JSON,
                allowNull: false
            },

            sync_status: {
                type: DataTypes.ENUM(
                    "success",
                    "failed"
                ),
                defaultValue: "success"
            },

            error_message: {
                type: DataTypes.TEXT
            },

            created_time: {
                type: DataTypes.DATE
            },

            last_modified_time: {
                type: DataTypes.DATE
            },

            has_attachment: {
                type: DataTypes.BOOLEAN
            },

            tags: {
                type: DataTypes.JSON
            },

            cf_po_number: {
                type: DataTypes.STRING(255)
            },

            cf_po_date: {
                type: DataTypes.DATEONLY
            },

            // Multiple contacts JSON snapshot (also normalized in
            // delivery_challan_contacts table via DeliveryChallanContact model)
            customer_contacts: {
                type: DataTypes.JSON
            },

            registration_details: {
                type: DataTypes.JSON
            },

            documents: {
                type: DataTypes.JSON
            },

            taxes: {
                type: DataTypes.JSON
            }

        },
        {
            tableName: "delivery_challan_details",
            timestamps: true
        }
    );

    return ZohoDeliveryChallan;
};