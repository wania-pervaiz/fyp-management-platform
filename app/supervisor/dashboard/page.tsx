import Link from "next/link";

export default function SupervisorDashboard() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold text-slate-900">
        Supervisor Dashboard
      </h1>

      <p className="mt-2 mb-8 text-slate-600">
        Monitor and manage your assigned FYP teams.
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/supervisor/teams"
          className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:border-indigo-500 hover:shadow-md"
        >
          <h2 className="font-semibold text-slate-900">Teams</h2>
          <p className="mt-2 text-sm text-slate-600">
            View and manage student teams.
          </p>
        </Link>

        <Link
          href="/supervisor/progress"
          className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:border-indigo-500 hover:shadow-md"
        >
          <h2 className="font-semibold text-slate-900">Progress</h2>
          <p className="mt-2 text-sm text-slate-600">
            Monitor project progress.
          </p>
        </Link>

        <Link
          href="/supervisor/feedback"
          className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:border-indigo-500 hover:shadow-md"
        >
          <h2 className="font-semibold text-slate-900">Feedback</h2>
          <p className="mt-2 text-sm text-slate-600">
            Provide feedback to students.
          </p>
        </Link>
      </div>
    </main>
  );
}