import React, { useState } from "react";
import { API_ENDPOINTS } from "../config/constants";

export default function TaskForm({ user, onClose, onSuccess, editTask }) {
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
        `${API_ENDPOINTS.TASKS}${editTask ? `/${editTask.id}` : ""}`,
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
