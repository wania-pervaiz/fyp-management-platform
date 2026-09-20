import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">
          FYP Management Platform
        </h1>

        <p className="mt-2 mb-6 text-sm text-slate-600">
          Welcome! Please select your portal to continue.
        </p>

        <div className="flex flex-col gap-3">
          <Link
            href="/login?role=student"
            className="w-full rounded-xl bg-[#105d8a] py-3 text-center font-medium text-white shadow-sm transition-opacity hover:opacity-90"
          >
            Go to Student Dashboard
          </Link>

          <Link
            href="/login?role=supervisor"
            className="w-full rounded-xl bg-slate-900 py-3 text-center font-medium text-white shadow-sm transition-opacity hover:opacity-90"
          >
            Go to Supervisor Dashboard
          </Link>

          <Link
            href="/health"
            className="w-full rounded-xl bg-emerald-600 py-3 text-center font-medium text-white shadow-sm transition-opacity hover:opacity-90"
          >
            View Health-Check Page
          </Link>
        </div>
      </div>
    </main>
  );
}

