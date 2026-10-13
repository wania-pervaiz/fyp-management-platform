import Link from "next/link";

export default function Navbar() {
  return (
    <nav
      aria-label="Main navigation"
      className="border-b border-[var(--border)] bg-[var(--card-bg)] shadow-sm"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="text-lg font-bold text-[var(--foreground)] hover:text-[var(--primary)]"
        >
          FYP Management Platform
        </Link>

        <div className="flex items-center gap-6 font-medium">
          <Link
            href="/"
            className="text-[var(--foreground)] transition-colors hover:text-[var(--primary)]"
          >
            Home
          </Link>

          <Link
            href="/login"
            className="text-[var(--foreground)] transition-colors hover:text-[var(--primary)]"
          >
            Login
          </Link>

          <Link
            href="/health"
            className="text-[var(--foreground)] transition-colors hover:text-[var(--primary)]"
          >
            Health Check
          </Link>
        </div>
      </div>
    </nav>
  );
}

