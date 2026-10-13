import type { Feedback } from "@/lib/project-storage";

export type Status = "Pending" | "In Progress" | "Completed";
export type Role = "Leader" | "Member";

export type MemberTask = {
  id: string;
  title: string;
  description: string;
  status: Status;
};

export type TaskGroup = {
  id: string;
  projectId: string;
  name: string;
  role: Role;
  tasks: MemberTask[];
};

export type TeamEntry = {
  id: string;
  projectId: string;
  name: string;         // team name
  role: string;
  dueDate?: string;     // ← add the ?
  status: Status;
  members?: string[];   // ← add this line if it is missing
};

export type DocEntry = {
  id: string;
  projectId: string;
  name: string;
  kind: "file" | "folder" | "none";
  attachmentName: string;
  comment: string;
  addedAt: string;
};

export type MeetingEntry = {
  id: string;
  projectId: string;
  title: string;
  supervisorName: string;
  date: string;
  time: string;
  setBy: "student" | "supervisor";
};

const TASK_GROUPS_KEY = "fyp-task-groups";
const TEAM_KEY = "fyp-team-entries";
const DOCS_KEY = "fyp-doc-entries";
const MEETINGS_KEY = "fyp-meeting-entries";

function readAll<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}

function readForProject<T extends { projectId: string }>(
  key: string,
  projectId: string,
): T[] {
  return readAll<T>(key).filter((item) => item.projectId === projectId);
}

// Replaces ONLY this project's items. Other projects are untouched.
function writeForProject<T extends { projectId: string }>(
  key: string,
  projectId: string,
  items: T[],
): void {
  if (typeof window === "undefined") return;
  const others = readAll<T>(key).filter((item) => item.projectId !== projectId);
  localStorage.setItem(key, JSON.stringify([...others, ...items]));
}

export const getTaskGroups = (projectId: string) =>
  readForProject<TaskGroup>(TASK_GROUPS_KEY, projectId);
export const saveTaskGroups = (projectId: string, items: TaskGroup[]) =>
  writeForProject(TASK_GROUPS_KEY, projectId, items);

export const getTeamEntries = (projectId: string) =>
  readForProject<TeamEntry>(TEAM_KEY, projectId);
export const saveTeamEntries = (projectId: string, items: TeamEntry[]) =>
  writeForProject(TEAM_KEY, projectId, items);

export const getDocEntries = (projectId: string) =>
  readForProject<DocEntry>(DOCS_KEY, projectId);
export const saveDocEntries = (projectId: string, items: DocEntry[]) =>
  writeForProject(DOCS_KEY, projectId, items);

export const getMeetingEntries = (projectId: string) =>
  readForProject<MeetingEntry>(MEETINGS_KEY, projectId);
export const saveMeetingEntries = (projectId: string, items: MeetingEntry[]) =>
  writeForProject(MEETINGS_KEY, projectId, items);

/** Overall status of one person's tasks. */
export function groupStatus(tasks: MemberTask[]): Status {
  if (tasks.length === 0) return "Pending";
  if (tasks.every((t) => t.status === "Completed")) return "Completed";
  if (tasks.every((t) => t.status === "Pending")) return "Pending";
  return "In Progress";
}

/* ---------- Sample supervisor data for the demo projects ---------- */

export const SAMPLE_SUPERVISOR_MEETINGS: Record<string, MeetingEntry[]> = {
  "demo-smart-attendance": [
    {
      id: "sample-meet-att-1",
      projectId: "demo-smart-attendance",
      title: "Project progress review",
      supervisorName: "Dr. Ahmed",
      date: "2026-10-20",
      time: "10:00",
      setBy: "supervisor",
    },
  ],
  "demo-campus-library": [
    {
      id: "sample-meet-lib-1",
      projectId: "demo-campus-library",
      title: "Database design discussion",
      supervisorName: "Dr. Fatima",
      date: "2026-10-22",
      time: "11:30",
      setBy: "supervisor",
    },
  ],
  "demo-expense-tracker": [
    {
      id: "sample-meet-exp-1",
      projectId: "demo-expense-tracker",
      title: "Proposal review",
      supervisorName: "Mr. Bilal",
      date: "2026-10-24",
      time: "14:00",
      setBy: "supervisor",
    },
  ],
};

export const SAMPLE_FEEDBACK: Record<string, Feedback[]> = {
  "demo-smart-attendance": [
    {
      id: "sample-fb-att-1",
      projectId: "demo-smart-attendance",
      supervisorEmail: "ahmed@example.com",
      message:
        "Good start on the requirements. Please add a clear use-case diagram and finish the database design before the next meeting.",
      createdAt: "2026-10-10T09:00:00.000Z",
    },
  ],
  "demo-campus-library": [
    {
      id: "sample-fb-lib-1",
      projectId: "demo-campus-library",
      supervisorEmail: "fatima@example.com",
      message:
        "The scope is well defined. Focus on the borrowing and return workflow first, then add reports.",
      createdAt: "2026-10-12T09:00:00.000Z",
    },
  ],
  "demo-expense-tracker": [
    {
      id: "sample-fb-exp-1",
      projectId: "demo-expense-tracker",
      supervisorEmail: "bilal@example.com",
      message:
        "Please split the work between team members and submit a task plan this week.",
      createdAt: "2026-10-14T09:00:00.000Z",
    },
  ],
};