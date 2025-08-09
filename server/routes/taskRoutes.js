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

// Register authenticate middleware once for all routes
router.use(authenticate);

router.post("/", createTaskHandler);
router.get("/", getAllTasksHandler);
router.get("/:id", getTaskByIdHandler);
router.put("/:id", updateTaskHandler);
router.delete("/:id", deleteTaskHandler);
router.post("/:id/log-time", logTimeHandler);

export default router;
