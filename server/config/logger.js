import winston from "winston";
import { env } from "../env.js";

/**
 * Centralized Logger Configuration
 *
 * Usage in any file:
 * import logger from "../config/logger.js";
 *
 * logger.info("Information message");
 * logger.warn("Warning message");
 * logger.error("Error message", error);
 * logger.debug("Debug message");
 */

// Winston logger setup
const logger = winston.createLogger({
  level: env.NODE_ENV === "production" ? "warn" : "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.printf(({ timestamp, level, message, stack }) => {
      return stack
        ? `${timestamp} [${level.toUpperCase()}]: ${message}\n${stack}`
        : `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
    new winston.transports.File({
      filename: "server.log",
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    // Separate file for errors
    new winston.transports.File({
      filename: "error.log",
      level: "error",
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
  ],
  // Don't exit on handled exceptions
  exitOnError: false,
});

// Handle uncaught exceptions and unhandled rejections
logger.exceptions.handle(
  new winston.transports.File({ filename: "exceptions.log" })
);

logger.rejections.handle(
  new winston.transports.File({ filename: "rejections.log" })
);

export default logger;
