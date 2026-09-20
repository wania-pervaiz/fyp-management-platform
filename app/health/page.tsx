export default async function HealthPage() {
  const response = await fetch(
    "https://jsonplaceholder.typicode.com/todos/1"
  );

  const data = await response.json();

  return (
    <main className="min-h-screen p-8">
      <div className="mx-auto max-w-md rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">
          System Health-Check
        </h1>

        <p className="mt-2 text-sm text-slate-600">
          Application is running successfully.
        </p>

        <div className="mt-6 space-y-3">
          <p className="font-medium text-slate-900">
            Fetched Data
          </p>

          <p className="text-slate-700">
            Task ID: {data.id}
          </p>

          <p className="text-slate-700">
            Task: {data.title}
          </p>

          <p className="text-slate-700">
            Completed: {data.completed ? "Yes" : "No"}
          </p>
        </div>
      </div>
    </main>
  );
}
