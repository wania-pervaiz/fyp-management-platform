"use client";

import SupervisorShell, {
  getProjectProgress,
  useSupervisor,
} from "@/components/SupervisorShell";
import { StatusBadge, cardClass, itemClass } from "@/components/StudentShell";
import { getMilestones } from "@/lib/project-storage";

export default function SupervisorProgress() {
  const { user, projects } = useSupervisor();

  if (!user) return null;

  const allMilestones = getMilestones();

  return (
    <SupervisorShell
      user={user}
      activeHref="/supervisor/progress"
      section="PROGRESS"
      title="Progress"
      subtitle="How far each of your projects has come, based on completed tasks and milestones."
    >
      {projects.length === 0 ? (
        <section className="rounded-3xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-50 text-3xl text-teal-800">
            ↗
          </div>
          <h2 className="mt-5 text-xl font-bold text-[#0C2430]">
            No progress to show
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Progress appears here after you accept a project invitation.
          </p>
        </section>
      ) : (
        <section className={cardClass}>
          <div className="mb-6 flex items-center gap-2 border-b border-[#176B73]/20 pb-4">
            <h2 className="text-2xl font-extrabold">Project Progress</h2>
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#176B73] text-sm font-bold text-[#7FD6CC]">
              {projects.length}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {projects.map((project) => {
              const p = getProjectProgress(project.id);
              const milestones = allMilestones.filter(
                (m) => m.projectId === project.id,
              );
              const milestonesDone = milestones.filter(
                (m) => m.status === "Completed",
              ).length;

              return (
                <div key={project.id} className={itemClass}>
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-lg font-bold text-white">
                      {project.title}
                    </h3>
                    <StatusBadge status={project.status} />
                  </div>

                  <div className="mt-4 flex items-end justify-between">
                    <p className="text-4xl font-black text-[#7FD6CC]">
                      {p.percent}%
                    </p>
                    <p className="text-xs text-slate-400">
                      {p.completed} of {p.total} tasks completed
                    </p>
                  </div>

                  <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-[#0C2430]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#176B73] to-[#7FD6CC]"
                      style={{ width: `${p.percent}%` }}
                    />
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                    <div className="rounded-xl bg-[#0C2430] px-2 py-2">
                      <p className="text-lg font-bold text-white">
                        {p.completed}
                      </p>
                      <p className="text-[11px] text-slate-400">Completed</p>
                    </div>
                    <div className="rounded-xl bg-[#0C2430] px-2 py-2">
                      <p className="text-lg font-bold text-white">
                        {p.inProgress}
                      </p>
                      <p className="text-[11px] text-slate-400">In progress</p>
                    </div>
                    <div className="rounded-xl bg-[#0C2430] px-2 py-2">
                      <p className="text-lg font-bold text-white">{p.pending}</p>
                      <p className="text-[11px] text-slate-400">Pending</p>
                    </div>
                  </div>

                  <p className="mt-4 border-t border-[#176B73]/20 pt-3 text-xs text-slate-300">
                    Milestones:{" "}
                    <span className="text-white">
                      {milestonesDone} of {milestones.length} completed
                    </span>
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </SupervisorShell>
  );
}