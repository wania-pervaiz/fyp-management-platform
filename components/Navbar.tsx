import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="border-b border-[var(--border)] bg-[var(--card-bg)] p-4 shadow-sm">
      <div className="flex justify-center items-center gap-8 font-medium text-[var(--foreground)]">
        <Link href="/" className="transition-colors hover:text-[var(--primary)]">
          Home
        </Link>
        <Link href="/login" className="transition-colors hover:text-[var(--primary)]">
          Login
        </Link>
        <Link href="/health" className="transition-colors hover:text-[var(--primary)]">
          Health Check
        </Link>
      </div>
    </nav>
  );
}