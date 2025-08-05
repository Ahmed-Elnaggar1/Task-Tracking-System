import "dotenv/config";
import express from "express";
import { cleanEnv, str, port } from "envalid";
import db from "./models/index.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import cors from "cors";
import timeLogRoutes from "./routes/timeLogRoutes.js";
import morgan from "morgan";
import winston from "winston";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";
import { fileURLToPath } from "url";
// Winston logger setup
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(
      ({ timestamp, level, message }) => `${timestamp} [${level}]: ${message}`
    )
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "server.log" }),
  ],
});

const app = express();
// Swagger UI setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const swaggerDocument = YAML.load(
  path.join(__dirname, "./documentation/openapi.yaml")
);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Morgan HTTP request logging, using Winston as stream
app.use(
  morgan("combined", { stream: { write: (msg) => logger.info(msg.trim()) } })
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
    logger.info("Database connection has been established successfully.");
    const server = app.listen(env.PORT, () => {
      logger.info(`Server running on port ${env.PORT}`);
    });
    server.on("error", (error) => {
      logger.error(`Server error: ${error}`);
    });
  } catch (error) {
    logger.error(`Unable to connect to the database: ${error}`);
  }
}

startServer();
