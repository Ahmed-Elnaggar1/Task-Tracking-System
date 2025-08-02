import express from "express";
const router = express.Router();
import {
  createTaskHandler,
  getAllTasksHandler,
  getTaskByIdHandler,
  updateTaskHandler,
  deleteTaskHandler,
  logTimeHandler,
} from "../controllers/taskController.js";
import authenticate from "../middleware/auth.js";

router.post("/", authenticate, createTaskHandler);
router.get("/", authenticate, getAllTasksHandler);
router.get("/:id", authenticate, getTaskByIdHandler);
router.put("/:id", authenticate, updateTaskHandler);
router.delete("/:id", authenticate, deleteTaskHandler);
router.post("/:id/log-time", authenticate, logTimeHandler);

export default router;
