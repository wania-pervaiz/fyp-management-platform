import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Field, StatusBadge, getInitials } from "@/components/StudentShell";

describe("StudentShell helpers", () => {
  it("StatusBadge shows its status", () => {
    render(<StatusBadge status="Completed" />);
    expect(screen.getByText("Completed")).toBeInTheDocument();
  });
  it("Field links its label to the input", () => {
    render(<Field label="Name"><input /></Field>);
    expect(screen.getByLabelText("Name")).toBeInTheDocument();
  });
  it("getInitials works", () => {
    expect(getInitials("Ali Ahmed")).toBe("AA");
    expect(getInitials("")).toBe("S");
  });
});