import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import PageHeader from "@/components/PageHeader";

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe("PageHeader", () => {
  it("displays the page title", () => {
    render(
      <PageHeader
        title="Project Details"
        description="View your project information."
      />
    );

    expect(
      screen.getByRole("heading", { name: "Project Details" })
    ).toBeInTheDocument();
  });

  it("displays the page description", () => {
    render(
      <PageHeader
        title="Tasks"
        description="Manage your project tasks."
      />
    );

    expect(
      screen.getByText("Manage your project tasks.")
    ).toBeInTheDocument();
  });

  it("links back to the student dashboard", () => {
    render(
      <PageHeader
        title="Milestones"
        description="Track your milestones."
      />
    );

    const link = screen.getByRole("link", {
      name: "← Back to Dashboard",
    });

    expect(link).toHaveAttribute("href", "/student/dashboard");
  });
});