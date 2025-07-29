import {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
  logTime,
} from "../services/taskService.js";

export const createTaskHandler = async (req, res) => {
  try {
    const { user_id, title, description, estimate, status } = req.body;
    if (!user_id || !title || !estimate || !status) {
      return res
        .status(400)
        .json({ error: "user_id, title, estimate, and status are required" });
    }
    const task = await createTask(
      user_id,
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
};

export const getAllTasksHandler = async (req, res) => {
  try {
    const { user_id } = req.body;
    if (!user_id) {
      return res.status(400).json({ error: "user_id is required" });
    }
    const tasks = await getAllTasks(user_id);
    res.status(200).json({ tasks });
  } catch (error) {
    console.error("Get tasks error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getTaskByIdHandler = async (req, res) => {
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
};

export const updateTaskHandler = async (req, res) => {
  try {
    const { user_id, title, description, estimate, status, logged_time } =
      req.body;
    if (!user_id) {
      return res.status(400).json({ error: "user_id is required" });
    }
    const task = await updateTask(
      req.params.id,
      { title, description, estimate, status, logged_time },
      user_id
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
};

export const deleteTaskHandler = async (req, res) => {
  try {
    const { user_id } = req.body;
    if (!user_id) {
      return res.status(400).json({ error: "user_id is required" });
    }
    await deleteTask(req.params.id, user_id);
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
};

export const logTimeHandler = async (req, res) => {
  try {
    const { user_id, duration } = req.body;
    if (!user_id || !duration) {
      return res
        .status(400)
        .json({ error: "user_id and duration are required" });
    }
    const loggedTime = await logTime(req.params.id, user_id, duration);
    res
      .status(200)
      .json({ message: "Time logged successfully", logged_time: loggedTime });
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
};
