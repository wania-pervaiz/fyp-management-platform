import Image from "next/image";
import Link from "next/link";
import { Bricolage_Grotesque, Inter } from "next/font/google";

const headingFont = Bricolage_Grotesque({
  subsets: ["latin"],
  display: "swap",
});

const bodyFont = Inter({
  subsets: ["latin"],
  display: "swap",
});

/*
  Color Palette
  paper  #FFFFFF
  ink    #0C2430
  teal   #176B73
  mint   #7FD6CC
  grey   #F3F4F6
*/

const focusPaper =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7FD6CC] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0C2430]";

const focusOnInk =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0C2430]";

const focusOnTeal =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#176B73]";

type IconProps = {
  className?: string;
};

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

function TeamIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg {...base} className={className}>
      <circle cx="9" cy="8" r="3" />
      <path d="M3.5 19a5.5 5.5 0 0 1 11 0" />
      <path d="M15.5 11.5a3 3 0 1 0 0-6" />
      <path d="M16 14a4.5 4.5 0 0 1 4.5 5" />
    </svg>
  );
}

function TaskIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg {...base} className={className}>
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <path d="m8 9 2 2 4-4" />
      <path d="M8 15h8" />
      <path d="M8 18h5" />
    </svg>
  );
}

function FlagIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M5 21V4" />
      <path d="M5 5c4-3 7 3 14 0v9c-7 3-10-3-14 0" />
    </svg>
  );
}

function ChatIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M20 11.5a7.5 7.5 0 0 1-8 7.5 8.8 8.8 0 0 1-4.2-1.1L4 19l1.1-3.2A7.3 7.3 0 0 1 4.5 12 7.5 7.5 0 0 1 12 4.5a7.5 7.5 0 0 1 8 7Z" />
      <path d="M8 12h.01M12 12h.01M16 12h.01" />
    </svg>
  );
}

const chips = [
  { icon: TeamIcon, label: "Teams" },
  { icon: TaskIcon, label: "Tasks" },
  { icon: FlagIcon, label: "Milestones" },
  { icon: ChatIcon, label: "Feedback" },
];

const pathway = [
  {
    title: "Plan together",
    text: "Add your team members, create tasks, and share the workload so everyone knows what to do.",
  },
  {
    title: "Track your progress",
    text: "Complete tasks, reach milestones, and watch your project move forward week by week.",
  },
  {
    title: "Learn from feedback",
    text: "Your supervisor reviews your work and replies in the same place, with no lost messages.",
  },
];

const studentFeatures = [
  "Plan tasks and manage your team",
  "Track weekly milestones and progress",
  "Keep project information organized",
];

const supervisorFeatures = [
  "Guide and monitor assigned teams",
  "Review and approve milestone submissions",
  "Give direct feedback to students",
];

export default function Home() {
  return (
    <main
      className={`${bodyFont.className} flex min-h-screen flex-col bg-[#0C2430] text-white antialiased`}
    >
      <style>{`
        @keyframes fypRing {
          0%, 100% {
            transform: scale(1);
            opacity: 0.7;
          }
          50% {
            transform: scale(1.08);
            opacity: 1;
          }
        }

        @keyframes fypBar {
          0%, 100% {
            transform: scaleX(0.35);
            opacity: 0.45;
          }
          50% {
            transform: scaleX(1);
            opacity: 1;
          }
        }

        @keyframes fypFloat {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }

        .fyp-ring {
          animation: fypRing 3.2s ease-in-out infinite;
        }

        .fyp-bar {
          transform-origin: left center;
          animation: fypBar 2.8s ease-in-out infinite;
        }

        .fyp-float {
          animation: fypFloat 4s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .fyp-ring,
          .fyp-bar,
          .fyp-float {
            animation: none;
          }
        }
      `}</style>

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0C2430]/95 text-[#F8F7F3] backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className={`flex items-center ${focusPaper} rounded-lg`}
            aria-label="Final Year Pathway home"
          >
            <Image
              src="/fyp-logo.png"
              alt="Final Year Pathway"
              width={150}
              height={40}
              className="h-9 w-auto object-contain"
              priority
            />
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-medium sm:flex">
            <Link
              href="#about"
              className={`rounded-md transition hover:text-[#7FD6CC] ${focusPaper}`}
            >
              About
            </Link>

            <Link
              href="#portals"
              className={`rounded-md transition hover:text-[#7FD6CC] ${focusPaper}`}
            >
              Portals
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section
        id="about"
        className="relative isolate overflow-hidden bg-[#176B73]"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
        >
          <div className="absolute -right-32 -top-32 h-[28rem] w-[28rem] rounded-full bg-[#7FD6CC]/15 blur-[110px]" />
        </div>

        <div className="mx-auto grid max-w-6xl items-center gap-14 px-6 pb-14 pt-16 sm:pt-24 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-white">
              Final Year Project Workspace
            </p>

            <h1
              className={`${headingFont.className} max-w-2xl text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl`}
            >
              Everything for your FYP, in one place.
            </h1>

            <p className="mt-5 max-w-xl text-base leading-7 text-white/80 sm:text-lg">
              Plan your work, track your progress, and stay connected with
              your supervisor.
            </p>

            {/* Feature chips */}
            <ul className="mt-8 flex flex-wrap gap-3">
              {chips.map(({ icon: Icon, label }) => (
                <li key={label}>
                  <span
                    className="
                      flex items-center gap-2 rounded-full
                      border border-white/15
                      bg-[#0C2430]/60
                      px-4 py-2
                      text-sm font-medium text-white
                      shadow-sm
                      transition duration-300
                      hover:-translate-y-1
                      hover:scale-105
                      hover:bg-[#0C2430]
                      hover:shadow-lg
                      hover:shadow-black/20
                    "
                  >
                    <Icon className="h-4 w-4 text-[#7FD6CC]" />
                    {label}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Dashboard preview */}
          <div className="relative mx-auto w-full max-w-lg">
            <div
              className="fyp-float relative overflow-hidden rounded-[2rem] border border-white/15 bg-[#0C2430] p-5 shadow-2xl backdrop-blur-md text-left text-white"
              aria-hidden="true"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#7FD6CC]">Student Portal Preview</p>
                  <p className={`${headingFont.className} text-base font-bold text-white`}>Smart Campus Mobile App</p>
                </div>
                <span className="inline-flex items-center rounded-full bg-[#7FD6CC]/20 px-2.5 py-1 text-xs font-medium text-[#7FD6CC] border border-[#7FD6CC]/40">
                  Team of 4
                </span>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs text-white/70 font-medium">Overall Progress</p>
                  <div className="mt-2 flex items-baseline justify-between">
                    <span className={`${headingFont.className} text-xl font-bold text-white`}>68%</span>
                    <span className="text-[10px] text-[#7FD6CC]">On Track</span>
                  </div>
                  <div className="mt-3 h-2 w-full rounded-full bg-white/10">
                    <div className="fyp-bar h-2 w-3/4 rounded-full bg-[#7FD6CC]" />
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs text-white/70 font-medium">Weekly Milestones</p>
                  <div className="mt-3 flex items-end gap-2">
                    <div className="h-8 w-3 rounded-full bg-white/20" title="Week 1" />
                    <div className="h-12 w-3 rounded-full bg-white/30" title="Week 2" />
                    <div className="h-10 w-3 rounded-full bg-white/20" title="Week 3" />
                    <div className="h-16 w-3 rounded-full bg-[#7FD6CC]" title="Week 4 (Current)" />
                    <div className="h-12 w-3 rounded-full bg-white/20" title="Week 5" />
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wider text-white/85">Active Tasks & Feedback</p>
                  <span className="text-[11px] text-[#7FD6CC]">1 New Note</span>
                </div>

                <div className="mt-3 space-y-2.5">
                  {[
                    { title: "Project Proposal Document", status: "Done", tag: "Milestone 1" },
                    { title: "System Architecture Design", status: "In Progress", tag: "Tasks" },
                    { title: "Supervisor Feedback Review", status: "Pending", tag: "Feedback" },
                  ].map((task, item) => (
                    <div
                      key={item}
                      className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.04] p-2.5 text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="h-5 w-5 rounded-md bg-[#7FD6CC]/20 flex items-center justify-center text-[#7FD6CC] font-bold text-[10px]">
                          ✓
                        </div>
                        <div>
                          <p className="font-medium text-white">{task.title}</p>
                          <p className="text-[10px] text-white/60">{task.tag}</p>
                        </div>
                      </div>
                      <span className="rounded bg-white/10 px-2 py-0.5 text-[10px] text-[#7FD6CC] border border-white/10">
                        {task.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* What is Final Year Pathway? */}
        <div className="mx-auto max-w-6xl px-6 pb-24 pt-10">
          <div className="rounded-[2rem] border border-gray-200 bg-gray-100 p-8 text-[#0C2430] shadow-sm sm:p-12">
            <div className="mx-auto max-w-xl text-center">
              <h2
                className={`${headingFont.className} text-3xl font-semibold tracking-tight sm:text-4xl`}
              >
                What is Final Year Pathway?
              </h2>

              <p className="mt-3 text-[15px] leading-7 text-[#0C2430]/70">
                One workspace where student teams and supervisors manage a
                final-year project from the first idea to the final defense.
              </p>
            </div>

            <ol className="mt-12 grid gap-8 md:grid-cols-3 md:gap-6">
              {pathway.map((step, index) => (
                <li key={step.title} className="relative">
                  {index < pathway.length - 1 && (
                    <div
                      aria-hidden
                      className="absolute left-[calc(50%+3rem)] right-[-1.5rem] top-7 hidden border-t border-dashed border-[#0C2430]/20 md:block"
                    />
                  )}

                  <div className="relative z-10 flex flex-col items-center text-center">
                    <div
                      className={`
                        flex h-14 w-14 items-center justify-center rounded-full text-lg font-semibold
                        ${
                          index < 2
                            ? "border-2 border-[#176B73] bg-white text-[#0C2430]"
                            : "bg-[#0C2430] text-[#7FD6CC]"
                        }
                      `}
                    >
                      {index + 1}
                    </div>

                    <h3
                      className={`${headingFont.className} mt-5 text-xl font-semibold`}
                    >
                      {step.title}
                    </h3>

                    <p className="mt-2 max-w-xs text-sm leading-6 text-[#0C2430]/70">
                      {step.text}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Portals */}
      <section
        id="portals"
        className="relative bg-white text-[#0C2430]"
        aria-labelledby="portal-heading"
      >
        <div className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#176B73]">
              Choose your portal
            </p>

            <h2
              id="portal-heading"
              className={`${headingFont.className} mt-3 text-3xl font-semibold tracking-tight sm:text-4xl`}
            >
              One platform, two ways to work.
            </h2>

            <p className="mt-4 text-base leading-7 text-[#0C2430]/65">
              Students manage their project work while supervisors guide
              progress and provide feedback.
            </p>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            {/* Student Card */}
            <article
              className="
                group rounded-[2rem]
                bg-[#176B73]
                p-8 text-white
                shadow-xl shadow-[#176B73]/30
                transition duration-300
                hover:-translate-y-1
                sm:p-10
              "
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-white">
                    Student
                  </p>

                  <h3
                    className={`${headingFont.className} mt-3 text-3xl font-semibold`}
                  >
                    Manage your FYP
                  </h3>
                </div>

                <div className="fyp-ring flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/10">
                  <TeamIcon className="h-6 w-6" />
                </div>
              </div>

              <p className="mt-5 max-w-lg leading-7 text-white">
                Keep your project tasks, milestones, documents, meetings, and
                supervisor feedback organized in one place.
              </p>

              <ul className="mt-7 space-y-4">
                {studentFeatures.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#7FD6CC] text-[#0C2430]">
                      ✓
                    </span>
                    <span className="text-sm leading-6 text-white/85">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
  href="/student/dashboard"
  className={`
    mt-8 inline-flex items-center justify-center
    rounded-full bg-white px-5 py-3
    text-sm font-semibold text-[#176B73]
    transition hover:-translate-y-0.5 hover:bg-[#F3F4F6]
    ${focusOnTeal}
  `}
>
  Student Portal
</Link>
            </article>

            {/* Supervisor Card */}
            <article
              className="
                group rounded-[2rem]
                bg-[#0C2430]
                p-8 text-white
                shadow-xl
                transition duration-300
                hover:-translate-y-1
                sm:p-10
              "
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.16em]  text-white">
                    Supervisor
                  </p>

                  <h3
                    className={`${headingFont.className} mt-3 text-3xl font-semibold`}
                  >
                    Guide your teams
                  </h3>
                </div>

                <div className="fyp-ring flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/10">
                  <ChatIcon className="h-6 w-6" />
                </div>
              </div>

              <p className="mt-5 max-w-lg leading-7 text-white/70">
                See team progress, review milestone submissions, and keep
                communication with students in one place.
              </p>

              <ul className="mt-7 space-y-4">
                {supervisorFeatures.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#7FD6CC] text-[#0C2430]">
                      ✓
                    </span>

                    <span className="text-sm leading-6 text-white/80">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
  href="/supervisor/dashboard"
  className={`
    mt-8 inline-flex items-center justify-center
    rounded-full border border-white/20
    bg-white/10 px-5 py-3
    text-sm font-semibold text-white
    transition hover:-translate-y-0.5 hover:bg-white/15
    ${focusOnInk}
  `}
>
  Supervisor Portal
</Link>
            </article>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0C2430] text-[#F8F7F3]">
        <div className="mx-auto flex max-w-6xl flex-col gap-5 px-6 py-10 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p
              className={`${headingFont.className} text-lg font-semibold`}
            >
              Final Year Pathway
            </p>

            <p className="mt-1 text-sm text-white/55">
              A simple workspace for managing final-year projects.
            </p>
          </div>

          <div className="text-sm text-white/55">
            © {new Date().getFullYear()} Final Year Pathway. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}