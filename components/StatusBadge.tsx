type Status = "Completed" | "In Progress" | "Pending" | "Upcoming" | "Needs Action";

type StatusBadgeProps = {
  status: Status;
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const styles = {
    Completed: "bg-green-100 text-green-700",
    "In Progress": "bg-blue-100 text-blue-700",
    Pending: "bg-amber-100 text-amber-700",
    Upcoming: "bg-slate-100 text-slate-700",
    "Needs Action": "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${styles[status]}`}
    >
      {status}
    </span>
  );
}