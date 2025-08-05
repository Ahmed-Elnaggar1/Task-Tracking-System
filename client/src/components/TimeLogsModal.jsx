import React, { useEffect, useState } from "react";

const API_URL = "http://localhost:3000/api";

export default function TimeLogsModal({ task, user, onClose }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [date, setDate] = useState("");
  const [hours, setHours] = useState("");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/tasks/${task.id}/timelogs`, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch time logs");
      setLogs(
        Array.isArray(data) ? data : Array.isArray(data.logs) ? data.logs : []
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    // eslint-disable-next-line
  }, [task.id]);

  const handleAddLog = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/tasks/${task.id}/timelogs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({ date, hours, note }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add time log");
      setLogs((logs) => [...logs, data]);
      setDate("");
      setHours("");
      setNote("");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal">
      <div className="auth-form" style={{ maxWidth: 500 }}>
        <h2>Time Logs for: {task.title}</h2>
        <form
          onSubmit={handleAddLog}
          style={{ gap: 8, display: "flex", flexDirection: "column" }}
        >
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
          <input
            type="number"
            min="0.1"
            step="0.1"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
            placeholder="Hours"
            required
          />
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Note (optional)"
          />
          {error && <div className="error">{error}</div>}
          <button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Add Log"}
          </button>
        </form>
        <h3 style={{ marginTop: 24 }}>Previous Logs</h3>
        {loading ? (
          <div>Loading...</div>
        ) : logs.length === 0 ? (
          <div>No time logs yet.</div>
        ) : (
          <ul style={{ padding: 0, listStyle: "none", margin: 0 }}>
            {logs.map((log) => (
              <li
                key={log.id}
                style={{
                  marginBottom: 8,
                  borderBottom: "1px solid #eee",
                  paddingBottom: 6,
                }}
              >
                <strong>{log.date}</strong> - {log.hours}h{" "}
                {log.note && <span>({log.note})</span>}
              </li>
            ))}
          </ul>
        )}
        <button
          type="button"
          onClick={onClose}
          style={{ marginTop: 18, background: "#eee", color: "#333" }}
        >
          Close
        </button>
      </div>
    </div>
  );
}
