import db from "../models/index.js";

export const createTask = async (req, res) => {
  try {
    const { user_id, title, description, estimate, status, logged_time } =
      req.body;
    if (!user_id || !title || !estimate || !status) {
      return res
        .status(400)
        .json({ error: "user_id, title, estimate, and status are required" });
    }
    const task = await db.Task.create({
      user_id,
      title,
      description,
      estimate,
      status,
      logged_time,
    });
    res.status(201).json({ message: "Task created", taskId: task.id });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getAllTasks = async (req, res) => {
  try {
    const tasks = await db.Task.findAll();
    res.json(tasks);
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getTaskById = async (req, res) => {
  try {
    const task = await db.Task.findByPk(req.params.id);
    if (!task) return res.status(404).json({ error: "Task not found" });
    res.json(task);
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { title, description, estimate, status, logged_time } = req.body;
    const task = await db.Task.findByPk(req.params.id);
    if (!task) return res.status(404).json({ error: "Task not found" });
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (estimate !== undefined) task.estimate = estimate;
    if (status !== undefined) task.status = status;
    if (logged_time !== undefined) task.logged_time = logged_time;
    await task.save();
    res.json({ message: "Task updated", task });
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const task = await db.Task.findByPk(req.params.id);
    if (!task) return res.status(404).json({ error: "Task not found" });
    await task.destroy();
    res.json({ message: "Task deleted" });
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
};
