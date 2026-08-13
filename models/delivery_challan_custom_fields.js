module.exports = (sequelize, DataTypes) => {

  const DeliveryChallanCustomField = sequelize.define(
    "delivery_challan_custom_fields",
    {

      id:{
        type:DataTypes.BIGINT,
        autoIncrement:true,
        primaryKey:true
      },

      delivery_challan_id:{
        type:DataTypes.BIGINT,
        allowNull:false
      },

      field_id:{
        type:DataTypes.STRING,
        allowNull:true
      },

      api_name:{
        type:DataTypes.STRING,
        allowNull:true
      },

      label:{
        type:DataTypes.STRING,
        allowNull:true
      },

      data_type:{
        type:DataTypes.STRING,
        allowNull:true
      },

      value:{
        type:DataTypes.TEXT,
        allowNull:true
      },

      value_formatted:{
        type:DataTypes.TEXT,
        allowNull:true
      },

      created_at:{
        type:DataTypes.DATE,
        defaultValue:DataTypes.NOW
      }

    },
    {
      tableName:"delivery_challan_custom_fields",
      timestamps:false
    }
  );


  DeliveryChallanCustomField.associate=(models)=>{

    DeliveryChallanCustomField.belongsTo(
      models.delivery_challans,
      {
        foreignKey:"delivery_challan_id",
        as:"delivery_challan"
      }
    );

  };


  return DeliveryChallanCustomField;

};