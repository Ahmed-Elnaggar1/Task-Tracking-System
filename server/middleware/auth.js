import jwt from "jsonwebtoken";

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token provided" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "dev_secret");
    req.user = { id: decoded.userId }; // Adjust based on token payload
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

export default authenticate;
