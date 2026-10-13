"use client";

import { useEffect, useState, type FormEvent } from "react";
import SupervisorShell, { useSupervisor } from "@/components/SupervisorShell";
import {
  btnPrimary,
  btnSecondary,
  cardClass,
  getInitials,
  inputClass,
  itemClass,
} from "@/components/StudentShell";
import {
  createId,
  getFeedback,
  saveFeedback,
  type Feedback,
} from "@/lib/project-storage";
import { SAMPLE_FEEDBACK } from "@/lib/project-data";

export default function SupervisorFeedback() {
  const { user, projects } = useSupervisor();

  const [saved, setSaved] = useState<Feedback[]>([]);
  const [openFor, setOpenFor] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [text, setText] = useState("");

  useEffect(() => {
    setSaved(getFeedback());
  }, []);

  if (!user) return null;
  const email = user.email;

  function openAdd(projectId: string) {
    setEditingId(null);
    setText("");
    setOpenFor(projectId);
  }

  function openEdit(item: Feedback) {
    setEditingId(item.id);
    setText(item.message);
    setOpenFor(item.projectId);
  }

  function closeForm() {
    setOpenFor(null);
    setEditingId(null);
    setText("");
  }

  function handleSave(e: FormEvent<HTMLFormElement>, projectId: string) {
    e.preventDefault();
    if (!text.trim()) return;

    const next = editingId
      ? getFeedback().map((f) =>
          f.id === editingId ? { ...f, message: text.trim() } : f,
        )
      : [
          ...getFeedback(),
          {
            id: createId(),
            projectId,
            supervisorEmail: email,
            message: text.trim(),
            createdAt: new Date().toISOString(),
          },
        ];

    saveFeedback(next);
    setSaved(next);
    closeForm();
  }

  function handleDelete(id: string) {
    if (!window.confirm("Delete this feedback?")) return;
    const next = getFeedback().filter((f) => f.id !== id);
    saveFeedback(next);
    setSaved(next);
  }

  return (
    <SupervisorShell
      user={user}
      activeHref="/supervisor/feedback"
      section="FEEDBACK"
      title="Feedback"
      subtitle="Give feedback to the projects you supervise. Students see it on their Feedback page."
    >
      {projects.length === 0 ? (
        <section className="rounded-3xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-50 text-3xl text-teal-800">
            ✎
          </div>
          <h2 className="mt-5 text-xl font-bold text-[#0C2430]">
            No projects yet
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Accept a project invitation on your Home page to give feedback.
          </p>
        </section>
      ) : (
        projects.map((project) => {
          const items = [
            ...(SAMPLE_FEEDBACK[project.id] ?? []),
            ...saved.filter((f) => f.projectId === project.id),
          ].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

          const formOpen = openFor === project.id;

          return (
            <section key={project.id} className={cardClass}>
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-[#176B73]/20 pb-4">
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-extrabold">{project.title}</h2>
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#176B73] text-sm font-bold text-[#7FD6CC]">
                    {items.length}
                  </span>
                </div>
                {!formOpen && (
                  <button
                    type="button"
                    onClick={() => openAdd(project.id)}
                    className={btnPrimary}
                  >
                    + Add Feedback
                  </button>
                )}
              </div>

              {formOpen && (
                <form
                  onSubmit={(e) => handleSave(e, project.id)}
                  className="mb-6 space-y-4 rounded-2xl border border-[#176B73]/30 bg-[#123342] p-4"
                >
                  <p className="text-xs font-bold uppercase tracking-widest text-[#7FD6CC]">
                    {editingId ? "Update feedback" : "New feedback"}
                  </p>
                  <textarea
                    className={`${inputClass} min-h-[120px]`}
                    placeholder="Write your feedback for the team..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    required
                  />
                  <div className="flex flex-wrap gap-3">
                    <button type="submit" className={btnPrimary}>
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={closeForm}
                      className={btnSecondary}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {items.length === 0 ? (
                <p className="text-sm text-slate-400">
                  No feedback given yet for this project.
                </p>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => {
                    const editable = saved.some((f) => f.id === item.id);
                    return (
                      <div key={item.id} className={itemClass}>
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#176B73] text-base font-black text-[#7FD6CC]">
                            {getInitials(item.supervisorEmail.split("@")[0], "S")}
                          </div>
                          <div>
                            <p className="font-mono text-xs font-medium text-[#7FD6CC]">
                              {item.supervisorEmail}
                            </p>
                            <p className="text-xs text-slate-400">
                              {new Date(item.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-slate-200">
                          {item.message}
                        </p>

                        {editable && (
                          <div className="mt-4 flex items-center justify-between border-t border-[#176B73]/20 pt-3">
                            <button
                              type="button"
                              onClick={() => openEdit(item)}
                              className="rounded-lg bg-[#176B73] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#1f8791]"
                            >
                              Update
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(item.id)}
                              className="text-xs font-semibold text-red-300 hover:text-red-200"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          );
        })
      )}
    </SupervisorShell>
  );
}