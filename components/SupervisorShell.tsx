"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  getCurrentUser,
  getInvitations,
  getProjects,
  type Invitation,
  type Project,
} from "@/lib/project-storage";
import { BUILT_IN_PROJECTS } from "@/lib/sample-projects";
import { seedSampleData } from "@/lib/sample-seed";
import { getTaskGroups } from "@/lib/project-data";
import { logoutSupervisor } from "@/lib/supervisor-auth";
import { getInitials } from "@/components/StudentShell";

export const supervisorLinks = [
  { label: "Home", href: "/supervisor/home", icon: "⌂" },
  { label: "Feedback", href: "/supervisor/feedback", icon: "✎" },
  { label: "Teams", href: "/supervisor/teams", icon: "♧" },
  { label: "Progress", href: "/supervisor/progress", icon: "↗" },
  { label: "AI Assistant", href: "/supervisor/ai-assistant", icon: "AI" }, 
];

export function getProjectProgress(projectId: string) {
  const tasks = getTaskGroups(projectId).flatMap((g) => g.tasks);
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === "Completed").length;
  const inProgress = tasks.filter((t) => t.status === "In Progress").length;
  const pending = tasks.filter((t) => t.status === "Pending").length;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
  return { total, completed, inProgress, pending, percent };
}

/** Loads the logged-in supervisor. Sends everyone else to the sign-in page. */
export function useSupervisor() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string } | null>(
    null,
  );
  const [projects, setProjects] = useState<Project[]>([]);
  const [invites, setInvites] = useState<Invitation[]>([]);

  const reload = useCallback(() => {
    seedSampleData();

    const current = getCurrentUser();
    if (!current?.email || current.role !== "supervisor") {
      router.replace("/supervisor/dashboard");
      return;
    }

    const email = current.email.toLowerCase();

    const map = new Map<string, Project>();
    BUILT_IN_PROJECTS.forEach((p) => map.set(p.id, p));
    getProjects().forEach((p) => map.set(p.id, p));

    const mine = getInvitations().filter(
      (i) =>
        i.invitedRole === "supervisor" &&
        i.invitedEmail.toLowerCase() === email,
    );

    setProjects(
      mine
        .filter((i) => i.status === "Accepted")
        .map((i) => map.get(i.projectId))
        .filter((p): p is Project => !!p),
    );
    setInvites(mine.filter((i) => i.status === "Pending"));
    setUser({ name: current.name ?? current.email, email: current.email });
  }, [router]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { user, projects, invites, reload };
}

export default function SupervisorShell({
  user,
  activeHref,
  section,
  title,
  subtitle,
  children,
}: {
  user: { name: string; email: string };
  activeHref: string;
  section: string;
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  const router = useRouter();

  function signOut() {
    logoutSupervisor();
    router.push("/supervisor/dashboard");
  }

  return (
    <main className="min-h-screen bg-[#F3F4F6] text-[#0C2430] lg:flex">
      <aside className="flex w-full shrink-0 flex-col bg-[#0C2430] text-white lg:sticky lg:top-0 lg:h-screen lg:w-64">
        <div className="border-b border-white/10 px-5 py-6">
          <Link
            href="/supervisor/home"
            className="text-xl font-extrabold tracking-tight"
          >
            FYP <span className="text-[#7FD6CC]">Management</span>
          </Link>
          <p className="mt-1 text-xs text-slate-400">Supervisor Portal</p>
        </div>

        <nav
          aria-label="Supervisor navigation"
          className="flex gap-2 overflow-x-auto p-3 lg:flex-1 lg:flex-col lg:overflow-y-auto"
        >
          {supervisorLinks.map((item) => {
            const active = item.href === activeHref;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`flex shrink-0 items-center gap-2 rounded-xl border px-2 py-2 text-xs font-semibold shadow-sm transition-all duration-200 ${
                  active
                    ? "border-[#7FD6CC] bg-[#176B73] text-white"
                    : "border-[#176B73]/30 bg-[#123342] text-slate-300 hover:-translate-y-0.5 hover:border-[#7FD6CC] hover:bg-[#163D4F] hover:text-white"
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`flex h-8 w-8 items-center justify-center rounded-lg text-base font-bold ${
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

        <div className="space-y-2 border-t border-white/10 p-3">
          <div className="flex items-center gap-3 rounded-2xl border border-[#176B73]/30 bg-[#123342] p-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#176B73] text-base font-black text-[#7FD6CC] shadow-inner">
              {getInitials(user.name, "S")}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-white">
                {user.name}
              </p>
              <p className="truncate text-xs text-slate-400">{user.email}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={signOut}
            className="w-full rounded-xl border border-[#176B73]/40 px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
          >
            Sign out
          </button>
        </div>
      </aside>

      <div className="min-w-0 flex-1 px-4 py-7 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-6xl space-y-8">
          <header>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#176B73]">
              SUPERVISOR PORTAL / {section}
            </p>
            <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-[#0C2430] sm:text-5xl">
              {title}
              <span className="text-[#176B73]">.</span>
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
              {subtitle}
            </p>
          </header>

          {children}
        </div>
      </div>
    </main>
  );
}