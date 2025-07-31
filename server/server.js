import "dotenv/config";
import express from "express";
import { cleanEnv, str, port } from "envalid";
import db from "./models/index.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import cors from "cors";
import timeLogRoutes from "./routes/timeLogRoutes.js";
const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

const env = cleanEnv(process.env, {
  DATABASE_URL: str({
    default:
      "postgres://tasktracker_user:secure_password_123@localhost:5432/task_tracking",
  }),
  PORT: port({ default: 3000 }),
});

app.use("/api", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/tasks/:id/timelogs", timeLogRoutes);

async function startServer() {
  try {
    await db.sequelize.authenticate();
    console.log("Database connection has been established successfully.");
    const server = app.listen(env.PORT, () => {
      console.log(`Server running on port ${env.PORT}`);
    });
    server.on("error", (error) => {
      console.error("Server error:", error);
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

startServer();
