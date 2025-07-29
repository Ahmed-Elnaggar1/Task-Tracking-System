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

router.post("/tasks", createTaskHandler);
router.get("/tasks", getAllTasksHandler);
router.get("/tasks/:id", getTaskByIdHandler);
router.put("/tasks/:id", updateTaskHandler);
router.delete("/tasks/:id", deleteTaskHandler);
router.post("/tasks/:id/log-time", logTimeHandler);

export default router;
