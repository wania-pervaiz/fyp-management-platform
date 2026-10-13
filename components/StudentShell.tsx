"use client";

import { useEffect, useState, type ReactNode } from "react";
import { seedSampleData } from "@/lib/sample-seed";
import Link from "next/link";
import {
  getProjects,
  getSelectedProjectId,
  type Project,
} from "@/lib/project-storage";
import { BUILT_IN_PROJECTS } from "@/lib/sample-projects";

export const studentLinks = [
  { label: "Student Home", href: "/student/dashboard", icon: "⌂" },
  { label: "Project Overview", href: "/student/project", icon: "▦" },
  { label: "Tasks", href: "/project/tasks", icon: "✓" },
  { label: "Milestones", href: "/project/milestones", icon: "◆" },
  { label: "Team", href: "/project/team", icon: "♧" },
  { label: "Documentation", href: "/project/documentation", icon: "▤" },
  { label: "Meetings", href: "/project/meetings", icon: "◷" },
  { label: "Feedback", href: "/project/feedback", icon: "✎" },
  { label: "Progress", href: "/project/progress", icon: "↗" },
  { label: "AI Assistant", href:"/project/ai-assistant", icon: "AI" },
];

/* ---------- shared styles ---------- */
export const inputClass =
  "w-full rounded-xl border border-[#176B73]/30 bg-[#0C2430] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-[#7FD6CC]";
export const btnPrimary =
  "inline-flex items-center justify-center rounded-xl bg-[#176B73] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#1f8791] disabled:opacity-50";
export const btnSecondary =
  "inline-flex cursor-pointer items-center justify-center rounded-xl border border-[#176B73]/50 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/10";
export const cardClass =
  "rounded-3xl border-2 border-[#176B73]/30 bg-[#0C2430] p-6 text-white shadow-xl sm:p-8";
export const itemClass =
  "rounded-2xl border border-[#176B73]/30 bg-[#123342] p-5 shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-[#7FD6CC] hover:bg-[#163D4F] hover:shadow-xl";

export function getInitials(name?: string, fallback = "S") {
  if (!name) return fallback;
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length === 0) return fallback;
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function getSupervisorNames(project: Project): string[] {
  if (project.supervisors?.length) {
    return project.supervisors.map((s) => s.name).filter(Boolean);
  }
  return project.supervisorName ? [project.supervisorName] : [];
}

export function formatDate(date: string) {
  if (!date) return "Not set";
  const d = new Date(`${date}T00:00:00`);
  if (Number.isNaN(d.getTime())) return date;
  return d.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block min-w-0 space-y-2">
      <span className="block text-sm font-semibold text-slate-200">{label}</span>
      {children}
    </label>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    Pending: "bg-amber-400/15 text-amber-300 ring-amber-400/30",
    "In Progress": "bg-sky-400/15 text-sky-300 ring-sky-400/30",
    Completed: "bg-emerald-400/15 text-emerald-300 ring-emerald-400/30",
  };
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${
        colors[status] ?? "bg-white/10 text-slate-300 ring-white/20"
      }`}
    >
      {status}
    </span>
  );
}

/** Loads the project the user opened (falls back to the first sample). */
export function useActiveProject(): Project | null {
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    seedSampleData();   
    const map = new Map<string, Project>();
    BUILT_IN_PROJECTS.forEach((p) => map.set(p.id, p));
    getProjects().forEach((p) => map.set(p.id, p));

    const selectedId = getSelectedProjectId();
    setProject(
      Array.from(map.values()).find((p) => p.id === selectedId) ??
        BUILT_IN_PROJECTS[0],
    );
  }, []);

  return project;
}

export default function StudentShell({
  project,
  activeHref,
  section,
  title,
  subtitle,
  action,
  children,
}: {
  project: Project;
  activeHref: string;
  section: string;
  title: string;
  subtitle: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <main className="min-h-screen bg-[#F3F4F6] text-[#0C2430] lg:flex">
            <aside className="flex w-full shrink-0 flex-col justify-between border-r border-white/10 bg-[#0C2430] p-3 text-white lg:sticky lg:top-0 lg:h-screen lg:w-60">
        <div>
          <div className="mb-2 border-b border-white/10 px-1 pb-2">
            <Link
              href="/student/dashboard"
              className="text-base font-extrabold tracking-tight"
            >
              FYP <span className="text-[#7FD6CC]">Management</span>
            </Link>
            <p className="mt-1 text-[10px] text-slate-400">Student Portal</p>
          </div>

          <nav
            aria-label="Student navigation"
            className="flex gap-1 space-y-1 overflow-x-auto pr-1 lg:flex-col lg:overflow-y-auto"
          >
            {studentLinks.map((item) => {
              const active = item.href === activeHref;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`flex shrink-0 items-center gap-2 rounded-lg border px-2.5 py-1.5 text-[11px] font-semibold transition-all duration-200 ${
                    active
                      ? "border-[#7FD6CC] bg-[#176B73] text-white"
                      : "border-[#176B73]/30 bg-[#123342] text-slate-300 hover:border-[#7FD6CC] hover:bg-[#163D4F] hover:text-white"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-xs font-bold ${
                      active
                        ? "bg-white/15 text-[#7FD6CC]"
                        : "bg-[#0C2430] text-slate-400"
                    }`}
                  >
                    {item.icon}
                  </span>
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-3 border-t border-white/10 pt-3">
          <div className="flex items-center gap-2 rounded-lg border border-[#176B73]/30 bg-[#123342] p-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#176B73] text-xs font-black text-[#7FD6CC]">
              {getInitials(project.title, "P")}
            </div>
            <div className="min-w-0">
              <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                Current Project
              </p>
              <p className="truncate text-xs font-bold text-white">
                {project.title}
              </p>
            </div>
          </div>
        </div>
      </aside>

      <div className="min-w-0 flex-1 px-4 py-7 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-6xl space-y-8">
          <header className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#176B73]">
                STUDENT PORTAL / {section}
              </p>
              <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-[#0C2430] sm:text-5xl">
                {title}
                <span className="text-[#176B73]">.</span>
              </h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
                {subtitle}{" "}
                <strong className="text-[#0C2430]">{project.title}</strong>
              </p>
            </div>
            {action}
          </header>

          {children}
        </div>
      </div>
    </main>
  );
}