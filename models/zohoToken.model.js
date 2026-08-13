module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "ZohoToken",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      organization_id: {
        type: DataTypes.STRING,
      },
      access_token: {
        type: DataTypes.TEXT,
      },
      refresh_token: {
        type: DataTypes.TEXT,
      },
      expires_at: {
        type: DataTypes.DATE,
      },
    },
    {
      tableName: "zoho_tokens",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
};