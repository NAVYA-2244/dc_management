module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "users",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      full_name: {
        type: DataTypes.STRING,
      },

      email: {
        type: DataTypes.STRING,
        unique: true,
      },

      mobile: {
        type: DataTypes.STRING,
        unique: true,
      },

      password: {
        type: DataTypes.STRING,
      },

      role: {
        type: DataTypes.ENUM("admin", "employee"),
        defaultValue: "admin",
      },

      status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },

      last_login: {
        type: DataTypes.DATE,
      },
      designation: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      employee_id: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
     branch: DataTypes.STRING,

      otp: {
    type: DataTypes.STRING,
    allowNull: true

},

otp_created_at: {
    type: DataTypes.DATE,
    allowNull: true
},
otp_attempts: {
  type: DataTypes.INTEGER,
  defaultValue: 0,
},
otp_resend_count: {
  type: DataTypes.INTEGER,
  defaultValue: 0,
},
otp_resend_window_start: {
  type: DataTypes.DATE,
  allowNull: true,
},
otp_verified: {
  type: DataTypes.BOOLEAN,
  defaultValue: false,
},
force_password_reset: {
  type: DataTypes.TINYINT,
  defaultValue: 1
},
    },
    {
      tableName: "users",
      underscored: true,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  );

  return User;
};
