"use client";

import {
  useEffect,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";

import {
  createId,
  createInvitation,
  getCurrentUser,
  getProjects,
  getTasks,
  saveProjects,
  setSelectedProject,
  type Project,
  type Supervisor,
  type Task,
  type TeamMember,
} from "@/lib/project-storage";
import { BUILT_IN_PROJECTS } from "@/lib/sample-projects";
import { seedSampleData } from "@/lib/sample-seed"; 

type View = "projects" | "create" | "join";
type MemberRole = "Leader" | "Member";

type MemberForm = {
  id: string;
  name: string;
  email: string;
  role: MemberRole;
};

type SupervisorForm = {
  id: string;
  name: string;
  email: string;
};

const inputClass =
  "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-600/10";

const buttonPrimary =
  "inline-flex items-center justify-center rounded-xl bg-teal-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-800 focus:outline-none focus:ring-4 focus:ring-teal-700/20 disabled:cursor-not-allowed disabled:opacity-50";

const buttonSecondary =
  "inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50";

const DEFAULT_TITLE = "Student Attendance Management System";
const DEFAULT_DESCRIPTION =
  "A web application to manage student attendance, track records, and generate reports.";
const DEFAULT_START_DATE = "2026-11-01";
const DEFAULT_COMPLETION_DATE = "2027-04-30";


export function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block min-w-0 space-y-2">
      <span className="block text-sm font-semibold text-gray-700">{label}</span>
      {children}
    </label>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    Planning: "bg-violet-50 text-violet-700 ring-violet-200",
    "In Progress": "bg-blue-50 text-blue-700 ring-blue-200",
    Completed: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${
        colors[status] ?? "bg-gray-100 text-gray-600 ring-gray-200"
      }`}
    >
      {status}
    </span>
  );
}

function makeMember(
  name = "",
  email = "",
  role: MemberRole = "Member",
): MemberForm {
  return { id: createId(), name, email, role };
}

function makeSupervisor(): SupervisorForm {
  return { id: createId(), name: "", email: "" };
}

function getDefaultMember(): MemberForm {
  const currentUser = getCurrentUser();
  return makeMember(
    currentUser?.name ?? "",
    currentUser?.email ?? "",
    "Leader",
  );
}

function getProjectSupervisors(project: Project): Supervisor[] {
  if (project.supervisors?.length) {
    return project.supervisors;
  }

  if (project.supervisorName || project.supervisorEmail) {
    return [
      {
        id: `legacy-${project.id}`,
        name: project.supervisorName ?? "",
        email: project.supervisorEmail ?? "",
      },
    ];
  }

  return [];
}

export default function ProjectManagementPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  const [view, setView] = useState<View>("projects");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">(
    "success",
  );

  // Create form
  const [projectTitle, setProjectTitle] = useState(DEFAULT_TITLE);
  const [projectDescription, setProjectDescription] =
    useState(DEFAULT_DESCRIPTION);
  const [joiningCode, setJoiningCode] = useState("FYP-2026");
  const [startDate, setStartDate] = useState(DEFAULT_START_DATE);
  const [expectedCompletionDate, setExpectedCompletionDate] = useState(
    DEFAULT_COMPLETION_DATE,
  );
  const [memberCount, setMemberCount] = useState(1);
  const [supervisorCount, setSupervisorCount] = useState(1);
  const [members, setMembers] = useState<MemberForm[]>([makeMember()]);
  const [supervisors, setSupervisors] = useState<SupervisorForm[]>([
    makeSupervisor(),
  ]);

  // Join form
  const [joinTitle, setJoinTitle] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    seedSampleData();       
    const savedProjects = getProjects();

    // Merge built-in demo projects with saved user projects
    const allProjectsMap = new Map<string, Project>();
    BUILT_IN_PROJECTS.forEach((p) => allProjectsMap.set(p.id, p));
    savedProjects.forEach((p) => allProjectsMap.set(p.id, p));

    const mergedProjects = Array.from(allProjectsMap.values());
    saveProjects(mergedProjects);

    setProjects(mergedProjects);
    setTasks(getTasks());

    const params = new URLSearchParams(window.location.search);

    if (params.get("view") === "create") {
      resetProjectForm();
      setView("create");
    } else if (params.get("mode") === "join") {
      setView("join");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function notify(text: string, type: "success" | "error" = "success") {
    setMessage(text);
    setMessageType(type);
  }

  function resetProjectForm() {
    setProjectTitle(DEFAULT_TITLE);
    setProjectDescription(DEFAULT_DESCRIPTION);
    setJoiningCode("FYP-2026");
    setStartDate(DEFAULT_START_DATE);
    setExpectedCompletionDate(DEFAULT_COMPLETION_DATE);
    setMemberCount(1);
    setSupervisorCount(1);
    setMembers([getDefaultMember()]);
    setSupervisors([makeSupervisor()]);
  }

  function openProject(projectId: string) {
    setSelectedProject(projectId);
    window.location.href = "/student/project";
  }

  function viewSampleProject(projectId: string) {
    setSelectedProject(projectId);
    window.location.href = "/student/project";
  }

  function openJoinForm() {
    setJoinTitle("");
    setJoinCode("");
    setMessage("");
    setView("join");
    window.history.replaceState(null, "", "/project-management?mode=join");
  }

  function openCreateForm() {
    resetProjectForm();
    setMessage("");
    setView("create");
    window.history.replaceState(null, "", "/project-management?view=create");
  }

  function returnToProjects() {
    setMessage("");
    window.location.href = "/student/dashboard";
  }

  function changeMemberCount(value: number) {
    const count = Math.max(1, Math.min(10, value || 1));
    setMemberCount(count);
    setMembers((prev) =>
      count > prev.length
        ? [
            ...prev,
            ...Array.from({ length: count - prev.length }, () =>
              makeMember(),
            ),
          ]
        : prev.slice(0, count),
    );
  }

  function changeSupervisorCount(value: number) {
    const count = Math.max(1, Math.min(5, value || 1));
    setSupervisorCount(count);
    setSupervisors((prev) =>
      count > prev.length
        ? [
            ...prev,
            ...Array.from({ length: count - prev.length }, () =>
              makeSupervisor(),
            ),
          ]
        : prev.slice(0, count),
    );
  }

  function updateMember(id: string, patch: Partial<MemberForm>) {
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...patch } : m)),
    );
  }

  function updateSupervisor(id: string, patch: Partial<SupervisorForm>) {
    setSupervisors((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...patch } : s)),
    );
  }
function goToProjectPage(projectId: string) {
  setSelectedProject(projectId);
  setRedirecting(true);
  window.scrollTo({ top: 0, behavior: "smooth" });

  setTimeout(() => {
    window.location.href = "/student/project";
  }, 1500);
}
  function handleCreateSubmit(e: FormEvent<HTMLFormElement>) {
  e.preventDefault();
  if (redirecting) return;

  const title = projectTitle.trim();
  const code = joiningCode.trim();

  if (!title || !code) {
    notify("Project title and joining code are required.", "error");
    return;
  }

  const duplicate = projects.find(
    (p) => p.joiningCode?.trim().toLowerCase() === code.toLowerCase(),
  );
  if (duplicate) {
    notify(
      "This joining code is already used. Please choose a different one.",
      "error",
    );
    return;
  }

  const cleanMembers: TeamMember[] = members
    .filter((m) => m.name.trim() && m.email.trim())
    .map((m) => ({
      id: m.id,
      name: m.name.trim(),
      email: m.email.trim(),
      role: m.role,
    }));

  const cleanSupervisors: Supervisor[] = supervisors
    .filter((s) => s.name.trim() && s.email.trim())
    .map((s) => ({
      id: s.id,
      name: s.name.trim(),
      email: s.email.trim(),
    }));

  if (cleanMembers.length === 0) {
    notify("Add at least one team member with a name and email.", "error");
    return;
  }

  const currentUser = getCurrentUser();

  const newProject: Project = {
    id: createId(),
    title,
    description: projectDescription.trim(),
    joiningCode: code,
    status: "Planning",
    createdBy: currentUser?.email ?? currentUser?.name ?? "student",
    createdAt: new Date().toISOString(),
    startDate,
    expectedCompletionDate,
    supervisorName: cleanSupervisors[0]?.name ?? "",
    supervisorEmail: cleanSupervisors[0]?.email ?? "",
    supervisors: cleanSupervisors,
    teamMembers: cleanMembers.map((m) => m.email),
    members: cleanMembers,
  };

  const updated = [...getProjects(), newProject];
saveProjects(updated);
setProjects(updated);

// Send a request to every supervisor email entered in the form
cleanSupervisors.forEach((s) =>
  createInvitation({
    projectId: newProject.id,
    projectTitle: newProject.title,
    invitedEmail: s.email,
    invitedRole: "supervisor",
    invitedBy: currentUser?.email ?? currentUser?.name ?? "student",
  }),
);

notify(
  cleanSupervisors.length > 0
    ? "Project created successfully! Your supervisor request has been sent."
    : "Project created successfully! Opening your project...",
  "success",
);
  goToProjectPage(newProject.id);
}

  function handleJoinSubmit(e: FormEvent<HTMLFormElement>) {
  e.preventDefault();
  if (redirecting) return;

  const title = joinTitle.trim().toLowerCase();
  const code = joinCode.trim().toLowerCase();

  const match = projects.find(
    (p) =>
      p.title.trim().toLowerCase() === title &&
      (p.joiningCode ?? "").trim().toLowerCase() === code,
  );

  if (!match) {
    notify("No project found with that title and joining code.", "error");
    return;
  }

  // Add the current user to the team (skip the built-in demo projects)
  const currentUser = getCurrentUser();
  const email = currentUser?.email?.trim();

  if (email && match.createdBy !== "demo") {
    const alreadyMember = match.teamMembers?.some(
      (m) => m.toLowerCase() === email.toLowerCase(),
    );

    if (!alreadyMember) {
      const updatedProject: Project = {
        ...match,
        teamMembers: [...(match.teamMembers ?? []), email],
        members: [
          ...(match.members ?? []),
          {
            id: createId(),
            name: currentUser?.name ?? email,
            email,
            role: "Member",
          },
        ],
      };

      const updatedList = getProjects().map((p) =>
        p.id === match.id ? updatedProject : p,
      );
      saveProjects(updatedList);
      setProjects(updatedList);
    }
  }

  notify(`Joined "${match.title}" successfully! Opening project...`, "success");
  goToProjectPage(match.id);
}

  return (
    <main className="min-h-screen bg-[#F4F7F8] text-gray-900">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {view === "projects" && (
          <header className="mb-7 flex flex-col gap-5 rounded-3xl bg-gradient-to-br from-[#102C35] via-[#14515A] to-[#117D7B] p-6 text-white shadow-lg sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-200">
                FYP Management Platform
              </p>
              <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                Your Projects
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/75">
                Organize your team, tasks, milestones, and project documents
                in one place.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={openJoinForm}
                className="rounded-xl border border-white/30 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
              >
                Join Existing Project
              </button>
              <button type="submit" className={buttonPrimary} disabled={redirecting}>
  {redirecting ? "Opening..." : "Create Project"}
</button>
            </div>
          </header>
        )}

        {message && (
          <div
            role={messageType === "error" ? "alert" : "status"}
            className={`mb-6 flex items-start justify-between gap-4 rounded-xl border px-4 py-3 text-sm ${
              messageType === "error"
                ? "border-red-200 bg-red-50 text-red-800"
                : "border-emerald-200 bg-emerald-50 text-emerald-800"
            }`}
          >
            <span>{message}</span>
            <button
              type="button"
              onClick={() => setMessage("")}
              aria-label="Dismiss message"
              className="font-bold"
            >
              ×
            </button>
          </div>
        )}

        {/* ---------------- PROJECT LIST ---------------- */}
        {view === "projects" && (
          <section>
            <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Project workspace
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Open a project to manage its activities.
                </p>
              </div>
              <span className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-gray-600 ring-1 ring-gray-200">
                {projects.length}{" "}
                {projects.length === 1 ? "project" : "projects"}
              </span>
            </div>

            {projects.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center shadow-sm">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-50 text-3xl text-teal-800">
                  ▦
                </div>
                <h2 className="mt-5 text-xl font-bold text-gray-900">
                  Start your FYP workspace
                </h2>
                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                  Create a project and add your team and supervisors to begin
                  organizing your work.
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <button
                    type="button"
                    onClick={openCreateForm}
                    className={buttonPrimary}
                  >
                    + Create Project
                  </button>
                  <button
                    type="button"
                    onClick={openJoinForm}
                    className={buttonSecondary}
                  >
                    Join Existing Project
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {projects.map((project) => {
                  const projectSupervisors = getProjectSupervisors(project);
                  const memberTotal =
                    project.members?.length ??
                    project.teamMembers?.length ??
                    0;
                  const taskTotal = tasks.filter(
                    (task) => task.projectId === project.id,
                  ).length;

                  return (
                    <article
                      key={project.id}
                      onClick={() => openProject(project.id)}
                      className="group cursor-pointer overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-teal-400 hover:shadow-xl"
                    >
                      <div className="h-1.5 bg-gradient-to-r from-teal-700 to-cyan-400" />
                      <div className="p-5">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-xs font-bold uppercase tracking-wider text-teal-700">
                              FYP workspace
                            </p>
                            <h2 className="mt-2 break-words text-lg font-bold text-gray-900 transition-colors group-hover:text-teal-700">
                              {project.title}
                            </h2>
                          </div>
                          <StatusBadge status={project.status} />
                        </div>

                        <p className="mt-3 line-clamp-3 min-h-[4rem] whitespace-pre-wrap text-sm leading-6 text-gray-600">
                          {project.description || "No description provided."}
                        </p>

                        <div className="mt-4 space-y-1 text-xs text-gray-500">
                          <p>Start: {project.startDate || "Not set"}</p>
                          <p>
                            Expected completion:{" "}
                            {project.expectedCompletionDate || "Not set"}
                          </p>
                        </div>

                        <div className="mt-5 grid grid-cols-3 gap-2">
                          <div className="rounded-xl bg-gray-50 p-3">
                            <p className="text-xs text-gray-500">Members</p>
                            <p className="mt-1 text-xl font-bold text-gray-900">
                              {memberTotal}
                            </p>
                          </div>
                          <div className="rounded-xl bg-gray-50 p-3">
                            <p className="text-xs text-gray-500">
                              Supervisors
                            </p>
                            <p className="mt-1 text-xl font-bold text-gray-900">
                              {projectSupervisors.length}
                            </p>
                          </div>
                          <div className="rounded-xl bg-gray-50 p-3">
                            <p className="text-xs text-gray-500">Tasks</p>
                            <p className="mt-1 text-xl font-bold text-gray-900">
                              {taskTotal}
                            </p>
                          </div>
                        </div>

                        <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-3 text-xs font-semibold text-teal-700">
                          <span>Open Project Overview</span>
                          <span>→</span>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {/* ---------------- CREATE PROJECT ---------------- */}
        {view === "create" && (
          <section className="mx-auto max-w-3xl">
            <form
              onSubmit={handleCreateSubmit}
              className="space-y-6 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8"
            >
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Create Project
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Fill in the details of your final-year project.
                </p>
              </div>

              <Field label="Project Title">
                <input
                  className={inputClass}
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  required
                />
              </Field>

              <Field label="Description">
                <textarea
                  className={`${inputClass} min-h-[110px]`}
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                />
              </Field>

              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Start Date">
                  <input
                    type="date"
                    className={inputClass}
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </Field>
                <Field label="Expected Completion Date">
                  <input
                    type="date"
                    className={inputClass}
                    value={expectedCompletionDate}
                    onChange={(e) => setExpectedCompletionDate(e.target.value)}
                  />
                </Field>
              </div>

              <Field label="Joining Code (share this with your team)">
                <input
                  className={inputClass}
                  value={joiningCode}
                  onChange={(e) => setJoiningCode(e.target.value)}
                  required
                />
              </Field>

              {/* Members */}
              <div className="space-y-4 rounded-2xl border border-gray-200 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="text-lg font-bold text-gray-900">
                    Team Members
                  </h3>
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-600">Count</label>
                    <input
                      type="number"
                      min={1}
                      max={10}
                      className={`${inputClass} w-20`}
                      value={memberCount}
                      onChange={(e) =>
                        changeMemberCount(Number(e.target.value))
                      }
                    />
                  </div>
                </div>

                {members.map((member, index) => (
                  <div
                    key={member.id}
                    className="grid gap-3 rounded-xl bg-gray-50 p-3 sm:grid-cols-3"
                  >
                    <input
                      className={inputClass}
                      placeholder={`Member ${index + 1} name`}
                      value={member.name}
                      onChange={(e) =>
                        updateMember(member.id, { name: e.target.value })
                      }
                    />
                    <input
                      type="email"
                      className={inputClass}
                      placeholder="Email"
                      value={member.email}
                      onChange={(e) =>
                        updateMember(member.id, { email: e.target.value })
                      }
                    />
                    <select
                      className={inputClass}
                      value={member.role}
                      onChange={(e) =>
                        updateMember(member.id, {
                          role: e.target.value as MemberRole,
                        })
                      }
                    >
                      <option value="Leader">Leader</option>
                      <option value="Member">Member</option>
                    </select>
                  </div>
                ))}
              </div>

              {/* Supervisors */}
              <div className="space-y-4 rounded-2xl border border-gray-200 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="text-lg font-bold text-gray-900">
                    Supervisors
                  </h3>
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-600">Count</label>
                    <input
                      type="number"
                      min={1}
                      max={5}
                      className={`${inputClass} w-20`}
                      value={supervisorCount}
                      onChange={(e) =>
                        changeSupervisorCount(Number(e.target.value))
                      }
                    />
                  </div>
                </div>

                {supervisors.map((supervisor, index) => (
                  <div
                    key={supervisor.id}
                    className="grid gap-3 rounded-xl bg-gray-50 p-3 sm:grid-cols-2"
                  >
                    <input
                      className={inputClass}
                      placeholder={`Supervisor ${index + 1} name`}
                      value={supervisor.name}
                      onChange={(e) =>
                        updateSupervisor(supervisor.id, {
                          name: e.target.value,
                        })
                      }
                    />
                    <input
                      type="email"
                      className={inputClass}
                      placeholder="Email"
                      value={supervisor.email}
                      onChange={(e) =>
                        updateSupervisor(supervisor.id, {
                          email: e.target.value,
                        })
                      }
                    />
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-3">
                <button type="submit" className={buttonPrimary}>
                  Create Project
                </button>
                <button
                  type="button"
                  onClick={returnToProjects}
                  className={buttonSecondary}
                >
                  Cancel
                </button>
              </div>
            </form>
          </section>
        )}

        {/* ---------------- JOIN PROJECT ---------------- */}
        {view === "join" && (
          <section className="mx-auto max-w-2xl space-y-6">
            <form
              onSubmit={handleJoinSubmit}
              className="space-y-5 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8"
            >
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Join Existing Project
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Enter the title and joining code shared by your project
                  leader.
                </p>
              </div>

              <Field label="Project Title">
                <input
                  className={inputClass}
                  value={joinTitle}
                  onChange={(e) => setJoinTitle(e.target.value)}
                  placeholder="e.g. Smart Attendance System"
                  required
                />
              </Field>

              <Field label="Joining Code">
                <input
                  className={inputClass}
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value)}
                  placeholder="e.g. ATTEND2026"
                  required
                />
              </Field>

              <div className="flex flex-wrap gap-3">
               <button type="submit" className={buttonPrimary} disabled={redirecting}>
  {redirecting ? "Opening..." : "Join Project"}
</button>
                <button
                  type="button"
                  onClick={returnToProjects}
                  className={buttonSecondary}
                >
                  Cancel
                </button>
              </div>
            </form>

            {/* Sample projects for quick testing */}
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
              <h3 className="text-lg font-bold text-gray-900">
                Sample projects
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Want to explore first? Open a sample project directly.
              </p>

              <div className="mt-4 space-y-3">
                {BUILT_IN_PROJECTS.map((sample) => (
                  <div
                    key={sample.id}
                    className="flex flex-col gap-3 rounded-2xl border border-gray-200 p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <p className="font-bold text-gray-900">{sample.title}</p>
                      <p className="mt-0.5 text-xs text-gray-500">
                        Code:{" "}
                        <span className="font-mono font-semibold text-teal-700">
                          {sample.joiningCode}
                        </span>
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setJoinTitle(sample.title);
                          setJoinCode(sample.joiningCode ?? "");
                        }}
                        className={buttonSecondary}
                      >
                        Fill form
                      </button>
                      <button
                        type="button"
                        onClick={() => viewSampleProject(sample.id)}
                        className={buttonPrimary}
                      >
                        View sample project
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}