"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { seedSampleData } from "@/lib/sample-seed";
import { loginSupervisor, registerSupervisor } from "@/lib/supervisor-auth";

const inputClass =
  "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-600/10";

const features = [
  {
    icon: "✉",
    title: "Accept project requests",
    text: "Students invite you by email. Review each request and accept or decline it.",
  },
  {
    icon: "✎",
    title: "Give feedback",
    text: "Write feedback for each project you supervise. Students see it on their Feedback page.",
  },
  {
    icon: "♧",
    title: "View teams",
    text: "See every team member of the projects you accepted, with their roles and status.",
  },
  {
    icon: "↗",
    title: "Track progress",
    text: "Follow task completion and milestones for every project in one place.",
  },
];

const steps = [
  "A student creates a project and adds your email as supervisor.",
  "You sign in and find the invitation on your home page.",
  "Accept it, then give feedback, view the team and track progress.",
];

type Mode = "signup" | "login" | null;

export default function SupervisorLanding() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
  seedSampleData();
}, []);

useEffect(() => {
  if (!mode) return;
  const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMode(null);
  window.addEventListener("keydown", onKey);
  return () => window.removeEventListener("keydown", onKey);
}, [mode]);

  function open(next: Mode) {
    setName("");
    setEmail("");
    setPassword("");
    setError("");
    setMode(next);
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const result =
      mode === "signup"
        ? registerSupervisor(name, email, password)
        : loginSupervisor(email, password);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    router.push("/supervisor/home");
  }

  return (
    <main className="min-h-screen bg-[#F4F7F8] text-gray-900">
      {/* Top bar */}
      <div className="bg-[#0C2430]">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <Link href="/" className="text-xl font-extrabold tracking-tight text-white">
            FYP <span className="text-[#7FD6CC]">Management</span>
            <span className="ml-3 text-xs font-medium text-slate-300">
              Supervisor Portal
            </span>
          </Link>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => open("signup")}
              className="rounded-xl bg-[#176B73] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#1f8791]"
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => open("login")}
              className="rounded-xl border border-white/30 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20"
            >
              Already have an account
            </button>
          </div>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#102C35] via-[#14515A] to-[#117D7B] text-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-200">
            For faculty supervisors
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-extrabold tracking-tight sm:text-5xl">
            Guide final-year projects from one place.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-white/75">
            Accept student requests, give feedback, view your teams and track
            how every project is progressing.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-12 px-4 py-12 sm:px-6">
        {/* What supervisors can do */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900">
            What you can do here
          </h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <div
                key={f.title}
                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-teal-400 hover:shadow-xl"
              >
                <div
                  aria-hidden="true"
                  className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-xl text-teal-800"
                >
                  {f.icon}
                </div>
                <h3 className="mt-4 text-base font-bold text-gray-900">
                  {f.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-gray-600">{f.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900">How it works</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {steps.map((text, i) => (
              <div
                key={text}
                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#176B73] text-sm font-bold text-white">
                  {i + 1}
                </span>
                <p className="mt-3 text-sm leading-6 text-gray-700">{text}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Sign in / login popup */}
      {mode && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setMode(null)}
        >
          <form
            role="dialog"
            aria-modal="true"
            aria-labelledby="auth-title"
            onSubmit={handleSubmit}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md space-y-5 rounded-3xl bg-white p-6 shadow-2xl sm:p-8"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 id="auth-title" className="text-2xl font-bold text-gray-900">
                  {mode === "signup" ? "Create your account" : "Welcome back"}
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                  {mode === "signup"
                    ? "Sign in as a supervisor with your email."
                    : "Enter your email and password."}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setMode(null)}
                aria-label="Close"
                className="text-xl font-bold text-gray-400 hover:text-gray-700"
              >
                ×
              </button>
            </div>

            {error && (
              <div
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
              >
                {error}
              </div>
            )}

            {mode === "signup" && (
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Name
                </label>
                <input
                  autoFocus
                  id="supervisor-name"
                  className={inputClass}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Dr. Ahmed"
                  required
                />
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Email
              </label>
              <input
                type="email"
                className={inputClass}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="supervisor@example.com"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Password
              </label>
              <input
                type="password"
                className={inputClass}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-teal-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-800"
            >
              {mode === "signup" ? "Sign In" : "Log In"}
            </button>

            <p className="text-center text-sm text-gray-600">
              {mode === "signup" ? "Already registered?" : "New supervisor?"}{" "}
              <button
                type="button"
                onClick={() => open(mode === "signup" ? "login" : "signup")}
                className="font-semibold text-teal-700 hover:underline"
              >
                {mode === "signup" ? "Log in instead" : "Create an account"}
              </button>
            </p>
          </form>
        </div>
      )}
    </main>
  );
}