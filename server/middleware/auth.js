import jwt from "jsonwebtoken";
import { env } from "../env.js";

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token provided" });
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    req.user = { id: decoded.userId }; // Adjust based on token payload
    next();
  } catch (error) {
    // jwt.verify automatically checks for expiration and throws TokenExpiredError
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expired" });
    }
    return res.status(401).json({ error: "Invalid token" });
  }
};

export default authenticate;
