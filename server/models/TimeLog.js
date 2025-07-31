import { DataTypes } from "sequelize";

export default (sequelize) => {
  const TimeLog = sequelize.define(
    "TimeLog",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      hours: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      note: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      taskId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "Tasks", key: "id" },
        onDelete: "CASCADE",
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "Users", key: "id" },
        onDelete: "CASCADE",
      },
    },
    {
      tableName: "TimeLogs",
      timestamps: true,
    }
  );
  return TimeLog;
};
