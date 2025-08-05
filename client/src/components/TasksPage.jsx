import React, { useEffect, useState } from "react";
import TimeLogsModal from "./TimeLogsModal";

const API_URL = "http://localhost:3000/api";

export default function TasksPage({ user }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [showLogs, setShowLogs] = useState(false);
  const [logsTask, setLogsTask] = useState(null);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/tasks`, {
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
  };

  useEffect(() => {
    if (user) fetchTasks();
  }, [user]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      const res = await fetch(`${API_URL}/tasks/${id}`, {
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

  const handleFormSuccess = (result, isEdit) => {
    // result may be { task } or just the task object
    const updatedTask = result.task || result;
    if (isEdit) {
      setTasks((tasks) =>
        tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t))
      );
    } else {
      setTasks((tasks) => [...tasks, updatedTask]);
    }
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

function TaskForm({ user, onClose, onSuccess, editTask }) {
  const [title, setTitle] = useState(editTask?.title || "");
  const [description, setDescription] = useState(editTask?.description || "");
  const [estimate, setEstimate] = useState(editTask?.estimate || "");
  const [status, setStatus] = useState(editTask?.status || "To-Do");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `${API_URL}/tasks${editTask ? `/${editTask.id}` : ""}`,
        {
          method: editTask ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
          body: JSON.stringify({ title, description, estimate, status }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      onSuccess(data, !!editTask);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>{editTask ? "Edit Task" : "Add Task"}</h2>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          required
        />
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
        />
        <input
          type="number"
          value={estimate}
          onChange={(e) => setEstimate(e.target.value)}
          placeholder="Estimate (hours)"
          min="0.1"
          step="0.1"
          required
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          required
        >
          <option value="To-Do">To-Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
        </select>
        {error && <div className="error">{error}</div>}
        <div style={{ display: "flex", gap: 8 }}>
          <button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </button>
          <button
            type="button"
            onClick={onClose}
            style={{ background: "#eee", color: "#333" }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
