import React from "react";
import { render, screen } from "@testing-library/react";
import LoginForm from "../components/auth/LoginForm";
import { describe, it, expect } from "@jest/globals";

describe("LoginForm", () => {
  it("renders the Login form", () => {
    render(<LoginForm />);
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
  });
});
