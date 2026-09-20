import Link from "next/link";

export default function Login() {
  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        
        <h1 className="text-2xl font-bold text-slate-900">
          Login
        </h1>

        <p className="mt-2 mb-6 text-sm text-slate-600">
          Enter your details and select your portal to continue.
        </p>

        <div className="space-y-4">

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Email
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Password
            </label>

            <input
              type="password"
              placeholder="Enter your password"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-600"
            />
          </div>

          <div className="pt-2">
            <p className="mb-3 text-sm font-medium text-slate-700">
              Continue as:
            </p>

            <div className="flex gap-3">
              <Link
                href="/student/dashboard"
                className="flex-1 rounded-xl bg-[#105d8a] py-3 text-center font-medium text-white hover:opacity-90"
              >
                Student
              </Link>

              <Link
                href="/supervisor/dashboard"
                className="flex-1 rounded-xl bg-slate-900 py-3 text-center font-medium text-white hover:opacity-90"
              >
                Supervisor
              </Link>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}

