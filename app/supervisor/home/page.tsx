"use client";

import Link from "next/link";
import SupervisorShell, {
  getProjectProgress,
  useSupervisor,
} from "@/components/SupervisorShell";
import {
  StatusBadge,
  btnPrimary,
  btnSecondary,
  cardClass,
  itemClass,
} from "@/components/StudentShell";
import { respondToInvitation } from "@/lib/project-storage";

export default function SupervisorHome() {
  const { user, projects, invites, reload } = useSupervisor();

  if (!user) return null;

  function respond(id: string, status: "Accepted" | "Declined") {
    respondToInvitation(id, status);
    reload();
  }

  return (
    <SupervisorShell
      user={user}
      activeHref="/supervisor/home"
      section="HOME"
      title={user.name}
      subtitle="Welcome back. Review your invitations and the projects you supervise."
    >
      {/* Summary */}
      <section className="grid grid-cols-2 gap-4">
        <div className="rounded-2xl border border-[#176B73]/30 bg-[#0C2430] p-5 text-white shadow-md">
          <p className="text-xs text-slate-400">Connected projects</p>
          <p className="mt-1 text-3xl font-extrabold text-[#7FD6CC]">
            {projects.length}
          </p>
        </div>
        <div className="rounded-2xl border border-[#176B73]/30 bg-[#0C2430] p-5 text-white shadow-md">
          <p className="text-xs text-slate-400">Pending invitations</p>
          <p className="mt-1 text-3xl font-extrabold text-[#7FD6CC]">
            {invites.length}
          </p>
        </div>
      </section>

      {/* Invitations */}
      <section className={cardClass}>
        <div className="mb-6 flex items-center gap-2 border-b border-[#176B73]/20 pb-4">
          <h2 className="text-2xl font-extrabold">Invitations</h2>
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#176B73] text-sm font-bold text-[#7FD6CC]">
            {invites.length}
          </span>
        </div>

        {invites.length === 0 ? (
          <p className="text-sm text-slate-400">
            No pending invitations. When a student adds your email to a project,
            the request appears here.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {invites.map((invite) => (
              <div key={invite.id} className={itemClass}>
                <span className="rounded-full border border-[#7FD6CC]/30 bg-[#176B73]/30 px-3 py-1 text-[11px] font-semibold text-[#7FD6CC]">
                  Supervisor request
                </span>
                <h3 className="mt-3 text-lg font-bold text-white">
                  {invite.projectTitle}
                </h3>
                <p className="mt-1 text-xs text-slate-400">
                  Requested by {invite.invitedBy} ·{" "}
                  {new Date(invite.createdAt).toLocaleDateString()}
                </p>

                <div className="mt-5 flex flex-wrap gap-3 border-t border-[#176B73]/20 pt-4">
                  <button
                    type="button"
                    onClick={() => respond(invite.id, "Accepted")}
                    className={btnPrimary}
                  >
                    Accept
                  </button>
                  <button
                    type="button"
                    onClick={() => respond(invite.id, "Declined")}
                    className={btnSecondary}
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Connected projects */}
      <section className={cardClass}>
        <div className="mb-6 flex items-center gap-2 border-b border-[#176B73]/20 pb-4">
          <h2 className="text-2xl font-extrabold">My Projects</h2>
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#176B73] text-sm font-bold text-[#7FD6CC]">
            {projects.length}
          </span>
        </div>

        {projects.length === 0 ? (
          <p className="text-sm text-slate-400">
            You are not connected to any project yet. Accept an invitation above
            to get started.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {projects.map((project) => {
              const progress = getProjectProgress(project.id);
              const memberTotal =
                project.members?.length ?? project.teamMembers?.length ?? 0;

              return (
                <div key={project.id} className={itemClass}>
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-lg font-bold text-white">
                      {project.title}
                    </h3>
                    <StatusBadge status={project.status} />
                  </div>

                  <p className="mt-2 line-clamp-2 text-sm text-slate-300">
                    {project.description || "No description provided."}
                  </p>

                  <p className="mt-3 text-xs text-slate-400">
                    {memberTotal} team members · {progress.completed} of{" "}
                    {progress.total} tasks completed
                  </p>

                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#0C2430]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#176B73] to-[#7FD6CC]"
                      style={{ width: `${progress.percent}%` }}
                    />
                  </div>

                  <div className="mt-4 flex flex-wrap gap-4 border-t border-[#176B73]/20 pt-3 text-xs font-semibold text-[#7FD6CC]">
                    <Link href="/supervisor/feedback" className="hover:underline">
                      Feedback →
                    </Link>
                    <Link href="/supervisor/teams" className="hover:underline">
                      Team →
                    </Link>
                    <Link href="/supervisor/progress" className="hover:underline">
                      Progress →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </SupervisorShell>
  );
}