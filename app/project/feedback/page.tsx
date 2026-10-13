"use client";

import { useEffect, useState } from "react";
import StudentShell, {
  cardClass,
  getInitials,
  itemClass,
  useActiveProject,
} from "@/components/StudentShell";
import { getFeedback, type Feedback } from "@/lib/project-storage";
import { SAMPLE_FEEDBACK } from "@/lib/project-data";

export default function FeedbackPage() {
  const project = useActiveProject();
  const [feedback, setFeedback] = useState<Feedback[]>([]);

  useEffect(() => {
    if (!project) return;
    const saved = getFeedback().filter((f) => f.projectId === project.id);
    const all = [...(SAMPLE_FEEDBACK[project.id] ?? []), ...saved];
    all.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    setFeedback(all);
  }, [project]);

  if (!project) return null;

  return (
    <StudentShell
      project={project}
      activeHref="/student/feedback"
      section="FEEDBACK"
      title="Feedback"
      subtitle="Supervisor feedback for"
    >
      {feedback.length === 0 ? (
        <section className="rounded-3xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-50 text-3xl text-teal-800">
            ✎
          </div>
          <h2 className="mt-5 text-xl font-bold text-[#0C2430]">
            No feedback yet
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Feedback from your supervisor will appear here.
          </p>
        </section>
      ) : (
        <section className={cardClass}>
          <div className="mb-6 flex items-center gap-2 border-b border-[#176B73]/20 pb-4">
            <h2 className="text-2xl font-extrabold">Supervisor Feedback</h2>
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#176B73] text-sm font-bold text-[#7FD6CC]">
              {feedback.length}
            </span>
          </div>

          <div className="space-y-4">
            {feedback.map((item) => (
              <div key={item.id} className={itemClass}>
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#176B73] text-base font-black text-[#7FD6CC]">
                    {getInitials(item.supervisorEmail.split("@")[0], "S")}
                  </div>
                  <div>
                    <p className="font-mono text-xs font-medium text-[#7FD6CC]">
                      {item.supervisorEmail}
                    </p>
                    <p className="text-xs text-slate-300">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-slate-200">
                  {item.message}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </StudentShell>
  );
}