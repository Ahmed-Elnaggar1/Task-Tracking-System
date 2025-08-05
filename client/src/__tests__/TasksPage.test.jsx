/* eslint-env jest */
import React from "react";
import { render, screen } from "@testing-library/react";
import TasksPage from "../components/TasksPage";

describe("TasksPage", () => {
  it("renders the Tasks header", () => {
    render(<TasksPage />);
    expect(screen.getByText(/tasks/i)).toBeInTheDocument();
  });
});
