"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  getCurrentUser,
  getProjects,
  getTasks,
  getSelectedProjectId,
  type Project,
  type Task,
} from "@/lib/project-storage";
import { BUILT_IN_PROJECTS } from "@/lib/sample-projects";

const studentLinks = [
  { label: "Student Home", href: "/student/dashboard", icon: "⌂" },
  { label: "Project Overview", href: "/student/project", icon: "▦" },
  { label: "Tasks", href: "/project/tasks", icon: "✓" },
  { label: "Milestones", href: "/project/milestones", icon: "◆" },
  { label: "Team", href: "/project/team", icon: "♧" },
  { label: "Documentation", href: "/project/documentation", icon: "▤" },
  { label: "Meetings", href: "/project/meetings", icon: "◷" },
  { label: "Feedback", href: "/project/feedback", icon: "✎" },
  { label: "Progress", href: "/project/progress", icon: "↗" },
  { label: "AI Assistant", href: "/project/ai-assistant", icon: "AI" },
];

function getInitials(name?: string, fallback = "S") {
  if (!name) return fallback;
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length === 0) return fallback;
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function StudentProject() {
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const savedProjects = getProjects();

    const allProjectsMap = new Map<string, Project>();
    BUILT_IN_PROJECTS.forEach((p) => allProjectsMap.set(p.id, p));
    savedProjects.forEach((p) => allProjectsMap.set(p.id, p));

    const allProjects = Array.from(allProjectsMap.values());
    const selectedId = getSelectedProjectId();
    const currentUser = getCurrentUser();

    let foundProject: Project | undefined;

    if (selectedId) {
      foundProject = allProjects.find((p) => p.id === selectedId);
    }

    if (!foundProject && allProjects.length > 0) {
      const email = currentUser?.email?.toLowerCase();
      const name = currentUser?.name?.toLowerCase();

      foundProject = allProjects
        .filter((item) => {
          const createdBy = item.createdBy?.toLowerCase();
          const isCreator =
            (!!email && createdBy === email) ||
            (!!name && createdBy === name);
          const isMember = item.teamMembers?.some(
            (m) => !!email && m.toLowerCase() === email,
          );
          return isCreator || isMember;
        })
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )[0];
    }

    const activeProject = foundProject || BUILT_IN_PROJECTS[0];
    setProject(activeProject);

    setTasks(getTasks().filter((t) => t.projectId === activeProject.id));
  }, []);

  if (!project) return null;

  const supervisors = project.supervisors?.length
    ? project.supervisors
    : [
        {
          id: "fallback-sup-1",
          name: project.supervisorName || "Dr. Ahmed",
          email: project.supervisorEmail || "ahmed@example.com",
        },
      ];

  const members = project.members?.length
    ? project.members
    : [
        {
          id: "m1",
          name: "Ali Ahmed",
          email: "ali@example.com",
          role: "Leader" as const,
        },
        {
          id: "m2",
          name: "Sara Khan",
          email: "sara@example.com",
          role: "Member" as const,
        },
      ];

  return (
    <main className="min-h-screen bg-[#F3F4F6] text-[#0C2430] lg:flex">
      {/* Sidebar Navigation */}
      <aside className="flex w-full shrink-0 flex-col bg-[#0C2430] text-white lg:sticky lg:top-0 lg:h-screen lg:w-60 border-r border-white/10 p-3 justify-between">
        <div className="flex flex-col h-full overflow-hidden">
          <div className="border-b border-white/10 pb-2 mb-2 px-1">
            <Link
              href="/student/dashboard"
              className="text-base font-extrabold tracking-tight"
            >
              FYP <span className="text-[#7FD6CC]">Management</span>
            </Link>
            <p className="text-[10px] text-white truncate font-mono">
  Student Portal
</p>
          </div>

          <nav
            aria-label="Student navigation"
            className="flex gap-1 overflow-x-auto lg:flex-1 lg:flex-col lg:overflow-y-auto space-y-1 pr-1"
          >
            {studentLinks.map((item) => {
              const active = item.href === "/student/project";

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`group flex shrink-0 items-center gap-2 rounded-lg border px-2.5 py-1.5 text-[11px] font-semibold transition-all duration-200 ${
                    active
                      ? "border-[#7FD6CC] bg-[#176B73] text-white shadow-sm"
                      : "border-[#176B73]/40 bg-[#123342] text-slate-300 hover:border-[#7FD6CC] hover:bg-[#7FD6CC] hover:text-[#0C2430]"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-xs font-bold transition-transform duration-200 group-hover:scale-105 ${
                      active
                        ? "bg-white/15 text-[#7FD6CC]"
                        : "bg-[#0C2430] text-[#7FD6CC] group-hover:bg-[#0C2430] group-hover:text-white"
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Current project card at the bottom */}
        <div className="mt-2 pt-2 border-t border-white/10 shrink-0">
          <div className="group flex items-center gap-2 rounded-lg border border-[#176B73]/40 bg-[#123342] p-2 transition-all duration-200 hover:border-[#7FD6CC] hover:bg-[#7FD6CC] hover:text-[#0C2430]">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#176B73] text-[10px] font-black text-[#7FD6CC] group-hover:bg-[#0C2430] group-hover:text-white">
              {getInitials(project.title, "P")}
            </div>
            <div className="min-w-0">
              <p className="text-[8px] font-bold uppercase tracking-widest text-slate-400 group-hover:text-[#0C2430]">
                Current Project
              </p>
              <p className="truncate text-[11px] font-bold text-white group-hover:text-[#0C2430]">
                {project.title}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="min-w-0 flex-1 px-4 py-7 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-6xl space-y-8">
          {/* Header */}
          <header className="mb-2">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#176B73]">
               STUDENT PORTAL / PROJECT
            </p>
            <div className="mt-3">
              <h1 className="text-4xl font-extrabold tracking-tight text-[#0C2430] sm:text-5xl">
                My Project<span className="text-[#176B73]">.</span>
              </h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
                Everything about your final-year project, all in one place.
              </p>
            </div>
          </header>

          {/* 1. Project Overview */}
          <section className="group relative overflow-hidden rounded-3xl border border-[#176B73]/40 bg-[#0C2430] p-8 text-white shadow-2xl backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-[#7FD6CC] hover:bg-[#0F2D3C] hover:shadow-2xl">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <span className="rounded-full border border-[#7FD6CC]/30 bg-[#176B73] px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#7FD6CC] transition-colors duration-300 group-hover:bg-[#7FD6CC] group-hover:text-[#0C2430]">
                  {project.status || "IN PROGRESS"}
                </span>
                <span className="text-xs font-medium text-slate-300">
                  Joining Code:{" "}
                  <strong className="font-mono text-[#7FD6CC]">
                    {project.joiningCode || "ATTEND2026"}
                  </strong>
                </span>
              </div>

              <div className="flex items-center gap-4 rounded-2xl border border-[#176B73]/30 bg-[#176B73]/20 px-5 py-3 backdrop-blur-sm transition-all duration-300 group-hover:border-[#7FD6CC]/40">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Completion Health
                  </p>
                  <p className="text-xl font-extrabold text-[#7FD6CC]">78%</p>
                </div>
                <div className="h-2.5 w-28 overflow-hidden rounded-full bg-[#0C2430]">
                  <div className="h-full w-[78%] rounded-full bg-gradient-to-r from-[#176B73] to-[#7FD6CC]" />
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h2 className="text-3xl font-black tracking-tight text-white transition-colors duration-300 group-hover:text-[#7FD6CC] sm:text-4xl">
                {project.title}
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-300">
                {project.description}
              </p>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4 border-t border-[#176B73]/20 pt-6 sm:grid-cols-4">
              <div>
                <p className="text-xs font-medium text-slate-400">Start Date</p>
                <p className="mt-1 font-mono text-sm font-bold text-white">
                  {project.startDate || "2026-10-01"}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-400">
                  Target Completion
                </p>
                <p className="mt-1 font-mono text-sm font-bold text-white">
                  {project.expectedCompletionDate || "2027-03-31"}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-400">Created By</p>
                <p className="mt-1 truncate text-sm font-semibold text-[#7FD6CC]">
                  {project.createdBy || "demo"}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-400">
                  Access Tier
                </p>
                <p className="mt-1 text-sm font-semibold text-white">
                  Student{" "}
                  <span className="rounded bg-[#176B73]/40 px-1.5 py-0.5 text-xs text-[#7FD6CC]">
                    Portal Authorized
                  </span>
                </p>
              </div>
            </div>
          </section>

          {/* 2. Team Members */}
          <section className="rounded-3xl border-2 border-[#176B73]/30 bg-[#0C2430] p-6 text-white shadow-xl sm:p-8">
            <div className="mb-6 flex items-center gap-2 border-b border-[#176B73]/20 pb-4">
              <h2 className="text-2xl font-extrabold tracking-tight text-white">
                Team Members
              </h2>
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#176B73] text-sm font-bold text-[#7FD6CC]">
                {members.length}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {members.map((member, idx) => {
                const memberTasksCount =
                  tasks.filter(
                    (t) =>
                      t.assignedTo?.toLowerCase() ===
                      member.email.toLowerCase(),
                  ).length || (idx === 0 ? 8 : 5);

                return (
                  <div
                    key={member.id || idx}
                    className="group relative flex flex-col justify-between rounded-2xl border border-[#176B73]/30 bg-[#123342] p-5 shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-[#7FD6CC] hover:bg-[#163D4F] hover:shadow-xl"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#176B73] text-lg font-black text-[#7FD6CC] shadow-inner transition-transform duration-300 group-hover:scale-105">
                          {getInitials(member.name, "M")}
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-white transition-colors duration-200 group-hover:text-[#7FD6CC]">
                            {member.name}
                          </h3>
                          <span className="mt-0.5 inline-block rounded-md bg-[#176B73]/40 px-2 py-0.5 text-[11px] font-semibold text-[#7FD6CC]">
                            {member.role || "Member"}
                          </span>
                        </div>
                      </div>

                      <span className="rounded-md border border-[#176B73]/30 bg-[#0C2430] px-2.5 py-1 text-xs font-medium text-slate-300">
                        <strong className="text-[#7FD6CC]">
                          {memberTasksCount}
                        </strong>{" "}
                        Tasks
                      </span>
                    </div>

                    <div className="mt-6 border-t border-[#176B73]/20 pt-3">
                      <p className="font-mono text-xs text-slate-300 transition-colors duration-200 group-hover:text-white">
                        {member.email}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* 3. Supervisors */}
          <section className="rounded-3xl border-2 border-[#176B73]/30 bg-[#0C2430] p-6 text-white shadow-xl sm:p-8">
            <div className="mb-6 flex items-center justify-between border-b border-[#176B73]/20 pb-4">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-extrabold tracking-tight text-white">
                  Project Supervisors & Mentors
                </h2>
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#176B73] text-sm font-bold text-[#7FD6CC]">
                  {supervisors.length}
                </span>
              </div>
              <span className="text-xs text-slate-400">
                Assigned Faculty Officers
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {supervisors.map((supervisor, idx) => (
                <div
                  key={supervisor.id || idx}
                  className="group flex flex-col justify-between rounded-2xl border border-[#176B73]/30 bg-[#123342] p-5 shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-[#7FD6CC] hover:bg-[#163D4F] hover:shadow-xl"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#176B73] text-lg font-black text-[#7FD6CC] shadow-inner transition-transform duration-300 group-hover:scale-105">
                        {getInitials(supervisor.name, "S")}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white transition-colors duration-200 group-hover:text-[#7FD6CC]">
                          {supervisor.name || "Supervisor"}
                        </h3>
                        <p className="text-xs font-medium text-slate-400">
                          Computer Science Department
                        </p>
                      </div>
                    </div>

                    <span className="rounded-full border border-[#7FD6CC]/30 bg-[#176B73]/30 px-3 py-1 text-xs font-semibold text-[#7FD6CC]">
                      {idx === 0 ? "Primary Supervisor" : "Supervisor"}
                    </span>
                  </div>

                  <div className="mt-6 border-t border-[#176B73]/20 pt-3">
                    <p className="font-mono text-xs font-medium text-[#7FD6CC]">
                      {supervisor.email}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}