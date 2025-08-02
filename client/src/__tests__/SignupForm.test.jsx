import React from "react";
import { render, screen } from "@testing-library/react";
import SignupForm from "../components/auth/SignupForm";
// Add the following import if your environment does not provide Jest globals
/* eslint-disable no-undef */

describe("SignupForm", () => {
  it("renders the Signup form", () => {
    render(<SignupForm />);
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
  });
});
