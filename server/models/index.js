import { Sequelize } from "sequelize";

import UserFactory from "./User.js";
import TaskFactory from "./Task.js";
import TimeLogFactory from "./TimeLog.js";
import { env } from "../env.js";

const sequelize = new Sequelize(env.DATABASE_URL, {
  dialect: "postgres",
  logging: false,
});

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
