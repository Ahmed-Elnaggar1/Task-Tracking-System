import "dotenv/config";
import express from "express";
import { cleanEnv, str, port } from "envalid";
import db from "./models/index.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";

const app = express();
app.use(express.json());

// Validate and clean environment variables
const env = cleanEnv(process.env, {
  DATABASE_URL: str({
    default:
      "postgres://tasktracker_user:secure_password_123@localhost:5432/task_tracking",
  }),
  PORT: port({ default: 3000 }),
});

app.use("/api", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api", taskRoutes);

async function startServer() {
  try {
    await db.sequelize.authenticate();
    console.log("Database connection has been established successfully.");
    app.listen(env.PORT, () => {
      console.log(`Server running on port ${env.PORT}`);
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

startServer();
