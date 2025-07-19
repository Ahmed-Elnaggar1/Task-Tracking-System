import { DataTypes } from 'sequelize';
import sequelize from '../database.js';

const Task = sequelize.define('Task', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  user_id: { type: DataTypes.UUID, allowNull: false },
  title: { type: DataTypes.STRING(100), allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: true },
  estimate: { type: DataTypes.FLOAT, allowNull: false, validate: { min: 0 } },
  status: { type: DataTypes.STRING(20), allowNull: false, validate: { isIn: [['To-Do', 'In Progress', 'Done']] } },
  logged_time: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0, validate: { min: 0 } },
  created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
}, { tableName: 'Tasks', timestamps: false });

export default Task;