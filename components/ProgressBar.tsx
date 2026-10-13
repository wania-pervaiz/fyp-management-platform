type ProgressBarProps = {
  value: number;
  label: string;
};

export default function ProgressBar({
  value,
  label,
}: ProgressBarProps) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium text-slate-700">
          {label}
        </span>

        <span className="text-sm font-semibold text-slate-900">
          {value}%
        </span>
      </div>

      <div
        className="h-3 rounded-full bg-slate-200"
        role="progressbar"
        aria-label={label}
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-3 rounded-full bg-indigo-600 transition-all"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}