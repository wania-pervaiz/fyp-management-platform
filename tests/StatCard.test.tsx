
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import StatCard from "@/components/StatCard";

describe("StatCard", () => {
  it("displays the title and value", () => {
    render(
      <StatCard
        title="Total Projects"
        value="12"
        icon="📁"
      />
    );

    expect(screen.getByText("Total Projects")).toBeInTheDocument();
    expect(screen.getByText("12")).toBeInTheDocument();
  });

  it("displays the optional description", () => {
    render(
      <StatCard
        title="Completed"
        value="5"
        description="Projects finished"
        icon="✓"
      />
    );

    expect(screen.getByText("Projects finished")).toBeInTheDocument();
  });

  it("does not display a description when none is provided", () => {
    render(
      <StatCard
        title="Pending"
        value="3"
        icon="!"
      />
    );

    expect(screen.queryByText("Projects finished")).not.toBeInTheDocument();
  });

  it("applies the default blue color", () => {
    const { container } = render(
      <StatCard title="Projects" value="12" icon="P" />
    );

    expect(container.firstChild).toHaveClass("bg-blue-50");
  });

  it("applies the requested green color", () => {
    const { container } = render(
      <StatCard
        title="Completed"
        value="5"
        icon="✓"
        color="green"
      />
    );

    expect(container.firstChild).toHaveClass("bg-green-50");
  });

  it("hides the decorative icon from screen readers", () => {
    const { container } = render(
      <StatCard title="Projects" value="12" icon="📁" />
    );

    expect(container.querySelector('[aria-hidden="true"]')).toHaveTextContent("📁");
  });
});
