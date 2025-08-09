import jwt from "jsonwebtoken";
import { env } from "../env.js";
import logger from "../config/logger.js";

export function createAuthController({
  findUserByEmail,
  validatePassword,
  createUser,
}) {
  return {
    loginUser: async (req, res) => {
      try {
        const { email, password } = req.body;
        if (!email || !password) {
          return res.status(400).json({
            error: "Email and password are required",
            errorSubcode: "MISSING_CREDENTIALS",
          });
        }
        const user = await findUserByEmail(email);
        if (!user) {
          return res.status(401).json({
            error: "Invalid credentials",
            errorSubcode: "INVALID_CREDENTIALS",
          });
        }
        const isValid = await validatePassword(user, password);
        if (!isValid) {
          return res.status(401).json({
            error: "Invalid credentials",
            errorSubcode: "INVALID_CREDENTIALS",
          });
        }
        const token = jwt.sign({ userId: user.id }, env.JWT_SECRET, {
          expiresIn: "1d",
        });
        res.status(200).json({
          message: "Login successful",
          id: user.id,
          email: user.email,
          token,
        });
      } catch (error) {
        logger.error("Login error:", error);
        res.status(500).json({
          error: "Internal server error",
          errorSubcode: "INTERNAL_ERROR",
        });
      }
    },
    registerUser: async (req, res) => {
      try {
        const { email, password } = req.body;
        if (!email || !password) {
          return res.status(400).json({
            error: "Email and password are required",
            errorSubcode: "MISSING_CREDENTIALS",
          });
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          return res.status(400).json({
            error: "Invalid email format",
            errorSubcode: "INVALID_EMAIL_FORMAT",
          });
        }
        if (password.length < 6) {
          return res.status(400).json({
            error: "Password must be at least 6 characters",
            errorSubcode: "WEAK_PASSWORD",
          });
        }
        const user = await createUser(email, password);
        const token = jwt.sign({ userId: user.id }, env.JWT_SECRET, {
          expiresIn: "1d",
        });
        res.status(201).json({
          message: "User registered successfully",
          id: user.id,
          email: user.email,
          token,
        });
      } catch (error) {
        if (error.message === "Email already registered") {
          return res
            .status(409)
            .json({ error: error.message, errorSubcode: "EMAIL_EXISTS" });
        }
        logger.error("Registration error:", error);
        res.status(500).json({
          error: "Internal server error",
          errorSubcode: "INTERNAL_ERROR",
        });
      }
    },
  };
}

// Default controller instance for app usage
import {
  findUserByEmail,
  validatePassword,
  createUser,
} from "../services/userService.js";
export const { loginUser, registerUser } = createAuthController({
  findUserByEmail,
  validatePassword,
  createUser,
});
