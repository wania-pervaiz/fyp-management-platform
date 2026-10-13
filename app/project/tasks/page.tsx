"use client";

import { useEffect, useState, type FormEvent } from "react";
import StudentShell, {
  Field,
  StatusBadge,
  btnPrimary,
  btnSecondary,
  cardClass,
  getInitials,
  inputClass,
  itemClass,
  useActiveProject,
} from "@/components/StudentShell";
import { createId } from "@/lib/project-storage";
import AIPlanCard from "@/components/AIPlanCard";
import {
  getTaskGroups,
  groupStatus,
  saveTaskGroups,
  type MemberTask,
  type Role,
  type Status,
  type TaskGroup,
} from "@/lib/project-data";

function blankTask(): MemberTask {
  return { id: createId(), title: "", description: "", status: "Pending" };
}

export default function TasksPage() {
  const project = useActiveProject();

  const [groups, setGroups] = useState<TaskGroup[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [role, setRole] = useState<Role>("Member");
  const [taskCount, setTaskCount] = useState(1);
  const [tasks, setTasks] = useState<MemberTask[]>([blankTask()]);

  // Load the saved tasks of THIS project
  useEffect(() => {
    if (!project) return;
    setGroups(getTaskGroups(project.id));
    setShowForm(false);
    setEditingId(null);
  }, [project]);

  if (!project) return null;

  function openAdd() {
    setEditingId(null);
    setName("");
    setRole("Member");
    setTaskCount(1);
    setTasks([blankTask()]);
    setShowForm(true);
  }

  function openUpdate(group: TaskGroup) {
    setEditingId(group.id);
    setName(group.name);
    setRole(group.role);
    setTaskCount(group.tasks.length || 1);
    setTasks(group.tasks.length ? group.tasks : [blankTask()]);
    setShowForm(true);
  }

  function closeForm() {
    // Cancel: nothing is changed, saved data stays as it was
    setShowForm(false);
    setEditingId(null);
  }

  function changeCount(value: number) {
    const count = Math.max(1, Math.min(10, value || 1));
    setTaskCount(count);
    setTasks((prev) =>
      count > prev.length
        ? [
            ...prev,
            ...Array.from({ length: count - prev.length }, () => blankTask()),
          ]
        : prev.slice(0, count),
    );
  }

  function updateTask(id: string, patch: Partial<MemberTask>) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  }

  function handleSave(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!project || !name.trim()) return;

    const entry: TaskGroup = {
      id: editingId ?? createId(),
      projectId: project.id,
      name: name.trim(),
      role,
      tasks: tasks.map((t) => ({
        ...t,
        title: t.title.trim(),
        description: t.description.trim(),
      })),
    };

    const next = editingId
      ? groups.map((g) => (g.id === editingId ? entry : g))
      : [...groups, entry];

    saveTaskGroups(project.id, next);
    setGroups(next);
    closeForm();
  }

  function handleDelete(id: string) {
    if (!project) return;
    if (!window.confirm("Delete this task card?")) return;
    const next = groups.filter((g) => g.id !== id);
    saveTaskGroups(project.id, next);
    setGroups(next);
  }

  return (
    <StudentShell
      project={project}
      activeHref="/student/tasks"
      section="TASKS"
      title="Tasks"
      subtitle="Assign and track tasks for"
      action={
        !showForm && groups.length > 0 ? (
          <button type="button" onClick={openAdd} className={btnPrimary}>
            + Add Task
          </button>
        ) : undefined
      }
      
    >
      <AIPlanCard
  project={project}
  onSaved={() => setGroups(getTaskGroups(project.id))}
/>
      {/* ---------- FORM ---------- */}
      {showForm && (
        <section className={cardClass}>
          <h2 className="mb-6 text-2xl font-extrabold">
            {editingId ? "Update Task" : "Add Task"}
          </h2>

          <form onSubmit={handleSave} className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Name">
                <input
                  className={inputClass}
                  placeholder="Member name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </Field>
              <Field label="Role">
                <select
                  className={inputClass}
                  value={role}
                  onChange={(e) => setRole(e.target.value as Role)}
                >
                  <option value="Leader">Leader</option>
                  <option value="Member">Member</option>
                </select>
              </Field>
            </div>

            <Field label="Task count">
              <input
                type="number"
                min={1}
                max={10}
                className={`${inputClass} sm:w-40`}
                value={taskCount}
                onChange={(e) => changeCount(Number(e.target.value))}
              />
            </Field>

            <div className="space-y-4">
              {tasks.map((task, index) => (
                <div
                  key={task.id}
                  className="space-y-3 rounded-2xl border border-[#176B73]/30 bg-[#123342] p-4"
                >
                  <p className="text-xs font-bold uppercase tracking-widest text-[#7FD6CC]">
                    Task {index + 1}
                  </p>
                  <input
                    className={inputClass}
                    placeholder="Task name (e.g. Create login page)"
                    value={task.title}
                    onChange={(e) =>
                      updateTask(task.id, { title: e.target.value })
                    }
                    required
                  />
                  <textarea
                    className={`${inputClass} min-h-[80px]`}
                    placeholder="Description"
                    value={task.description}
                    onChange={(e) =>
                      updateTask(task.id, { description: e.target.value })
                    }
                  />
                  <select
                    className={inputClass}
                    value={task.status}
                    onChange={(e) =>
                      updateTask(task.id, { status: e.target.value as Status })
                    }
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              ))}
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
      {!showForm && groups.length === 0 && (
        <section className="rounded-3xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-50 text-3xl text-teal-800">
            ✓
          </div>
          <h2 className="mt-5 text-xl font-bold text-[#0C2430]">
            No tasks created yet
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Click Add Task to assign work to a team member.
          </p>
          <button
            type="button"
            onClick={openAdd}
            className={`${btnPrimary} mt-6`}
          >
            + Add Task
          </button>
        </section>
      )}

      {/* ---------- CARDS ---------- */}
      {!showForm && groups.length > 0 && (
        <section className={cardClass}>
          <div className="mb-6 flex items-center gap-2 border-b border-[#176B73]/20 pb-4">
            <h2 className="text-2xl font-extrabold">Assigned Tasks</h2>
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#176B73] text-sm font-bold text-[#7FD6CC]">
              {groups.length}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {groups.map((group) => (
              <div key={group.id} className={`${itemClass} flex flex-col`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#176B73] text-lg font-black text-[#7FD6CC]">
                      {getInitials(group.name, "M")}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">
                        {group.name}
                      </h3>
                      <span className="mt-0.5 inline-block rounded-md bg-[#176B73]/40 px-2 py-0.5 text-[11px] font-semibold text-[#7FD6CC]">
                        {group.role}
                      </span>
                    </div>
                  </div>
                  <StatusBadge status={groupStatus(group.tasks)} />
                </div>

                <ul className="mt-4 flex-1 space-y-2 border-t border-[#176B73]/20 pt-3">
                  {group.tasks.map((task) => (
                    <li
                      key={task.id}
                      className="flex items-start justify-between gap-3 text-sm"
                    >
                      <div className="min-w-0">
                        <p className="font-semibold text-white">{task.title}</p>
                        {task.description && (
                          <p className="text-xs text-slate-400">
                            {task.description}
                          </p>
                        )}
                      </div>
                      <StatusBadge status={task.status} />
                    </li>
                  ))}
                </ul>

                <div className="mt-4 flex items-center justify-between border-t border-[#176B73]/20 pt-3">
                  <button
                    type="button"
                    onClick={() => openUpdate(group)}
                    className="rounded-lg bg-[#176B73] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#1f8791]"
                  >
                    Update
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(group.id)}
                    className="text-xs font-semibold text-red-300 hover:text-red-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </StudentShell>
  );
}