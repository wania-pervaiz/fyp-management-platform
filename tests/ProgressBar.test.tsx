import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ProgressBar from "@/components/ProgressBar";

describe("ProgressBar", () => {
  it("displays the label and percentage", () => {
    render(<ProgressBar value={75} label="Project Progress" />);

    expect(screen.getByText("Project Progress")).toBeInTheDocument();
    expect(screen.getByText("75%")).toBeInTheDocument();
  });

  it("sets the correct accessible progress values", () => {
    render(<ProgressBar value={60} label="Task Completion" />);

    const progressBar = screen.getByRole("progressbar", {
      name: "Task Completion",
    });

    expect(progressBar).toHaveAttribute("aria-valuenow", "60");
    expect(progressBar).toHaveAttribute("aria-valuemin", "0");
    expect(progressBar).toHaveAttribute("aria-valuemax", "100");
  });

  it("sets the inner bar width to match the percentage", () => {
    render(<ProgressBar value={40} label="Overall Progress" />);

    const progressBar = screen.getByRole("progressbar", {
      name: "Overall Progress",
    });
    const innerBar = progressBar.firstElementChild;

    expect(innerBar).toHaveStyle({ width: "40%" });
  });

  it("supports zero progress", () => {
    render(<ProgressBar value={0} label="Starting Progress" />);

    expect(screen.getByText("0%")).toBeInTheDocument();
    expect(
      screen.getByRole("progressbar", { name: "Starting Progress" })
    ).toHaveAttribute("aria-valuenow", "0");
  });

  it("supports complete progress", () => {
    render(<ProgressBar value={100} label="Completed Progress" />);

    expect(screen.getByText("100%")).toBeInTheDocument();
    expect(
      screen.getByRole("progressbar", { name: "Completed Progress" })
    ).toHaveAttribute("aria-valuenow", "100");
  });
});