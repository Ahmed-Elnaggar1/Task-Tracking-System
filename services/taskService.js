import db from "../models/index.js";

export const createTask = async (
  userId,
  title,
  description,
  estimate,
  status
) => {
  if (!userId || !title || !estimate || !status) {
    throw new Error("user_id, title, estimate, and status are required");
  }
  const task = await db.Task.create({
    user_id: userId,
    title,
    description,
    estimate,
    status,
    logged_time: 0,
  });
  return task;
};

export const getAllTasks = async (userId) => {
  const tasks = await db.Task.findAll({ where: { user_id: userId } });
  return tasks;
};

export const getTaskById = async (taskId) => {
  const task = await db.Task.findByPk(taskId);
  if (!task) {
    throw new Error("Task not found");
  }
  return task;
};

export const updateTask = async (taskId, updates, userId) => {
  const task = await db.Task.findOne({
    where: { id: taskId, user_id: userId },
  });
  if (!task) {
    throw new Error("Task not found or unauthorized");
  }
  if (updates.title !== undefined) task.title = updates.title;
  if (updates.description !== undefined) task.description = updates.description;
  if (updates.estimate !== undefined) task.estimate = updates.estimate;
  if (updates.status !== undefined) {
    if (!["To-Do", "In Progress", "Done"].includes(updates.status)) {
      throw new Error("Invalid status value");
    }
    task.status = updates.status;
  }
  if (updates.logged_time !== undefined) {
    if (updates.logged_time < 0) {
      throw new Error("Logged time cannot be negative");
    }
    task.logged_time = updates.logged_time;
  }
  await task.save();
  return task;
};

export const deleteTask = async (taskId, userId) => {
  const task = await db.Task.findOne({
    where: { id: taskId, user_id: userId },
  });
  if (!task) {
    throw new Error("Task not found or unauthorized");
  }
  await task.destroy();
  return true;
};

export const logTime = async (taskId, userId, duration) => {
  const task = await db.Task.findOne({
    where: { id: taskId, user_id: userId },
  });
  if (!task) {
    throw new Error("Task not found or unauthorized");
  }
  if (duration <= 0) {
    throw new Error("Duration must be positive");
  }
  task.logged_time += duration;
  await task.save();
  return task.logged_time;
};
