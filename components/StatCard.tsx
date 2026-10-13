type StatCardProps = {
  title: string;
  value: string;
  description?: string;
  icon: string;
  color?: "blue" | "green" | "purple" | "orange" | "yellow";
};

export default function StatCard({
  title,
  value,
  description,
  icon,
  color = "blue",
}: StatCardProps) {
  const colors = {
    blue: {
      card: "border-blue-200 bg-blue-50",
      icon: "bg-blue-100 text-blue-700",
    },
    green: {
      card: "border-green-200 bg-green-50",
      icon: "bg-green-100 text-green-700",
    },
    purple: {
      card: "border-purple-200 bg-purple-50",
      icon: "bg-purple-100 text-purple-700",
    },
    orange: {
      card: "border-orange-200 bg-orange-50",
      icon: "bg-orange-100 text-orange-700",
    },
    yellow: {
      card: "border-yellow-200 bg-yellow-50",
      icon: "bg-yellow-100 text-yellow-700",
    },
  };

  return (
    <div
      className={`rounded-xl border p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md ${colors[color].card}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-600">
            {title}
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-900">
            {value}
          </p>

          {description && (
            <p className="mt-1 text-sm text-slate-600">
              {description}
            </p>
          )}
        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl text-lg font-bold ${colors[color].icon}`}
          aria-hidden="true"
        >
          {icon}
        </div>
      </div>
    </div>
  );
}