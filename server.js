import { cleanEnv, str, port } from "envalid";
import "dotenv/config";
import { sequelize, dbReady } from "./models/index.js";

const env = cleanEnv(process.env, {
  DATABASE_URL: str({
    default:
      "postgres://tasktracker_user:secure_password_123@localhost:5432/task_tracking",
  }),
  PORT: port({ default: 3000 }),
});

async function startServer() {
  try {
    await dbReady; // Wait for models to be loaded and associated
    await sequelize.authenticate();
    console.log("Database connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

startServer();
