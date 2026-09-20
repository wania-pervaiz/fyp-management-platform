import Link from "next/link";

export default function StudentDashboard() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold text-slate-900">
        Student Dashboard
      </h1>

      <p className="mt-2 mb-8 text-slate-600">
        Manage your final-year project from here.
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Link
          href="/student/project"
          className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:border-indigo-500 hover:shadow-md"
        >
          <h2 className="font-semibold text-slate-900">My Project</h2>
          <p className="mt-2 text-sm text-slate-600">
            View project details.
          </p>
        </Link>

        <Link
          href="/student/team"
          className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:border-indigo-500 hover:shadow-md"
        >
          <h2 className="font-semibold text-slate-900">Team Members</h2>
          <p className="mt-2 text-sm text-slate-600">
            View your project team.
          </p>
        </Link>

        <Link
          href="/student/tasks"
          className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:border-indigo-500 hover:shadow-md"
        >
          <h2 className="font-semibold text-slate-900">Tasks</h2>
          <p className="mt-2 text-sm text-slate-600">
            Manage project tasks.
          </p>
        </Link>

        <Link
          href="/student/milestones"
          className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:border-indigo-500 hover:shadow-md"
        >
          <h2 className="font-semibold text-slate-900">Milestones</h2>
          <p className="mt-2 text-sm text-slate-600">
            Track project milestones.
          </p>
        </Link>

        <Link
          href="/student/documentation"
          className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:border-indigo-500 hover:shadow-md"
        >
          <h2 className="font-semibold text-slate-900">Documentation</h2>
          <p className="mt-2 text-sm text-slate-600">
            Manage project documents.
          </p>
        </Link>

        <Link
          href="/student/meetings"
          className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:border-indigo-500 hover:shadow-md"
        >
          <h2 className="font-semibold text-slate-900">Meeting Notes</h2>
          <p className="mt-2 text-sm text-slate-600">
            View supervisor meeting notes.
          </p>
        </Link>

        <Link
          href="/student/feedback"
          className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:border-indigo-500 hover:shadow-md"
        >
          <h2 className="font-semibold text-slate-900">Supervisor Feedback</h2>
          <p className="mt-2 text-sm text-slate-600">
            View feedback from your supervisor.
          </p>
        </Link>

        <Link
          href="/student/progress"
          className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:border-indigo-500 hover:shadow-md"
        >
          <h2 className="font-semibold text-slate-900">Progress</h2>
          <p className="mt-2 text-sm text-slate-600">
            Track your overall project progress.
          </p>
        </Link>
      </div>
    </main>
  );
}