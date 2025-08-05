export function createTaskController({
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
  logTime,
}) {
  return {
    createTaskHandler: async (req, res) => {
      try {
        const { title, description, estimate, status } = req.body;
        if (!title || !estimate || !status) {
          return res
            .status(400)
            .json({ error: "title, estimate, and status are required" });
        }
        const task = await createTask(
          req.user.id,
          title,
          description,
          estimate,
          status
        );
        res.status(201).json({ message: "Task created", taskId: task.id });
      } catch (error) {
        if (error.message.includes("required")) {
          return res.status(400).json({ error: error.message });
        }
        console.error("Create task error:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    },
    getAllTasksHandler: async (req, res) => {
      try {
        if (!req.user) {
          return res.status(401).json({ error: "Unauthorized" });
        }
        const tasks = await getAllTasks(req.user.id);
        res.status(200).json({ tasks });
      } catch (error) {
        console.error("Get tasks error:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    },
    getTaskByIdHandler: async (req, res) => {
      try {
        const task = await getTaskById(req.params.id);
        res.status(200).json({ task });
      } catch (error) {
        if (error.message === "Task not found") {
          return res.status(404).json({ error: error.message });
        }
        console.error("Get task error:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    },
    updateTaskHandler: async (req, res) => {
      try {
        const { id } = req.params;
        if (!id || id === "undefined" || isNaN(Number(id))) {
          return res
            .status(400)
            .json({ error: "Task id is required and must be valid" });
        }
        const { title, description, estimate, status, logged_time } = req.body;
        const task = await updateTask(
          id,
          { title, description, estimate, status, logged_time },
          req.user.id
        );
        res.status(200).json({ message: "Task updated", task });
      } catch (error) {
        if (
          error.message.includes("not found") ||
          error.message.includes("unauthorized") ||
          error.message.includes("Invalid") ||
          error.message.includes("negative")
        ) {
          return res.status(403).json({ error: error.message });
        }
        console.error("Update task error:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    },
    deleteTaskHandler: async (req, res) => {
      try {
        await deleteTask(req.params.id, req.user.id);
        res.status(200).json({ message: "Task deleted" });
      } catch (error) {
        if (
          error.message.includes("not found") ||
          error.message.includes("unauthorized")
        ) {
          return res.status(404).json({ error: error.message });
        }
        console.error("Delete task error:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    },
    logTimeHandler: async (req, res) => {
      try {
        const { duration } = req.body;
        if (!duration) {
          return res.status(400).json({ error: "duration is required" });
        }
        const loggedTime = await logTime(req.params.id, req.user.id, duration);
        res.status(200).json({
          message: "Time logged successfully",
          logged_time: loggedTime,
        });
      } catch (error) {
        if (
          error.message.includes("not found") ||
          error.message.includes("unauthorized") ||
          error.message.includes("positive")
        ) {
          return res.status(403).json({ error: error.message });
        }
        console.error("Log time error:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    },
  };
}

// Default controller instance for app usage
import {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
  logTime,
} from "../services/taskService.js";
export const defaultTaskController = createTaskController({
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
  logTime,
});
export const createTaskHandler = defaultTaskController.createTaskHandler;
export const getAllTasksHandler = defaultTaskController.getAllTasksHandler;
export const getTaskByIdHandler = defaultTaskController.getTaskByIdHandler;
export const updateTaskHandler = defaultTaskController.updateTaskHandler;
export const deleteTaskHandler = defaultTaskController.deleteTaskHandler;
export const logTimeHandler = defaultTaskController.logTimeHandler;
