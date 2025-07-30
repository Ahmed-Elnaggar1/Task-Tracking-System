import db from "../models/index.js";
import bcrypt from "bcrypt";

export const createTask = async (
  userId,
  title,
  description,
  estimate,
  status
) => {
  if (!title || !estimate || !status) {
    throw new Error("title, estimate, and status are required");
  }
  if (estimate < 0) throw new Error("Estimate cannot be negative");
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
  if (!task) throw new Error("Task not found");
  return task;
};

export const updateTask = async (taskId, updates, userId) => {
  const task = await db.Task.findOne({
    where: { id: taskId, user_id: userId },
  });
  if (!task) throw new Error("Task not found or unauthorized");
  if (updates.estimate !== undefined && updates.estimate < 0) {
    throw new Error("Estimate cannot be negative");
  }
  if (updates.logged_time !== undefined && updates.logged_time < 0) {
    throw new Error("Logged time cannot be negative");
  }
  if (
    updates.status &&
    !["To-Do", "In Progress", "Done"].includes(updates.status)
  ) {
    throw new Error("Invalid status");
  }
  await task.update(updates);
  return task;
};

export const deleteTask = async (taskId, userId) => {
  const task = await db.Task.findOne({
    where: { id: taskId, user_id: userId },
  });
  if (!task) throw new Error("Task not found or unauthorized");
  await task.destroy();
};

export const logTime = async (taskId, userId, duration) => {
  const task = await db.Task.findOne({
    where: { id: taskId, user_id: userId },
  });
  if (!task) throw new Error("Task not found or unauthorized");
  if (duration <= 0) throw new Error("Duration must be positive");
  const newLoggedTime = task.logged_time + duration;
  await task.update({ logged_time: newLoggedTime });
  return newLoggedTime;
};
