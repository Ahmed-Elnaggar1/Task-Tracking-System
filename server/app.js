import express from "express";
import { env } from "./env.js";
import db from "./models/index.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import cors from "cors";
import timeLogRoutes from "./routes/timeLogRoutes.js";
import morgan from "morgan";
import logger from "./config/logger.js";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";
import { fileURLToPath } from "url";

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
    origin: env.CORS_ORIGIN,
    credentials: true,
  })
);

// Morgan HTTP request logging, using Winston as stream
app.use(
  morgan("combined", { stream: { write: (msg) => logger.info(msg.trim()) } })
);

app.use(express.json());

app.use(`${env.API_PREFIX}/auth`, authRoutes);
app.use(`${env.API_PREFIX}/users`, userRoutes);
app.use(`${env.API_PREFIX}/tasks`, taskRoutes);
app.use(`${env.API_PREFIX}/tasks/:id/timelogs`, timeLogRoutes);

// Health check endpoint for testing
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error("Unhandled error:", err);
  res.status(500).json({
    error: "Internal server error",
    ...(env.NODE_ENV === "development" && { details: err.message }),
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ error: "Route not found" });
});

export default app;
