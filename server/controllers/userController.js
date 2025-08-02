import {
  createUser,
  getAllUsers as getAllUsersService,
  getUserById as getUserByIdService,
  updateUser as updateUserService,
  deleteUser as deleteUserService,
} from "../services/userService.js";

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
    const users = await getAllUsersService();
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await getUserByIdService(req.params.id);
    if (!user || user.id !== req.user.id)
      return res.status(403).json({ error: "Unauthorized" });
    res.status(200).json({ user });
  } catch (error) {
    if (error.message === "User not found") {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await updateUserService(req.params.id, email, password);
    if (!user || user.id !== req.user.id)
      return res.status(403).json({ error: "Unauthorized" });
    res.status(200).json({ message: "User updated" });
  } catch (error) {
    if (error.message === "User not found") {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await deleteUserService(req.params.id);
    if (!user || user.id !== req.user.id)
      return res.status(403).json({ error: "Unauthorized" });
    res.status(204).send();
  } catch (error) {
    if (error.message === "User not found") {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: "Internal server error" });
  }
};
