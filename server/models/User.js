import { DataTypes } from "sequelize";

export default (sequelize) => {
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
  User.associate = (models) => {
    User.hasMany(models.Task, {
      foreignKey: "user_id",
      as: "tasks",
      onDelete: "RESTRICT",
      onUpdate: "CASCADE",
    });
  };
  return User;
};
