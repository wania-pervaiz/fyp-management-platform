async function getSystemHealth() {
  // Simulated data fetch
  return {
    status: "Healthy",
    uptime: "99.9%",
    database: "Connected",
    activeTeams: 8,
  };
}

export default async function HealthPage() {
  const data = await getSystemHealth();

  return (
    <div className="p-8 max-w-md mx-auto mt-12 rounded-xl border border-slate-200 bg-white shadow-sm">
      <h1 className="text-xl font-bold text-emerald-600 mb-4">
        System Health-Check
      </h1>
      <ul className="space-y-3 text-slate-700">
        <li className="flex justify-between border-b border-slate-100 pb-2">
          <strong className="text-slate-900">Status:</strong> 
          <span className="font-medium text-emerald-600">{data.status}</span>
        </li>
        <li className="flex justify-between border-b border-slate-100 pb-2">
          <strong className="text-slate-900">Uptime:</strong> 
          <span>{data.uptime}</span>
        </li>
        <li className="flex justify-between border-b border-slate-100 pb-2">
          <strong className="text-slate-900">Database:</strong> 
          <span className="text-indigo-600 font-medium">{data.database}</span>
        </li>
        <li className="flex justify-between pb-1">
          <strong className="text-slate-900">Active Teams:</strong> 
          <span>{data.activeTeams}</span>
        </li>
      </ul>
    </div>
  );
}