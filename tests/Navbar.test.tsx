import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Navbar from "@/components/Navbar";

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

describe("Navbar", () => {
  it("displays the platform name", () => {
    render(<Navbar />);

    expect(
      screen.getByRole("link", { name: "FYP Management Platform" })
    ).toHaveAttribute("href", "/");
  });

  it("displays all navigation links with correct destinations", () => {
    render(<Navbar />);

    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute(
      "href",
      "/"
    );
    expect(screen.getByRole("link", { name: "Login" })).toHaveAttribute(
      "href",
      "/login"
    );
    expect(
      screen.getByRole("link", { name: "Health Check" })
    ).toHaveAttribute("href", "/health");
  });

  it("provides an accessible navigation label", () => {
    render(<Navbar />);

    expect(
      screen.getByRole("navigation", { name: "Main navigation" })
    ).toBeInTheDocument();
  });
});