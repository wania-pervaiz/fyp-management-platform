
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AIPlanCard from "@/components/AIPlanCard";

const { saveTaskGroupsMock, saveMilestonesMock, getTaskGroupsMock, getMilestonesMock } =
  vi.hoisted(() => ({
    saveTaskGroupsMock: vi.fn(),
    saveMilestonesMock: vi.fn(),
    getTaskGroupsMock: vi.fn(() => []),
    getMilestonesMock: vi.fn(() => []),
  }));

vi.mock("@/lib/project-storage", () => ({
  createId: vi.fn(() => "test-id"),
  getMilestones: getMilestonesMock,
  saveMilestones: saveMilestonesMock,
}));

vi.mock("@/lib/project-data", () => ({
  getTaskGroups: getTaskGroupsMock,
  saveTaskGroups: saveTaskGroupsMock,
}));

const project = {
  id: "project-1",
  title: "FYP Management Platform",
  description: "A platform to manage final year projects",
} as any;

describe("AIPlanCard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal("fetch", vi.fn());
    getTaskGroupsMock.mockReturnValue([]);
    getMilestonesMock.mockReturnValue([]);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("shows the AI planner heading and generate button", () => {
    render(<AIPlanCard project={project} onSaved={vi.fn()} />);

    expect(screen.getByText("AI Project Planner")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Generate plan with AI" })).toBeInTheDocument();
  });

  it("shows suggested tasks and milestones after a successful response", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({
        tasks: [{ title: "Design UI", description: "Create the screens" }],
        milestones: [{ title: "Design complete", description: "Finish UI design", weeksFromStart: 2 }],
      }),
    } as Response);

    render(<AIPlanCard project={project} onSaved={vi.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: "Generate plan with AI" }));

    expect(await screen.findByText("Design UI")).toBeInTheDocument();
    expect(screen.getByText("Design complete")).toBeInTheDocument();
  });

  it("shows an error when the API responds with an error", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      json: async () => ({ error: "AI service unavailable" }),
    } as Response);

    render(<AIPlanCard project={project} onSaved={vi.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: "Generate plan with AI" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("AI service unavailable");
  });

  it("shows a fallback error when the request fails", async () => {
    vi.mocked(fetch).mockRejectedValue(new Error("Network error"));

    render(<AIPlanCard project={project} onSaved={vi.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: "Generate plan with AI" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Network error");
  });

  it("saves the generated plan when accepted", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({
        tasks: [{ title: "Design UI", description: "Create the screens" }],
        milestones: [{ title: "Design complete", description: "Finish UI design", weeksFromStart: 2 }],
      }),
    } as Response);

    const onSaved = vi.fn();
    render(<AIPlanCard project={project} onSaved={onSaved} />);

    fireEvent.click(screen.getByRole("button", { name: "Generate plan with AI" }));
    fireEvent.click(await screen.findByRole("button", { name: "Accept and save" }));

    await waitFor(() => {
      expect(saveTaskGroupsMock).toHaveBeenCalled();
      expect(saveMilestonesMock).toHaveBeenCalled();
      expect(onSaved).toHaveBeenCalled();
    });
  });

  it("discards the generated plan", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({
        tasks: [{ title: "Design UI", description: "Create the screens" }],
        milestones: [],
      }),
    } as Response);

    render(<AIPlanCard project={project} onSaved={vi.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: "Generate plan with AI" }));

    expect(await screen.findByText("Design UI")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Discard" }));

    expect(screen.queryByText("Design UI")).not.toBeInTheDocument();
  });
});
