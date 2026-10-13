"use client";

import { useEffect, useState } from "react";
import StudentShell, {
  cardClass,
  getInitials,
  itemClass,
  useActiveProject,
} from "@/components/StudentShell";
import {
  getDocEntries,
  getMeetingEntries,
  getTaskGroups,
  getTeamEntries,
  type TaskGroup,
} from "@/lib/project-data";

export default function ProgressPage() {
  const project = useActiveProject();

  const [groups, setGroups] = useState<TaskGroup[]>([]);
  const [teamCount, setTeamCount] = useState(0);
  const [docCount, setDocCount] = useState(0);
  const [meetingCount, setMeetingCount] = useState(0);

  useEffect(() => {
    if (!project) return;
    setGroups(getTaskGroups(project.id));
    setTeamCount(getTeamEntries(project.id).length);
    setDocCount(getDocEntries(project.id).length);
    setMeetingCount(getMeetingEntries(project.id).length);
  }, [project]);

  if (!project) return null;

  const allTasks = groups.flatMap((g) => g.tasks);
  const total = allTasks.length;
  const completed = allTasks.filter((t) => t.status === "Completed").length;
  const inProgress = allTasks.filter((t) => t.status === "In Progress").length;
  const pending = allTasks.filter((t) => t.status === "Pending").length;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  const stats = [
    { label: "Total tasks", value: total },
    { label: "Completed", value: completed },
    { label: "In progress", value: inProgress },
    { label: "Pending", value: pending },
  ];

  return (
    <StudentShell
      project={project}
      activeHref="/student/progress"
      section="PROGRESS"
      title="Progress"
      subtitle="Track how far along you are on"
    >
      {/* Overall */}
      <section className={cardClass}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Overall completion
            </p>
            <p className="mt-1 text-5xl font-black text-[#7FD6CC]">{percent}%</p>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="rounded-xl bg-[#123342] px-4 py-3">
              <p className="text-xl font-bold">{teamCount}</p>
              <p className="text-xs text-slate-400">Team</p>
            </div>
            <div className="rounded-xl bg-[#123342] px-4 py-3">
              <p className="text-xl font-bold">{docCount}</p>
              <p className="text-xs text-slate-400">Documents</p>
            </div>
            <div className="rounded-xl bg-[#123342] px-4 py-3">
              <p className="text-xl font-bold">{meetingCount}</p>
              <p className="text-xs text-slate-400">Meetings</p>
            </div>
          </div>
        </div>

        <div className="mt-6 h-3 overflow-hidden rounded-full bg-[#123342]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#176B73] to-[#7FD6CC] transition-all"
            style={{ width: `${percent}%` }}
          />
        </div>

        {total === 0 && (
          <p className="mt-4 text-sm text-slate-400">
            No tasks yet. Add tasks on the Tasks page to see progress here.
          </p>
        )}
      </section>

      {/* Task counts */}
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-[#176B73]/30 bg-[#0C2430] p-5 text-white shadow-md"
          >
            <p className="text-xs text-slate-400">{s.label}</p>
            <p className="mt-1 text-3xl font-extrabold text-[#7FD6CC]">
              {s.value}
            </p>
          </div>
        ))}
      </section>

      {/* Per member */}
      {groups.length > 0 && (
        <section className={cardClass}>
          <h2 className="mb-6 border-b border-[#176B73]/20 pb-4 text-2xl font-extrabold">
            Progress by member
          </h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {groups.map((group) => {
              const done = group.tasks.filter(
                (t) => t.status === "Completed",
              ).length;
              const pct =
                group.tasks.length === 0
                  ? 0
                  : Math.round((done / group.tasks.length) * 100);

              return (
                <div key={group.id} className={itemClass}>
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#176B73] text-base font-black text-[#7FD6CC]">
                      {getInitials(group.name, "M")}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-bold text-white">
                        {group.name}
                      </p>
                      <p className="text-xs text-slate-400">
                        {done} of {group.tasks.length} tasks completed
                      </p>
                    </div>
                    <span className="text-sm font-bold text-[#7FD6CC]">
                      {pct}%
                    </span>
                  </div>
                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#0C2430]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#176B73] to-[#7FD6CC]"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </StudentShell>
  );
}