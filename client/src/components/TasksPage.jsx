import React, { useEffect, useState, useCallback } from "react";
import TimeLogsModal from "./TimeLogsModal";
import TaskForm from "./TaskForm";
import { API_ENDPOINTS } from "../config/constants";

export default function TasksPage({ user }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [showLogs, setShowLogs] = useState(false);
  const [logsTask, setLogsTask] = useState(null);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(API_ENDPOINTS.TASKS, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch tasks");
      setTasks(
        Array.isArray(data) ? data : Array.isArray(data.tasks) ? data.tasks : []
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user?.token]);

  useEffect(() => {
    if (user) fetchTasks();
  }, [user, fetchTasks]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      const res = await fetch(`${API_ENDPOINTS.TASKS}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      if (!res.ok) throw new Error("Delete failed");
      setTasks((tasks) => tasks.filter((t) => t.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEdit = (task) => {
    setEditTask(task);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setEditTask(null);
    setShowForm(false);
  };

  const handleFormSuccess = async () => {
    await fetchTasks();
    handleFormClose();
  };

  return (
    <div className="tasks-page">
      <div className="tasks-header">
        <h2>Tasks</h2>
        <button onClick={() => setShowForm(true)}>+ Add Task</button>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <table className="tasks-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id}>
                <td>{task.title}</td>
                <td>{task.description}</td>
                <td>{task.status}</td>
                <td>
                  <button onClick={() => handleEdit(task)}>Edit</button>
                  <button
                    onClick={() => {
                      setLogsTask(task);
                      setShowLogs(true);
                    }}
                    style={{ background: "#235390", color: "#fff" }}
                  >
                    Log Time
                  </button>
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="danger"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {showForm && (
        <TaskForm
          user={user}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
          editTask={editTask}
        />
      )}
      {showLogs && logsTask && (
        <TimeLogsModal
          task={logsTask}
          user={user}
          onClose={() => {
            setShowLogs(false);
            setLogsTask(null);
          }}
        />
      )}
    </div>
  );
}
