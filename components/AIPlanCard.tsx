"use client";

import { useState } from "react";
import {
  createId,
  getMilestones,
  saveMilestones,
  type Project,
} from "@/lib/project-storage";
import { getTaskGroups, saveTaskGroups } from "@/lib/project-data";
import { btnPrimary, btnSecondary, cardClass } from "@/components/StudentShell";

type Plan = {
  tasks: { title: string; description: string }[];
  milestones: { title: string; description: string; weeksFromStart: number }[];
};

export default function AIPlanCard({
  project,
  onSaved,
}: {
  project: Project;
  onSaved: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [plan, setPlan] = useState<Plan | null>(null);

  async function generate() {
    setLoading(true);
    setError("");
    setPlan(null);
    try {
      const res = await fetch("/api/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: project.title,
          description: project.description,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong.");
      setPlan(data as Plan);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  function accept() {
    if (!plan) return;
    const start = project.startDate ? new Date(project.startDate) : new Date();
    const dueFor = (weeks: number) => {
      const d = new Date(start);
      d.setDate(d.getDate() + weeks * 7);
      return d.toISOString().slice(0, 10);
    };

    saveTaskGroups(project.id, [
      ...getTaskGroups(project.id),
      {
        id: createId(),
        projectId: project.id,
        name: "AI Suggested Plan",
        role: "Member",
        tasks: plan.tasks.map((t) => ({
          id: createId(),
          title: t.title,
          description: t.description,
          status: "Pending" as const,
        })),
      },
    ]);

    saveMilestones([
      ...getMilestones(),
      ...plan.milestones.map((m) => ({
        id: createId(),
        projectId: project.id,
        title: m.title,
        description: m.description,
        dueDate: dueFor(m.weeksFromStart),
        status: "Upcoming" as const,
      })),
    ]);

    setPlan(null);
    onSaved();
  }

  return (
    <section className={cardClass} aria-labelledby="ai-plan-heading">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 id="ai-plan-heading" className="text-2xl font-extrabold">
            AI Project Planner
          </h2>
          <p className="mt-1 text-sm text-slate-300">
            Generate suggested tasks and milestones from your project
            description. Review them before saving.
          </p>
        </div>
        <button
          type="button"
          onClick={generate}
          disabled={loading}
          className={btnPrimary}
        >
          {loading ? "Generating..." : "Generate plan with AI"}
        </button>
      </div>

      <div aria-live="polite">
        {error && (
          <p role="alert" className="mt-4 rounded-xl bg-red-400/15 px-4 py-3 text-sm text-red-200">
            {error}
          </p>
        )}

        {plan && (
          <div className="mt-6 space-y-5">
            <div>
              <h3 className="mb-2 text-sm font-bold uppercase tracking-widest text-[#7FD6CC]">
                Suggested tasks
              </h3>
              <ul className="space-y-2">
                {plan.tasks.map((t, i) => (
                  <li key={i} className="rounded-xl bg-[#123342] p-3 text-sm">
                    <p className="font-semibold text-white">{t.title}</p>
                    <p className="text-slate-300">{t.description}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="mb-2 text-sm font-bold uppercase tracking-widest text-[#7FD6CC]">
                Suggested milestones
              </h3>
              <ul className="space-y-2">
                {plan.milestones.map((m, i) => (
                  <li key={i} className="rounded-xl bg-[#123342] p-3 text-sm">
                    <p className="font-semibold text-white">
                      {m.title}{" "}
                      <span className="text-xs font-normal text-slate-300">
                        (week {m.weeksFromStart})
                      </span>
                    </p>
                    <p className="text-slate-300">{m.description}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-wrap gap-3">
              <button type="button" onClick={accept} className={btnPrimary}>
                Accept and save
              </button>
              <button type="button" onClick={() => setPlan(null)} className={btnSecondary}>
                Discard
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}