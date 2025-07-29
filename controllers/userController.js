import { createUser } from "../services/userService.js";
import db from "../models/index.js";

export const createUserController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }
    const user = await createUser(email, password);
    res.status(201).json({ message: "User created", userId: user.id });
  } catch (error) {
    if (error.message === "Email already registered") {
      return res.status(409).json({ error: error.message });
    }
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await db.User.findAll({
      attributes: { exclude: ["password"] },
    });
    res.json(users);
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await db.User.findByPk(req.params.id, {
      attributes: { exclude: ["password"] },
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await db.User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    if (email) user.email = email;
    if (password) user.password = password;
    await user.save();
    res.json({ message: "User updated" });
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
};

  try {
    const user = await db.User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    await user.destroy();
    res.status(204).send();
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
};
