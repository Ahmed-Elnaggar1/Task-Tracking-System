import db from "../models/index.js";

export const getTimeLogs = async (req, res) => {
  try {
    const { id } = req.params; // task id
    const logs = await db.TimeLog.findAll({
      where: { taskId: id },
      order: [["date", "ASC"]],
    });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const addTimeLog = async (req, res) => {
  try {
    const { id } = req.params; // task id
    const { date, hours, note } = req.body;
    const userId = req.user.id;
    const log = await db.TimeLog.create({
      date,
      hours,
      note,
      taskId: id,
      userId,
    });
    res.status(201).json(log);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
