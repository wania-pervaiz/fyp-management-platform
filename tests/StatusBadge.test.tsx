import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import StatusBadge from "@/components/StatusBadge";

describe("StatusBadge", () => {
  it.each([
    ["Completed", "bg-green-100", "text-green-700"],
    ["In Progress", "bg-blue-100", "text-blue-700"],
    ["Pending", "bg-amber-100", "text-amber-700"],
    ["Upcoming", "bg-slate-100", "text-slate-700"],
    ["Needs Action", "bg-red-100", "text-red-700"],
  ] as const)(
    "displays %s with the correct styling",
    (status, backgroundClass, textClass) => {
      render(<StatusBadge status={status} />);

      const badge = screen.getByText(status);

      expect(badge).toBeInTheDocument();
      expect(badge).toHaveClass(backgroundClass);
      expect(badge).toHaveClass(textClass);
    }
  );
});