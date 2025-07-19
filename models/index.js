import sequelize from '../database.js';
import User from './User.js';
import Task from './Task.js';

User.hasMany(Task, { foreignKey: 'user_id', onDelete: 'RESTRICT' });
Task.belongsTo(User, { foreignKey: 'user_id' });

sequelize.sync({ force: false }).then(() => {
  console.log('Database schema synced');
}).catch(err => {
  console.error('Sync error:', err);
});

export { sequelize, User, Task };