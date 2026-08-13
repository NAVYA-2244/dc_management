module.exports = (sequelize, Sequelize) => {

    const DeliveryChallanTransaction = sequelize.define(
        "delivery_challan_transactions",
        {

            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },

            deliverychallan_id: {
                type: Sequelize.STRING,
                allowNull: false
            },

            line_item_id: {
                type: Sequelize.STRING,
                allowNull: true
            },

            transaction_type: {
                type: Sequelize.STRING,
                allowNull: false
            },

            old_status: {
                type: Sequelize.STRING,
                allowNull: true
            },

            new_status: {
                type: Sequelize.STRING,
                allowNull: true
            },

            remarks: {
                type: Sequelize.TEXT,
                allowNull: true
            },

            performed_by: {
                type: Sequelize.INTEGER,
                allowNull: true
            }

        },
        {
            tableName: "delivery_challan_transactions",
            timestamps: true,
            createdAt: "created_at",
            updatedAt: "updated_at"
        }
    );

    return DeliveryChallanTransaction;
};