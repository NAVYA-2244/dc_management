module.exports = (sequelize, DataTypes) => {

  const DeliveryChallanTax = sequelize.define(
    "delivery_challan_taxes",
    {

      id:{
        type:DataTypes.BIGINT,
        autoIncrement:true,
        primaryKey:true
      },

      deliverychallan_id:{
        type:DataTypes.BIGINT,
        allowNull:false
      },

      line_item_id:{
        type:DataTypes.BIGINT,
        allowNull:true
      },

      tax_id:{
        type:DataTypes.STRING,
        allowNull:true
      },

      tax_name:{
        type:DataTypes.STRING,
        allowNull:true
      },

      tax_percentage:{
        type:DataTypes.DECIMAL(5,2),
        allowNull:true
      },

      tax_amount:{
        type:DataTypes.DECIMAL(10,2),
        allowNull:true
      },

      created_at:{
        type:DataTypes.DATE,
        defaultValue:DataTypes.NOW
      }

    },
    {
      tableName:"delivery_challan_taxes",
      timestamps:false
    }
  );


  DeliveryChallanTax.associate=(models)=>{

    DeliveryChallanTax.belongsTo(
      models.delivery_challans,
      {
        foreignKey:"delivery_challan_id",
        as:"delivery_challan"
      }
    );


    DeliveryChallanTax.belongsTo(
      models.delivery_challan_line_items,
      {
        foreignKey:"line_item_id",
        as:"line_item"
      }
    );

  };


  return DeliveryChallanTax;

};