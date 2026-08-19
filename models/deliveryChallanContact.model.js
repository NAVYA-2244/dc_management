module.exports = (sequelize, DataTypes) => {

    const DeliveryChallanContact = sequelize.define(
        "DeliveryChallanContact",
        {

            id: {
                type: DataTypes.BIGINT,
                autoIncrement: true,
                primaryKey: true
            },

            deliverychallan_id: {
                type: DataTypes.STRING(50),
                allowNull: false
            },
            contact_type: {
                type: DataTypes.ENUM("vendor", "customer"),
                allowNull: false
            },

            contact_name: {
                type: DataTypes.STRING(255)
            },

            designation: {
                type: DataTypes.STRING(255)
            },

            mobile: {
                type: DataTypes.STRING(20)
            },

            email: {
                type: DataTypes.STRING(255)
            },

            sequence: {
                type: DataTypes.INTEGER,
                defaultValue: 1
            }

        },
        {
            tableName: "delivery_challan_contacts",
            timestamps: true
        }
    );

    return DeliveryChallanContact;
};