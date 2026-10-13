"use client";

import { useEffect, useState, type FormEvent } from "react";
import StudentShell, {
  Field,
  StatusBadge,
  btnPrimary,
  btnSecondary,
  cardClass,
  formatDate,
  inputClass,
  itemClass,
  useActiveProject,
} from "@/components/StudentShell";
import {
  createId,
  getMilestones,
  saveMilestones,
  type Milestone,
} from "@/lib/project-storage";

type MilestoneStatus = Milestone["status"];

function sortByDueDate(list: Milestone[]) {
  return [...list].sort((a, b) => {
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;
    return a.dueDate.localeCompare(b.dueDate);
  });
}

export default function MilestonesPage() {
  const project = useActiveProject();

  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState<MilestoneStatus>("Upcoming");

  // Load only the milestones of THIS project
  useEffect(() => {
    if (!project) return;
    setMilestones(
      sortByDueDate(getMilestones().filter((m) => m.projectId === project.id)),
    );
    setShowForm(false);
    setEditingId(null);
  }, [project]);

  if (!project) return null;

  const today = new Date().toISOString().slice(0, 10);

  // Saves this project's milestones and keeps other projects' untouched
  function persist(projectMilestones: Milestone[]) {
    if (!project) return;
    const others = getMilestones().filter((m) => m.projectId !== project.id);
    saveMilestones([...others, ...projectMilestones]);
    setMilestones(sortByDueDate(projectMilestones));
  }

  function openAdd() {
    setEditingId(null);
    setTitle("");
    setDescription("");
    setDueDate("");
    setStatus("Upcoming");
    setShowForm(true);
  }

  function openUpdate(m: Milestone) {
    setEditingId(m.id);
    setTitle(m.title);
    setDescription(m.description);
    setDueDate(m.dueDate);
    setStatus(m.status);
    setShowForm(true);
  }

  function closeForm() {
    // Cancel: saved data stays as it was
    setShowForm(false);
    setEditingId(null);
  }

  function handleSave(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!project || !title.trim()) return;

    const entry: Milestone = {
      id: editingId ?? createId(),
      projectId: project.id,
      title: title.trim(),
      description: description.trim(),
      dueDate,
      status,
    };

    const next = editingId
      ? milestones.map((m) => (m.id === editingId ? entry : m))
      : [...milestones, entry];

    persist(next);
    closeForm();
  }

  function handleDelete(id: string) {
    if (!window.confirm("Delete this milestone?")) return;
    persist(milestones.filter((m) => m.id !== id));
  }

  const completed = milestones.filter((m) => m.status === "Completed").length;

  return (
    <StudentShell
      project={project}
      activeHref="/student/milestones"
      section="MILESTONES"
      title="Milestones"
      subtitle="Key project goals for"
      action={
        !showForm && milestones.length > 0 ? (
          <button type="button" onClick={openAdd} className={btnPrimary}>
            + Add Milestone
          </button>
        ) : undefined
      }
    >
      {/* ---------- FORM ---------- */}
      {showForm && (
        <section className={cardClass}>
          <h2 className="mb-6 text-2xl font-extrabold">
            {editingId ? "Update Milestone" : "Add Milestone"}
          </h2>

          <form onSubmit={handleSave} className="space-y-5">
            <Field label="Milestone title">
              <input
                className={inputClass}
                placeholder="e.g. Complete database design"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </Field>

            <Field label="Description">
              <textarea
                className={`${inputClass} min-h-[100px]`}
                placeholder="What should be achieved in this milestone?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Due date">
                <input
                  type="date"
                  className={inputClass}
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  required
                />
              </Field>
              <Field label="Status">
                <select
                  className={inputClass}
                  value={status}
                  onChange={(e) => setStatus(e.target.value as MilestoneStatus)}
                >
                  <option value="Upcoming">Upcoming</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </Field>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <button type="submit" className={btnPrimary}>
                Save
              </button>
              <button type="button" onClick={closeForm} className={btnSecondary}>
                Cancel
              </button>
            </div>
          </form>
        </section>
      )}

      {/* ---------- EMPTY STATE ---------- */}
      {!showForm && milestones.length === 0 && (
        <section className="rounded-3xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-50 text-3xl text-teal-800">
            ◆
          </div>
          <h2 className="mt-5 text-xl font-bold text-[#0C2430]">
            No milestones created yet
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Click Add Milestone to set your first project goal.
          </p>
          <button
            type="button"
            onClick={openAdd}
            className={`${btnPrimary} mt-6`}
          >
            + Add Milestone
          </button>
        </section>
      )}

      {/* ---------- CARDS ---------- */}
      {!showForm && milestones.length > 0 && (
        <section className={cardClass}>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-[#176B73]/20 pb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-extrabold">Project Milestones</h2>
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#176B73] text-sm font-bold text-[#7FD6CC]">
                {milestones.length}
              </span>
            </div>
            <span className="text-xs text-slate-400">
              {completed} of {milestones.length} completed
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {milestones.map((m) => {
              const overdue =
                m.status !== "Completed" && !!m.dueDate && m.dueDate < today;

              return (
                <div key={m.id} className={`${itemClass} flex flex-col`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#176B73] text-lg font-black text-[#7FD6CC]">
                        ◆
                      </div>
                      <h3 className="pt-2 text-base font-bold text-white">
                        {m.title}
                      </h3>
                    </div>
                    <StatusBadge status={m.status} />
                  </div>

                  {m.description && (
                    <p className="mt-3 whitespace-pre-wrap text-sm text-slate-300">
                      {m.description}
                    </p>
                  )}

                  <p className="mt-4 flex-1 border-t border-[#176B73]/20 pt-3 text-xs text-slate-300">
                    Due:{" "}
                    <span className="text-white">{formatDate(m.dueDate)}</span>
                    {overdue && (
                      <span className="ml-2 rounded-md bg-red-400/15 px-2 py-0.5 font-semibold text-red-300">
                        Overdue
                      </span>
                    )}
                  </p>

                  <div className="mt-4 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => openUpdate(m)}
                      className="rounded-lg bg-[#176B73] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#1f8791]"
                    >
                      Update
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(m.id)}
                      className="text-xs font-semibold text-red-300 hover:text-red-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </StudentShell>
  );
}