import express from "express";
import {
  createUserHandler,
  getAllUsersHandler,
  getUserByIdHandler,
  updateUserHandler,
  deleteUser,
} from "../controllers/userController.js";
import authenticate from "../middleware/auth.js";

const router = express.Router();

router.post("/", createUserHandler); // Public
router.get("/", authenticate, getAllUsersHandler); // Protected
router.get("/:id", authenticate, getUserByIdHandler); // Protected
router.put("/:id", authenticate, updateUserHandler); // Protected
router.delete("/:id", authenticate, deleteUser); // Protected

export default router;
