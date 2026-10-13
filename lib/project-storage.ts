
export type ProjectStatus = "Planning" | "In Progress" | "Completed";

export type TeamMemberRole =
  | "Leader"
  | "Member"
  | "Team Leader"
  | "Frontend Developer"
  | "Backend Developer"
  | "Full Stack Developer"
  | "UI/UX Designer"
  | "Documentation"
  | "Tester"
  | "Other";

export type TeamMember = {
  id: string;
  name: string;
  email: string;
  role: TeamMemberRole;
};

export type Supervisor = {
  id: string;
  name: string;
  email: string;
};

export type Project = {
  id: string;
  title: string;
  description: string;
  startDate?: string;
  expectedCompletionDate?: string;
  supervisorName?: string;
  supervisorEmail: string;
  supervisors?: Supervisor[];
  teamMembers: string[];
  members?: TeamMember[];
  joiningCode?: string;
  status: ProjectStatus;
  createdBy: string;
  createdAt: string;
};

export type Task = {
  id: string;
  projectId: string;
  title: string;
  description: string;
  assignedTo: string;
  assignedMemberId?: string;
  assignedMemberName?: string;
  assignedRole?: TeamMemberRole;
  dueDate: string;
  priority: "Low" | "Medium" | "High";
  status: "Pending" | "In Progress" | "Completed";
};

export type Milestone = {
  id: string;
  projectId: string;
  title: string;
  description: string;
  dueDate: string;
  status: "Upcoming" | "In Progress" | "Completed";
};

export type Meeting = {
  id: string;
  projectId: string;
  title: string;
  date: string;
  time: string;
  location: string;
  notes: string;
};

export type ProjectDocument = {
  id: string;
  projectId: string;
  title: string;
  description: string;
  fileName: string;
  uploadedBy: string;
  uploadedAt: string;
};

export type Feedback = {
  id: string;
  projectId: string;
  supervisorEmail: string;
  message: string;
  createdAt: string;
};

export type UserAccount = {
  name: string;
  email: string;
  password: string;
  role: "student" | "supervisor";
};

export type InvitationStatus = "Pending" | "Accepted" | "Declined";
export type InvitationRole = "student" | "supervisor";

export type Invitation = {
  id: string;
  projectId: string;
  projectTitle: string;
  invitedEmail: string;
  invitedRole: InvitationRole;
  invitedBy: string;
  status: InvitationStatus;
  createdAt: string;
  respondedAt: string | null;
};

const PROJECTS_KEY = "fyp-projects";
const TASKS_KEY = "fyp-tasks";
const MILESTONES_KEY = "fyp-milestones";
const MEETINGS_KEY = "fyp-meetings";
const DOCUMENTS_KEY = "fyp-documents";
const FEEDBACK_KEY = "fyp-feedback";
const ACCOUNTS_KEY = "fyp-accounts";
const INVITATIONS_KEY = "fyp-invitations";
const CURRENT_USER_KEY = "fyp-current-user";
const STORAGE_EVENT = "fyp-storage-updated";
const SELECTED_PROJECT_KEY = "fyp-selected-project";

export function createId(): string {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

export function createJoiningCode(): string {
  return createId().replace(/-/g, "").slice(0, 8).toUpperCase();
}

function readData<T>(key: string): T[] {
  if (typeof window === "undefined") return [];

  try {
    const savedData = localStorage.getItem(key);
    return savedData ? (JSON.parse(savedData) as T[]) : [];
  } catch {
    return [];
  }
}

function saveData<T>(key: string, data: T[]): void {
  if (typeof window === "undefined") return;

  localStorage.setItem(key, JSON.stringify(data));
  window.dispatchEvent(new Event(STORAGE_EVENT));
}


export function getCurrentUser(): Partial<UserAccount> | null {
  if (typeof window === "undefined") return null;

  try {
    // Read the same keys used by the login page.
    const email = localStorage.getItem("fyp-user-email");
    const name = localStorage.getItem("fyp-user-name");
    const role = localStorage.getItem("fyp-user-role");

    if (email && name) {
      return {
        name,
        email,
        password: "",
        role:
          role === "student" || role === "supervisor"
            ? role
            : "student",
      };
    }

    // Support accounts saved as a complete user object.
    const directUser = localStorage.getItem(CURRENT_USER_KEY);

    if (directUser) {
      const parsed = JSON.parse(directUser);

      if (
        parsed &&
        typeof parsed === "object" &&
        parsed.name &&
        parsed.email
      ) {
        return parsed as Partial<UserAccount>;
      }
    }

    return null;
  } catch {
    return null;
  }
}


export function setCurrentUser(
  user: Partial<UserAccount> | null,
): void {
  if (typeof window === "undefined") return;

  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
  }

  window.dispatchEvent(new Event(STORAGE_EVENT));
}

export const getProjects = () => readData<Project>(PROJECTS_KEY);

export const saveProjects = (data: Project[]) =>
  saveData(PROJECTS_KEY, data);

/**
 * Find a project by its joining code.
 */
export function getProjectByJoiningCode(
  code: string,
): Project | undefined {
  const normalizedCode = code.trim().toUpperCase();

  if (!normalizedCode) return undefined;

  return getProjects().find(
    (project) =>
      project.joiningCode?.trim().toUpperCase() === normalizedCode,
  );
}

/**
 * Find a project using BOTH its title and joining code.
 */
export function findExistingProject(
  title: string,
  code: string,
): Project | undefined {
  const normalizedTitle = title.trim().toLowerCase();
  const normalizedCode = code.trim().toUpperCase();

  if (!normalizedTitle || !normalizedCode) {
    return undefined;
  }

  return getProjects().find(
    (project) =>
      project.title.trim().toLowerCase() === normalizedTitle &&
      project.joiningCode?.trim().toUpperCase() === normalizedCode,
  );
}

export const getTasks = () => readData<Task>(TASKS_KEY);
export const saveTasks = (data: Task[]) => saveData(TASKS_KEY, data);

export const getMilestones = () => readData<Milestone>(MILESTONES_KEY);
export const saveMilestones = (data: Milestone[]) =>
  saveData(MILESTONES_KEY, data);

export const getMeetings = () => readData<Meeting>(MEETINGS_KEY);
export const saveMeetings = (data: Meeting[]) =>
  saveData(MEETINGS_KEY, data);

export const getDocuments = () =>
  readData<ProjectDocument>(DOCUMENTS_KEY);
export const saveDocuments = (data: ProjectDocument[]) =>
  saveData(DOCUMENTS_KEY, data);

export const getFeedback = () => readData<Feedback>(FEEDBACK_KEY);
export const saveFeedback = (data: Feedback[]) =>
  saveData(FEEDBACK_KEY, data);

export const getAccounts = () => readData<UserAccount>(ACCOUNTS_KEY);
export const saveAccounts = (data: UserAccount[]) =>
  saveData(ACCOUNTS_KEY, data);

export const getInvitations = () => readData<Invitation>(INVITATIONS_KEY);
export const saveInvitations = (data: Invitation[]) =>
  saveData(INVITATIONS_KEY, data);

export function createInvitation(
  invitation: Omit<
    Invitation,
    "id" | "status" | "createdAt" | "respondedAt"
  >,
): Invitation {
  const invitations = getInvitations();

  const existingInvitation = invitations.find(
    (item) =>
      item.projectId === invitation.projectId &&
      item.invitedEmail.toLowerCase() ===
        invitation.invitedEmail.toLowerCase(),
  );

  if (existingInvitation) return existingInvitation;

  const newInvitation: Invitation = {
    ...invitation,
    id: createId(),
    status: "Pending",
    createdAt: new Date().toISOString(),
    respondedAt: null,
  };

  saveInvitations([...invitations, newInvitation]);

  return newInvitation;
}

export function respondToInvitation(
  invitationId: string,
  status: Exclude<InvitationStatus, "Pending">,
): Invitation | undefined {
  const invitations = getInvitations();

  const updatedInvitation = invitations.find(
    (invitation) => invitation.id === invitationId,
  );

  if (!updatedInvitation) return undefined;

  const updated: Invitation = {
    ...updatedInvitation,
    status,
    respondedAt: new Date().toISOString(),
  };

  saveInvitations(
    invitations.map((invitation) =>
      invitation.id === invitationId ? updated : invitation,
    ),
  );

  return updated;
}

export function setSelectedProject(projectId: string): void {
  if (typeof window === "undefined") return;

  localStorage.setItem(SELECTED_PROJECT_KEY, projectId);
  window.dispatchEvent(new Event(STORAGE_EVENT));
}

export function getSelectedProjectId(): string | null {
  if (typeof window === "undefined") return null;

  return localStorage.getItem(SELECTED_PROJECT_KEY);
}

export function getSelectedProject(): Project | undefined {
  const projectId = getSelectedProjectId();

  if (!projectId) return undefined;

  return getProjects().find((project) => project.id === projectId);
}
