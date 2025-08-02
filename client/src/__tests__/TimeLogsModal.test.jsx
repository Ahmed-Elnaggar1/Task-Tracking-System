import React from "react";
import { describe, it, expect } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import TimeLogsModal from "../components/TimeLogsModal";

describe("TimeLogsModal", () => {
  it("renders the Time Logs modal", () => {
    const mockTask = { id: 1, name: "Sample Task" };
    render(
      <TimeLogsModal
        open={true}
        onClose={() => {}}
        timeLogs={[]}
        task={mockTask}
      />
    );
    expect(
      screen.getByRole("heading", { name: /time logs for:/i })
    ).toBeInTheDocument();
  });
});
