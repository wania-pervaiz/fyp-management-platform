
"use client";

import Link from "next/link";
import StatCard from "@/components/StatCard";
import StatusBadge from "@/components/StatusBadge";

const tasks = [
  {
    title: "Complete database design",
    due: "October 10, 2026",
    status: "In Progress" as const,
    priority: "High",
  },
  {
    title: "Prepare testing documentation",
    due: "October 14, 2026",
    status: "Pending" as const,
    priority: "Medium",
  },
  {
    title: "Review project proposal",
    due: "October 16, 2026",
    status: "Pending" as const,
    priority: "Low",
  },
];

const milestones = [
  { title: "Project Proposal", status: "Completed" as const },
  { title: "System Design", status: "Completed" as const },
  { title: "Prototype", status: "In Progress" as const },
  { title: "Testing", status: "Upcoming" as const },
];

const exampleActions = [
  { title: "Tasks", description: "Manage project tasks.", icon: "✓" },
  { title: "Progress", description: "Check project progress.", icon: "↗" },
  { title: "Meetings", description: "Review meeting notes.", icon: "◷" },
  { title: "Documents", description: "Manage FYP documents.", icon: "▤" },
];

export default function StudentDashboard() {
  return (
    <main className="min-h-screen bg-[#F3F4F6] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0C2430] via-[#12434B] to-[#176B73] p-6 text-white shadow-lg ring-1 ring-[#0C2430]/20 sm:p-8">
          <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="max-w-3xl">
              <p className="text-sm font-bold uppercase tracking-widest text-[#7FD6CC]">
                Student Portal · Dashboard Preview
              </p>

              <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
                Your Project Starts Here
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/80 sm:text-base">
                Turn your idea into a project. Add your team and supervisor,
                then organize your work step by step.
              </p>
            </div>

            <div className="flex w-full flex-col gap-3 sm:ml-auto sm:w-auto sm:min-w-[230px]">
              <Link
                href="/project-management?view=create"
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3.5 text-sm font-bold text-[#0C2430] shadow-md transition-all duration-300 ease-in-out hover:-translate-y-1 hover:bg-[#7FD6CC] hover:shadow-lg active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#176B73]"
              >
                <span aria-hidden="true" className="text-lg">
                  +
                </span>
                Create Project
              </Link>

              <Link
                href="/project-management?mode=join"
                className="inline-flex w-full items-center justify-center rounded-2xl border border-white/40 bg-white/10 px-5 py-3.5 text-sm font-bold text-white shadow-sm backdrop-blur-sm transition-all duration-300 ease-in-out hover:-translate-y-1 hover:border-[#7FD6CC] hover:bg-white/20 hover:shadow-lg active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-[#7FD6CC] focus:ring-offset-2 focus:ring-offset-[#176B73]"
              >
                Have an Existing Project?
              </Link>
            </div>
          </div>

          <div
            className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#7FD6CC]/10"
            aria-hidden="true"
          />
          <div
            className="absolute -bottom-24 right-24 h-48 w-48 rounded-full bg-white/10"
            aria-hidden="true"
          />
        </section>

        <section className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border-2 border-[#176B73]/40 border-t-4 border-t-[#176B73] bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg lg:col-span-2">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[#176B73]">
                  Example Project
                </p>

                <div className="mt-2 flex flex-wrap items-center gap-3">
                  <h2 className="text-xl font-bold text-[#0C2430]">
                    Smart Campus Management System
                  </h2>
                  <StatusBadge status="In Progress" />
                </div>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600">
                  A web-based platform for managing final-year project
                  information, tasks, milestones, communication, and progress.
                </p>

                <p className="mt-3 text-xs text-gray-500">
                  Sample details shown for demonstration only.
                </p>
              </div>

              <div className="flex shrink-0 justify-center">
                <div
                  className="flex h-28 w-28 items-center justify-center rounded-full"
                  style={{
                    background: "conic-gradient(#176B73 65%, #DCEDEA 65%)",
                  }}
                  role="img"
                  aria-label="Example project progress: 65%"
                >
                  <div className="flex h-20 w-20 flex-col items-center justify-center rounded-full border-2 border-[#7FD6CC] bg-white">
                    <span className="text-2xl font-bold text-[#176B73]">
                      65%
                    </span>
                    <span className="text-xs font-medium text-gray-600">
                      Progress
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-xl border border-[#7FD6CC] bg-[#F3F4F6] p-4">
              <div className="mb-2 flex justify-between gap-3 text-sm">
                <span className="font-bold text-[#0C2430]">
                  Overall project progress
                </span>
                <span className="font-bold text-[#176B73]">65%</span>
              </div>

              <div
                className="h-3 overflow-hidden rounded-full bg-gray-200"
                role="progressbar"
                aria-label="Example project progress"
                aria-valuenow={65}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#176B73] to-[#7FD6CC]"
                  style={{ width: "65%" }}
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border-2 border-[#176B73]/30 bg-gradient-to-br from-[#176B73] to-[#0C2430] p-6 text-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
            <div className="flex h-full flex-col justify-between">
              <div>
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/30 bg-white/10 text-2xl"
                  aria-hidden="true"
                >
                  ◷
                </div>

                <p className="mt-5 text-sm font-bold uppercase tracking-widest text-[#7FD6CC]">
                  Example Meeting
                </p>

                <h2 className="mt-1 text-2xl font-bold">
                  Project Progress Review
                </h2>

                <p className="mt-2 text-sm text-white/80">
                  October 10, 2026 · 2:00 PM
                </p>
              </div>

              <span className="mt-6 w-fit rounded-xl bg-white/10 px-4 py-2 text-sm font-bold text-white/80">
                Meeting preview
              </span>
            </div>
          </div>
        </section>

        <section
          aria-label="Example project statistics"
          className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          <StatCard
            title="Tasks Completed"
            value="8 / 12"
            description="4 tasks remaining"
            icon="✓"
            color="green"
          />
          <StatCard
            title="Milestones"
            value="2 / 5"
            description="Prototype in progress"
            icon="◆"
            color="purple"
          />
          <StatCard
            title="Team Members"
            value="3"
            description="Example team"
            icon="●"
            color="blue"
          />
          <StatCard
            title="Project Status"
            value="Active"
            description="Example project"
            icon="↗"
            color="blue"
          />
        </section>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <section className="rounded-2xl border-2 border-[#176B73]/40 border-t-4 border-t-[#176B73] bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg lg:col-span-2">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#176B73]">
                Example Content
              </p>
              <h2 className="mt-1 text-2xl font-bold text-[#0C2430]">
                Upcoming Tasks
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                Example tasks that a project team could manage.
              </p>
            </div>

            <div className="mt-6 space-y-3">
              {tasks.map((task) => (
                <div
                  key={task.title}
                  className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-[#F3F4F6] p-4 transition-all duration-300 hover:border-[#176B73]/60 hover:bg-[#176B73]/5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="mt-1 h-3 w-3 shrink-0 rounded-full bg-[#176B73]"
                      aria-hidden="true"
                    />
                    <div>
                      <h3 className="font-bold text-[#0C2430]">
                        {task.title}
                      </h3>
                      <p className="mt-1 text-sm text-gray-600">
                        Due: {task.due}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <span
                      className={`text-xs font-bold ${
                        task.priority === "High"
                          ? "text-red-700"
                          : task.priority === "Medium"
                            ? "text-amber-700"
                            : "text-gray-600"
                      }`}
                    >
                      {task.priority} Priority
                    </span>
                    <StatusBadge status={task.status} />
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-4 text-xs text-gray-500">
              These are sample tasks, not tasks assigned to your account.
            </p>
          </section>

          <section className="rounded-2xl border-2 border-[#176B73]/40 border-t-4 border-t-[#176B73] bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
            <p className="text-xs font-bold uppercase tracking-widest text-[#176B73]">
              Example Roadmap
            </p>
            <h2 className="mt-1 text-2xl font-bold text-[#0C2430]">
              Milestones
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Example stages of an FYP.
            </p>

            <div className="mt-6 space-y-4">
              {milestones.map((milestone, index) => (
                <div
                  key={milestone.title}
                  className="relative flex items-center gap-4 rounded-xl border border-[#176B73]/25 bg-[#F3F4F6] p-3 transition-all duration-300 hover:border-[#176B73]/60 hover:bg-[#176B73]/5"
                >
                  {index < milestones.length - 1 && (
                    <div
                      className="absolute left-7 top-12 h-5 w-px bg-[#7FD6CC]"
                      aria-hidden="true"
                    />
                  )}

                  <div
                    className={`relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                      milestone.status === "Completed"
                        ? "bg-[#7FD6CC]/40 text-[#0C5559]"
                        : milestone.status === "In Progress"
                          ? "bg-[#176B73] text-white"
                          : "bg-white text-[#176B73] ring-2 ring-[#7FD6CC]"
                    }`}
                    aria-hidden="true"
                  >
                    {milestone.status === "Completed" ? "✓" : index + 1}
                  </div>

                  <div className="flex min-w-0 flex-1 flex-col gap-2">
                    <span className="text-sm font-bold text-[#0C2430]">
                      {milestone.title}
                    </span>
                    <div className="w-fit">
                      <StatusBadge status={milestone.status} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-4 text-xs text-gray-500">
              Example milestones for demonstration only.
            </p>
          </section>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <section className="rounded-2xl border-2 border-amber-300 border-t-4 border-t-amber-500 bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-amber-700">
                  Example Feedback
                </p>
                <h2 className="mt-1 text-2xl font-bold text-[#0C2430]">
                  Supervisor Feedback
                </h2>
              </div>
              <StatusBadge status="Needs Action" />
            </div>

            <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-5 transition-colors duration-300 hover:bg-amber-100">
              <p className="text-sm leading-6 text-gray-700">
                Improve the testing documentation and clearly describe the
                testing approach used in the project.
              </p>
              <p className="mt-3 text-xs text-gray-600">
                Example date: October 3, 2026
              </p>
            </div>

            <p className="mt-4 text-xs text-gray-500">
              This is sample feedback, not feedback from your supervisor.
            </p>
          </section>

          <section className="relative overflow-hidden rounded-2xl border-2 border-[#176B73]/30 bg-gradient-to-br from-[#0C2430] to-[#176B73] p-6 text-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
            <div className="relative z-10">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/30 bg-white/10 text-xl font-bold transition-all duration-300 hover:rotate-3 hover:bg-white/20"
                aria-hidden="true"
              >
                AI
              </div>
              <p className="mt-5 text-xs font-bold uppercase tracking-widest text-[#7FD6CC]">
                Example Feature
              </p>
              <h2 className="mt-1 text-2xl font-bold">
                AI Project Assistant
              </h2>
              <p className="mt-2 max-w-md text-sm leading-6 text-white/80">
                The project assistant can help students with milestones,
                tasks, timelines, project planning, and supervisor feedback.
              </p>
              <span className="mt-5 inline-block rounded-xl bg-white/10 px-4 py-2.5 text-sm font-bold text-white/80">
                Assistant preview
              </span>
            </div>

            <div
              className="absolute -bottom-16 -right-10 h-40 w-40 rounded-full bg-[#7FD6CC]/10"
              aria-hidden="true"
            />
          </section>
        </div>

        <section className="mt-6 rounded-2xl border-2 border-[#176B73]/40 border-t-4 border-t-[#176B73] bg-white p-6 shadow-md transition-all duration-300 hover:shadow-lg">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#176B73]">
              Example Shortcuts
            </p>
            <h2 className="mt-1 text-2xl font-bold text-[#0C2430]">
              Quick Actions
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              These are examples of the sections available for a project.
            </p>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {exampleActions.map((action) => (
              <div
                key={action.title}
                className="group cursor-default rounded-xl border border-[#176B73]/30 bg-[#F3F4F6] p-4 transition-all duration-300 ease-in-out hover:-translate-y-1 hover:border-[#176B73] hover:bg-[#176B73] hover:shadow-lg"
              >
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#7FD6CC]/40 text-lg font-bold text-[#0C5559] transition-all duration-300 group-hover:bg-white/15 group-hover:text-white"
                  aria-hidden="true"
                >
                  {action.icon}
                </div>
                <p className="mt-3 font-bold text-[#0C2430] transition-colors duration-300 group-hover:text-white">
                  {action.title}
                </p>
                <p className="mt-1 text-sm text-gray-600 transition-colors duration-300 group-hover:text-white/80">
                  {action.description}
                </p>
              </div>
            ))}
          </div>

          <p className="mt-4 text-xs text-gray-500">
            Create a project to access your own project information.
          </p>
        </section>
      </div>
    </main>
  );
}
