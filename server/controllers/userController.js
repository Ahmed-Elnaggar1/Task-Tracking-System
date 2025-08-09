export function createUserController({
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
}) {
  return {
    createUserController: async (req, res) => {
      try {
        const { email, password } = req.body;
        if (!email || !password) {
          return res
            .status(400)
            .json({ error: "Email and password are required" });
        }
        const user = await createUser(email, password);
        res.status(201).json({ message: "User created", userId: user.id });
      } catch (error) {
        if (error.message === "Email already registered") {
          return res.status(409).json({ error: error.message });
        }
        res.status(500).json({ error: "Internal server error" });
      }
    },
    getAllUsers: async (req, res) => {
      try {
        const users = await getAllUsers();
        res.status(200).json({ users });
      } catch (error) {
        res.status(500).json({ error: "Internal server error" });
      }
    },
    getUserById: async (req, res) => {
      try {
        const user = await getUserById(req.params.id);
        if (!user || user.id !== req.user.id)
          return res.status(400).json({ error: "Bad Request" });
        res.status(200).json({ user });
      } catch (error) {
        if (error.message === "User not found") {
          return res.status(404).json({ error: error.message });
        }
        res.status(500).json({ error: "Internal server error" });
      }
    },
    updateUser: async (req, res) => {
      try {
        const { email, password } = req.body;
        const user = await updateUser(req.params.id, email, password);
        if (!user || user.id !== req.user.id)
          return res.status(403).json({ error: "Unauthorized" });
        res.status(200).json({ message: "User updated" });
      } catch (error) {
        if (error.message === "User not found") {
          return res.status(404).json({ error: error.message });
        }
        res.status(500).json({ error: "Internal server error" });
      }
    },
    deleteUser: async (req, res) => {
      try {
        const user = await deleteUser(req.params.id);
        if (!user || user.id !== req.user.id)
          return res.status(403).json({ error: "Unauthorized" });
        res.status(204).send();
      } catch (error) {
        if (error.message === "User not found") {
          return res.status(404).json({ error: error.message });
        }
        res.status(500).json({ error: "Internal server error" });
      }
    },
  };
}

// Default controller instance for app usage
import {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser as deleteUserService,
} from "../services/userService.js";
const controller = createUserController({
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser: deleteUserService,
});
export const createUserHandler = controller.createUserController;
export const getAllUsersHandler = controller.getAllUsers;
export const getUserByIdHandler = controller.getUserById;
export const updateUserHandler = controller.updateUser;
export const deleteUser = controller.deleteUser;
