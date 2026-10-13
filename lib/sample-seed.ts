import {
  createId,
  getAccounts,
  getInvitations,
  getMilestones,
  saveAccounts,
  saveInvitations,
  saveMilestones,
  type Invitation,
  type Milestone,
  type UserAccount,
} from "@/lib/project-storage";
import { BUILT_IN_PROJECTS } from "@/lib/sample-projects";
import {
  getDocEntries,
  getTaskGroups,
  getTeamEntries,
  saveDocEntries,
  saveTaskGroups,
  saveTeamEntries,
  type DocEntry,
  type Role,
  type Status,
  type TaskGroup,
  type TeamEntry,
} from "@/lib/project-data";

const SEED_FLAG = "fyp-sample-seeded-v1";

type TaskSeed = [title: string, description: string, status: Status];

type SeedData = {
  people: {
    name: string;
    role: Role;
    teamRole: string;
    due: string;
    teamStatus: Status;
    tasks: TaskSeed[];
  }[];
  milestones: [string, string, string, Milestone["status"]][]; // title, description, due, status
  docs: [name: string, attachment: string, comment: string][];
};

const SEEDS: Record<string, SeedData> = {
  "demo-smart-attendance": {
    people: [
      {
        name: "Ali Ahmed",
        role: "Leader",
        teamRole: "Leader",
        due: "2026-12-15",
        teamStatus: "In Progress",
        tasks: [
          ["Design database schema", "Tables for students, classes and attendance records", "Completed"],
          ["Create login page", "Login screen for teachers and admins", "In Progress"],
        ],
      },
      {
        name: "Sara Khan",
        role: "Member",
        teamRole: "Frontend Developer",
        due: "2026-12-30",
        teamStatus: "Pending",
        tasks: [
          ["Build attendance marking screen", "Mark present or absent for each class", "In Progress"],
          ["Generate attendance reports", "Weekly and monthly report export", "Pending"],
        ],
      },
    ],
    milestones: [
      ["Requirements gathering", "Collect and finalize system requirements", "2026-10-15", "Completed"],
      ["Database and UI design", "Finish schema and main screen designs", "2026-11-20", "In Progress"],
      ["Core development", "Build attendance and report modules", "2027-01-31", "Upcoming"],
    ],
    docs: [
      ["Project Proposal", "Proposal.pdf", "Approved by the supervisor."],
      ["Requirements Document", "", "Draft of functional requirements."],
    ],
  },
  "demo-campus-library": {
    people: [
      {
        name: "Usman Ali",
        role: "Leader",
        teamRole: "Leader",
        due: "2026-12-20",
        teamStatus: "In Progress",
        tasks: [
          ["Design book catalog", "Tables for books, authors and categories", "Completed"],
          ["Build borrow and return flow", "Issue and return books with due dates", "In Progress"],
        ],
      },
      {
        name: "Ayesha Noor",
        role: "Member",
        teamRole: "Frontend Developer",
        due: "2027-01-10",
        teamStatus: "Pending",
        tasks: [
          ["Create student search page", "Search books by title or author", "Pending"],
          ["Fine calculation module", "Calculate late return fines", "Pending"],
        ],
      },
    ],
    milestones: [
      ["Library requirements", "Define borrowing rules and user roles", "2026-10-18", "Completed"],
      ["Catalog module", "Add, edit and search books", "2026-11-25", "In Progress"],
      ["Borrowing module", "Issue, return and fines", "2027-01-31", "Upcoming"],
    ],
    docs: [
      ["Literature Review", "LiteratureReview.docx", "Compared existing library systems."],
      ["Database Design", "", "ER diagram is in progress."],
    ],
  },
  "demo-expense-tracker": {
    people: [
      {
        name: "Hamza Khan",
        role: "Leader",
        teamRole: "Leader",
        due: "2026-12-10",
        teamStatus: "In Progress",
        tasks: [
          ["Plan app features", "List the core features and screens", "In Progress"],
          ["Design expense categories", "Categories like food, travel and bills", "Pending"],
        ],
      },
      {
        name: "Noor Fatima",
        role: "Member",
        teamRole: "UI/UX Designer",
        due: "2026-11-30",
        teamStatus: "Completed",
        tasks: [
          ["Create wireframes", "Sketch the main screens", "Completed"],
          ["Budget summary screen", "Monthly budget versus spending view", "Pending"],
        ],
      },
    ],
    milestones: [
      ["Project proposal", "Submit and get the proposal approved", "2026-10-12", "Completed"],
      ["Wireframes and design", "Finish app wireframes", "2026-11-15", "In Progress"],
      ["Working prototype", "Expense entry and summary working", "2027-01-20", "Upcoming"],
    ],
    docs: [["Project Proposal", "ExpenseTracker-Proposal.pdf", "Waiting for final feedback."]],
  },
};

/** Fills the built-in projects with sample data. Runs only once per browser. */
export function seedSampleData(): void {
  if (typeof window === "undefined") return;

  try {
    if (localStorage.getItem(SEED_FLAG)) return;

    const now = new Date().toISOString();

    const allMilestones = getMilestones();
    const newMilestones: Milestone[] = [];
    const invitations = getInvitations();
    const newInvitations: Invitation[] = [];
    const accounts = getAccounts();
    const newAccounts: UserAccount[] = [];

    for (const project of BUILT_IN_PROJECTS) {
      const seed = SEEDS[project.id];
      if (!seed) continue;

      // Tasks
      if (getTaskGroups(project.id).length === 0) {
        const groups: TaskGroup[] = seed.people.map((p) => ({
          id: createId(),
          projectId: project.id,
          name: p.name,
          role: p.role,
          tasks: p.tasks.map(([title, description, status]) => ({
            id: createId(),
            title,
            description,
            status,
          })),
        }));
        saveTaskGroups(project.id, groups);
      }

      // Team
      if (getTeamEntries(project.id).length === 0) {
        const team: TeamEntry[] = seed.people.map((p) => ({
          id: createId(),
          projectId: project.id,
          name: p.name,
          role: p.teamRole,
          dueDate: p.due,
          status: p.teamStatus,
        }));
        saveTeamEntries(project.id, team);
      }

      // Documents
      if (getDocEntries(project.id).length === 0) {
        const docs: DocEntry[] = seed.docs.map(([name, attachment, comment]) => ({
          id: createId(),
          projectId: project.id,
          name,
          kind: attachment ? "file" : "none",
          attachmentName: attachment,
          comment,
          addedAt: now,
        }));
        saveDocEntries(project.id, docs);
      }

      // Milestones
      if (!allMilestones.some((m) => m.projectId === project.id)) {
        seed.milestones.forEach(([title, description, dueDate, status]) =>
          newMilestones.push({
            id: createId(),
            projectId: project.id,
            title,
            description,
            dueDate,
            status,
          }),
        );
      }

      // Supervisor: accepted invitation + demo account
      const sup = project.supervisors?.[0];
      if (sup) {
        const invId = `seed-inv-${project.id}`;
        if (!invitations.some((i) => i.id === invId)) {
          newInvitations.push({
            id: invId,
            projectId: project.id,
            projectTitle: project.title,
            invitedEmail: sup.email,
            invitedRole: "supervisor",
            invitedBy: "demo",
            status: "Accepted",
            createdAt: now,
            respondedAt: now,
          });
        }

        const hasAccount = accounts.some(
          (a) =>
            a.email.toLowerCase() === sup.email.toLowerCase() &&
            a.role === "supervisor",
        );
        if (!hasAccount && !newAccounts.some((a) => a.email === sup.email)) {
          newAccounts.push({
            name: sup.name,
            email: sup.email,
            password: "123456",
            role: "supervisor",
          });
        }
      }
    }

    if (newMilestones.length) saveMilestones([...allMilestones, ...newMilestones]);
    if (newInvitations.length) saveInvitations([...invitations, ...newInvitations]);
    if (newAccounts.length) saveAccounts([...accounts, ...newAccounts]);

    localStorage.setItem(SEED_FLAG, "1");
  } catch {
    // ignore storage errors
  }
}