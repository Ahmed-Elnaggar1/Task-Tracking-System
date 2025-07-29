import {
  createUser,
  findUserByEmail,
  validatePassword,
} from "../services/userService.js";
import jwt from "jsonwebtoken";
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required", errorSubcode: "MISSING_CREDENTIALS" });
    }
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password", errorSubcode: "INVALID_CREDENTIALS" });
    }
    const isValid = await validatePassword(user, password);
    if (!isValid) {
      return res.status(401).json({ error: "Invalid email or password", errorSubcode: "INVALID_CREDENTIALS" });
    }
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || "dev_secret", { expiresIn: "1d" });
    res.status(200).json({ message: "Login successful", userId: user.id, token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error", errorSubcode: "INTERNAL_ERROR" });
  }
};

  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required", errorSubcode: "MISSING_CREDENTIALS" });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: "Invalid email format", errorSubcode: "INVALID_EMAIL_FORMAT" });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters", errorSubcode: "WEAK_PASSWORD" });
    }

    // Create user
    const user = await createUser(email, password);
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || "dev_secret", { expiresIn: "1d" });
    res.status(201).json({ message: "User registered successfully", userId: user.id, token });
  } catch (error) {
    if (error.data && error.data.errorSubcode) {
      return res.status(409).json({ error: error.message, errorSubcode: error.data.errorSubcode });
    }
    if (error.message === "Email already registered") {
      return res.status(409).json({ error: error.message, errorSubcode: "EMAIL_EXISTS" });
    }
    console.error("Registration error:", error);
    res.status(500).json({ error: "Internal server error", errorSubcode: "INTERNAL_ERROR" });
  }
};
