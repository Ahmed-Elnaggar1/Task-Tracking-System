import { DataTypes } from "sequelize";
import { sequelize } from "./index.js";

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  { tableName: "Users", timestamps: false }
);

// Association method for index.js
User.associate = (models) => {
  User.hasMany(models.Task, {
    foreignKey: "user_id",
    as: "tasks",
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  });
};

export default User;
