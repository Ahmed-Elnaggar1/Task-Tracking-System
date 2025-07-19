import { Sequelize } from 'sequelize';
import 'dotenv/config';

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  pool: {
    max: 20, // NFR N2
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

export default sequelize;