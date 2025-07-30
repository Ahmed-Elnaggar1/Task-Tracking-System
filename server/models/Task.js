import { DataTypes } from "sequelize";
import { sequelize } from "./index.js";
// Do not import User here to avoid circular dependency

const Task = sequelize.define(
  "Task",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    estimate: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("To-Do", "In Progress", "Done"),
      allowNull: false,
    },
    logged_time: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  { tableName: "Tasks", timestamps: false }
);

// Association method for index.js
Task.associate = (models) => {
  Task.belongsTo(models.User, {
    foreignKey: "user_id",
    as: "user",
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  });
};

export default Task;
