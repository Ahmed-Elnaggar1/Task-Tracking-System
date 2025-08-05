import express from "express";
import {
  createUserController,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";
import authenticate from "../middleware/auth.js";

const router = express.Router();

router.post("/", createUserController); // Public
router.get("/", authenticate, getAllUsers); // Protected
router.get("/:id", authenticate, getUserById); // Protected
router.put("/:id", authenticate, updateUser); // Protected
router.delete("/:id", authenticate, deleteUser); // Protected

export default router;
