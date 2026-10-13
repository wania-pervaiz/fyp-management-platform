
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import SupervisorShell, {
  supervisorLinks,
  getProjectProgress,
} from "@/components/SupervisorShell";


const { pushMock, getTaskGroupsMock, logoutMock } = vi.hoisted(() => ({
  pushMock: vi.fn(),
  getTaskGroupsMock: vi.fn<() => any[]>(() => []),
  logoutMock: vi.fn(),
}));


vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
    replace: vi.fn(),
  }),
}));

vi.mock("@/lib/project-data", () => ({
  getTaskGroups: getTaskGroupsMock,
}));

vi.mock("@/lib/supervisor-auth", () => ({
  logoutSupervisor: logoutMock,
}));

vi.mock("@/lib/project-storage", () => ({
  getCurrentUser: vi.fn(),
  getInvitations: vi.fn(() => []),
  getProjects: vi.fn(() => []),
}));

vi.mock("@/lib/sample-projects", () => ({
  BUILT_IN_PROJECTS: [],
}));

vi.mock("@/lib/sample-seed", () => ({
  seedSampleData: vi.fn(),
}));

describe("SupervisorShell", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getTaskGroupsMock.mockReturnValue([]);
  });

  it("renders the page title, subtitle, and user details", () => {
    render(
      <SupervisorShell
        user={{ name: "Ali Ahmed", email: "ali@example.com" }}
        activeHref="/supervisor/home"
        section="Home"
        title="Welcome"
        subtitle="Manage your projects"
      >
        <p>Dashboard content</p>
      </SupervisorShell>
    );

    expect(screen.getByRole("heading", { name: "Welcome." })).toBeInTheDocument();
    expect(screen.getByText("Manage your projects")).toBeInTheDocument();
    expect(screen.getByText("Ali Ahmed")).toBeInTheDocument();
    expect(screen.getByText("ali@example.com")).toBeInTheDocument();
    expect(screen.getByText("Dashboard content")).toBeInTheDocument();
  });

  it("renders all supervisor navigation links", () => {
    render(
      <SupervisorShell
        user={{ name: "Ali", email: "ali@example.com" }}
        activeHref="/supervisor/home"
        section="Home"
        title="Welcome"
        subtitle="Test"
      >
        <p>Content</p>
      </SupervisorShell>
    );

    for (const item of supervisorLinks) {
      expect(screen.getByRole("link", { name: new RegExp(item.label) })).toHaveAttribute(
        "href",
        item.href
      );
    }
  });

  it("marks the active navigation link", () => {
    render(
      <SupervisorShell
        user={{ name: "Ali", email: "ali@example.com" }}
        activeHref="/supervisor/teams"
        section="Teams"
        title="Teams"
        subtitle="Manage teams"
      >
        <p>Content</p>
      </SupervisorShell>
    );

    expect(screen.getByRole("link", { name: /Teams/ })).toHaveAttribute(
      "aria-current",
      "page"
    );
  });

  it("logs out and redirects when Sign out is clicked", () => {
    render(
      <SupervisorShell
        user={{ name: "Ali", email: "ali@example.com" }}
        activeHref="/supervisor/home"
        section="Home"
        title="Welcome"
        subtitle="Test"
      >
        <p>Content</p>
      </SupervisorShell>
    );

    fireEvent.click(screen.getByRole("button", { name: "Sign out" }));

    expect(logoutMock).toHaveBeenCalledOnce();
    expect(pushMock).toHaveBeenCalledWith("/supervisor/dashboard");
  });

  it("returns zero progress when there are no tasks", () => {
    expect(getProjectProgress("project-1")).toEqual({
      total: 0,
      completed: 0,
      inProgress: 0,
      pending: 0,
      percent: 0,
    });
  });

  it("calculates task counts and completion percentage", () => {
    getTaskGroupsMock.mockReturnValue([
      {
        tasks: [
          { status: "Completed" },
          { status: "Completed" },
          { status: "In Progress" },
          { status: "Pending" },
        ],
      },
    ]);

    expect(getProjectProgress("project-1")).toEqual({
      total: 4,
      completed: 2,
      inProgress: 1,
      pending: 1,
      percent: 50,
    });
  });
});
