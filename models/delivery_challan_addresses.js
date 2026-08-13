module.exports = (sequelize, DataTypes) => {

  const DeliveryChallanAddress = sequelize.define(
    "delivery_challan_addresses",
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

      address_type:{
        type:DataTypes.STRING,
        allowNull:true
      },

      address:{
        type:DataTypes.TEXT,
        allowNull:true
      },

      street2:{
        type:DataTypes.STRING,
        allowNull:true
      },

      city:{
        type:DataTypes.STRING,
        allowNull:true
      },

      state:{
        type:DataTypes.STRING,
        allowNull:true
      },

      zip:{
        type:DataTypes.STRING,
        allowNull:true
      },

      country:{
        type:DataTypes.STRING,
        allowNull:true
      },

      phone:{
        type:DataTypes.STRING,
        allowNull:true
      },

      fax:{
        type:DataTypes.STRING,
        allowNull:true
      },

      attention:{
        type:DataTypes.STRING,
        allowNull:true
      },

      created_at:{
        type:DataTypes.DATE,
        defaultValue:DataTypes.NOW
      }

    },
    {
      tableName:"delivery_challan_addresses",
      timestamps:false
    }
  );


  DeliveryChallanAddress.associate=(models)=>{

    DeliveryChallanAddress.belongsTo(
      models.delivery_challans,
      {
        foreignKey:"deliverychallan_id",
        as:"delivery_challan"
      }
    );

  };


  return DeliveryChallanAddress;

};