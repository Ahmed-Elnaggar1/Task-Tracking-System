
import { Sequelize } from "sequelize";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";
import UserFactory from "./User.js";
import TaskFactory from "./Task.js";
import TimeLogFactory from "./TimeLog.js";

const config = JSON.parse(
  fs.readFileSync(new URL("../config/config.json", import.meta.url))
);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const env = process.env.NODE_ENV || "development";
const dbConfig = config[env];

let sequelize;
if (dbConfig.use_env_variable) {
  sequelize = new Sequelize(process.env[dbConfig.use_env_variable], dbConfig);
} else if (process.env.DATABASE_URL) {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: dbConfig.dialect,
    pool: dbConfig.pool || {
      max: 20,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  });
} else {
  sequelize = new Sequelize(
    dbConfig.database,
    dbConfig.username,
    dbConfig.password,
    dbConfig
  );
}

const db = {};
db.User = UserFactory(sequelize);
db.Task = TaskFactory(sequelize);
db.TimeLog = TimeLogFactory(sequelize);

// Set up associations
if (db.User.associate) db.User.associate(db);
if (db.Task.associate) db.Task.associate(db);
if (db.TimeLog.associate) db.TimeLog.associate(db);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export { sequelize, Sequelize };
export default db;
