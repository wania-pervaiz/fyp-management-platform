import Link from "next/link";

type PageHeaderProps = {
  title: string;
  description: string;
};

export default function PageHeader({
  title,
  description,
}: PageHeaderProps) {
  return (
    <div className="mb-8">
      <Link
        href="/student/dashboard"
        className="text-sm font-medium text-indigo-600 hover:underline focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        ← Back to Dashboard
      </Link>

      <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">
        {title}
      </h1>

      <p className="mt-2 max-w-2xl text-slate-600">
        {description}
      </p>
    </div>
  );
}