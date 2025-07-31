import React, { useState } from "react";

import SignupForm from "./components/auth/SignupForm";
import LoginForm from "./components/auth/LoginForm";
import TasksPage from "./components/TasksPage";

export default function App() {
  const [showLogin, setShowLogin] = useState(true);
  const [user, setUser] = useState(null);

  const [page, setPage] = useState("tasks");
  if (user) {
    return (
      <>
        <nav
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "#4f8cff",
            color: "#fff",
            padding: "1rem 2rem",
            marginBottom: 24,
          }}
        >
          <div style={{ fontWeight: 700, fontSize: 22, letterSpacing: 1 }}>
            Task Tracking System
          </div>
          <div style={{ display: "flex", gap: 16 }}>
            <button
              style={{
                background: page === "tasks" ? "#235390" : "#fff",
                color: page === "tasks" ? "#fff" : "#235390",
                border: "none",
                borderRadius: 8,
                padding: "0.5rem 1.2rem",
                fontWeight: 600,
                cursor: "pointer",
                marginRight: 8,
              }}
              onClick={() => setPage("tasks")}
            >
              Tasks
            </button>
            {/* Placeholder for Time Logging nav */}
            <button
              style={{
                background: "#fff",
                color: "#e53e3e",
                border: "none",
                borderRadius: 8,
                padding: "0.5rem 1.2rem",
                fontWeight: 600,
                cursor: "pointer",
              }}
              onClick={() => setUser(null)}
            >
              Log out
            </button>
          </div>
        </nav>
        {page === "tasks" && <TasksPage user={user} />}
      </>
    );
  }

  return (
    <div className="split-container">
      <div className="split-left">
        <h1>Task Tracking System</h1>
      </div>
      <div className="split-right">
        <div className="form-toggle">
          <button
            className={showLogin ? "active" : ""}
            onClick={() => setShowLogin(true)}
            type="button"
          >
            Login
          </button>
          <button
            className={!showLogin ? "active" : ""}
            onClick={() => setShowLogin(false)}
            type="button"
          >
            Sign Up
          </button>
        </div>
        <div style={{ width: "100%", maxWidth: 370 }}>
          {showLogin ? (
            <LoginForm onSuccess={setUser} />
          ) : (
            <SignupForm onSuccess={setUser} />
          )}
        </div>
      </div>
    </div>
  );
}
