"use client";

import SupervisorShell, { useSupervisor } from "@/components/SupervisorShell";
import {
  StatusBadge,
  cardClass,
  getInitials,
  itemClass,
} from "@/components/StudentShell";
import { getTaskGroups, getTeamEntries, type Status } from "@/lib/project-data";
import type { Project } from "@/lib/project-storage";

type Card = {
  key: string;
  name: string;
  email: string;
  role: string;
  status?: Status;
  members?: string[]; 
  done: number;
  total: number;
};

function buildCards(project: Project): Card[] {
  const entries = getTeamEntries(project.id);
  const groups = getTaskGroups(project.id);
  const projectMembers = project.members ?? [];

  const taskStats = (name: string) => {
    const group = groups.find(
      (g) => g.name.toLowerCase() === name.toLowerCase(),
    );
    return {
      done: group?.tasks.filter((t) => t.status === "Completed").length ?? 0,
      total: group?.tasks.length ?? 0,
    };
  };

  // People entered when the project was created
  const cards: Card[] = projectMembers.map((m) => {
    const entry = entries.find(
      (e) => e.name.toLowerCase() === m.name.toLowerCase(),
    );
    return {
      key: m.id,
      name: m.name,
      email: m.email,
      role: entry?.role ?? m.role,
      status: entry?.status,
      members: entry?.members,
      ...taskStats(m.name),
    };
  });

  // Teams the student added on the Team page
  entries
    .filter(
      (e) =>
        !projectMembers.some(
          (m) => m.name.toLowerCase() === e.name.toLowerCase(),
        ),
    )
    .forEach((e) =>
      cards.push({
        key: e.id,
        name: e.name,
        email: "",
        role: e.role,
        status: e.status,
        members: e.members, // ← edit 2: added
        ...taskStats(e.name),
      }),
    );

  return cards;
}

export default function SupervisorTeams() {
  const { user, projects } = useSupervisor();

  if (!user) return null;

  return (
    <SupervisorShell
      user={user}
      activeHref="/supervisor/teams"
      section="TEAMS"
      title="Teams"
      subtitle="The teams and members of every project you accepted."
    >
      {projects.length === 0 ? (
        <section className="rounded-3xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-50 text-3xl text-teal-800">
            ♧
          </div>
          <h2 className="mt-5 text-xl font-bold text-[#0C2430]">
            No teams yet
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Teams appear here after you accept a project invitation.
          </p>
        </section>
      ) : (
        projects.map((project) => {
          const cards = buildCards(project);

          return (
            <section key={project.id} className={cardClass}>
              <div className="mb-6 flex items-center gap-2 border-b border-[#176B73]/20 pb-4">
                <h2 className="text-2xl font-extrabold">{project.title}</h2>
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#176B73] text-sm font-bold text-[#7FD6CC]">
                  {cards.length}
                </span>
              </div>

              {cards.length === 0 ? (
                <p className="text-sm text-slate-400">
                  No team members added yet.
                </p>
              ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {cards.map((c) => (
                    <div key={c.key} className={itemClass}>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#176B73] text-lg font-black text-[#7FD6CC]">
                            {getInitials(c.name, "M")}
                          </div>
                          <div>
                            <h3 className="text-base font-bold text-white">
                              {c.name}
                            </h3>
                            <span className="mt-0.5 inline-block rounded-md bg-[#176B73]/40 px-2 py-0.5 text-[11px] font-semibold text-[#7FD6CC]">
                              {c.role}
                            </span>
                          </div>
                        </div>
                        {c.status && <StatusBadge status={c.status} />}
                      </div>

                      <div className="mt-4 space-y-1 border-t border-[#176B73]/20 pt-3 text-xs text-slate-300">
                        {c.email && (
                          <p className="font-mono text-slate-300">{c.email}</p>
                        )}

                        {/* edit 3: added */}
                        {c.members && c.members.length > 0 && (
                          <p>
                            Members:{" "}
                            <span className="text-white">
                              {c.members.join(", ")}
                            </span>
                          </p>
                        )}

                        <p>
                          Tasks:{" "}
                          <span className="text-white">
                            {c.done} of {c.total} completed
                          </span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          );
        })
      )}
    </SupervisorShell>
  );
}