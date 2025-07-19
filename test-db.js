import { sequelize } from './models/index.js';

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Connection to PostgreSQL has been established successfully.');
    const [results] = await sequelize.query('SELECT NOW()');
    console.log('Current server time:', results[0].now);
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

testConnection();