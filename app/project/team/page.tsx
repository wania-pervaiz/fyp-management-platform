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
import {
  getTeamEntries,
  saveTeamEntries,
  type Status,
  type TeamEntry,
} from "@/lib/project-data";

const ROLES = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "UI/UX Designer",
  "Documentation",
  "Tester",
];

// Each member box needs a stable id so typing doesn't lose focus
type MemberBox = { id: string; name: string };

function blankMember(name = ""): MemberBox {
  return { id: createId(), name };
}

export default function TeamPage() {
  const project = useActiveProject();

  const [entries, setEntries] = useState<TeamEntry[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [teamName, setTeamName] = useState("");
  const [role, setRole] = useState(ROLES[0]);
  const [status, setStatus] = useState<Status>("Pending");
  const [memberCount, setMemberCount] = useState(2);
  const [memberBoxes, setMemberBoxes] = useState<MemberBox[]>([
    blankMember(),
    blankMember(),
  ]);

  useEffect(() => {
    if (!project) return;
    setEntries(getTeamEntries(project.id));
    setShowForm(false);
    setEditingId(null);
  }, [project]);

  if (!project) return null;

  function openAdd() {
    setEditingId(null);
    setTeamName("");
    setRole(ROLES[0]);
    setStatus("Pending");
    setMemberCount(2);
    setMemberBoxes([blankMember(), blankMember()]);
    setShowForm(true);
  }

  function openUpdate(entry: TeamEntry) {
    // Older entries have no members list, so use their name as the one member
    const names = entry.members?.length ? entry.members : [entry.name];
    setEditingId(entry.id);
    setTeamName(entry.name);
    setRole(ROLES.includes(entry.role) ? entry.role : ROLES[0]);
    setStatus(entry.status);
    setMemberCount(names.length);
    setMemberBoxes(names.map((n) => blankMember(n)));
    setShowForm(true);
  }

  function closeForm() {
    // Cancel: saved data stays as it was
    setShowForm(false);
    setEditingId(null);
  }

  function changeCount(value: number) {
    const count = Math.max(1, Math.min(10, value || 1));
    setMemberCount(count);
    setMemberBoxes((prev) =>
      count > prev.length
        ? [
            ...prev,
            ...Array.from({ length: count - prev.length }, () =>
              blankMember(),
            ),
          ]
        : prev.slice(0, count),
    );
  }

  function updateMemberName(id: string, value: string) {
    setMemberBoxes((prev) =>
      prev.map((m) => (m.id === id ? { ...m, name: value } : m)),
    );
  }

  function handleSave(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!project || !teamName.trim()) return;

    const members = memberBoxes
      .map((m) => m.name.trim())
      .filter(Boolean);

    if (members.length === 0) return;

    const entry: TeamEntry = {
      id: editingId ?? createId(),
      projectId: project.id,
      name: teamName.trim(),
      role,
      status,
      members,
    };

    const next = editingId
      ? entries.map((x) => (x.id === editingId ? entry : x))
      : [...entries, entry];

    saveTeamEntries(project.id, next);
    setEntries(next);
    closeForm();
  }

  function handleDelete(id: string) {
    if (!project) return;
    if (!window.confirm("Delete this team?")) return;
    const next = entries.filter((x) => x.id !== id);
    saveTeamEntries(project.id, next);
    setEntries(next);
  }

  return (
    <StudentShell
      project={project}
      activeHref="/student/team"
      section="TEAM"
      title="Team"
      subtitle="Manage the teams of"
      action={
        !showForm && entries.length > 0 ? (
          <button type="button" onClick={openAdd} className={btnPrimary}>
            + Add Team
          </button>
        ) : undefined
      }
    >
      {/* ---------- FORM ---------- */}
      {showForm && (
        <section className={cardClass}>
          <h2 className="mb-6 text-2xl font-extrabold">
            {editingId ? "Update Team" : "Add Team"}
          </h2>

          <form onSubmit={handleSave} className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Team name">
                <input
                  className={inputClass}
                  placeholder="e.g. Frontend Team"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  required
                />
              </Field>
              <Field label="Role">
                <select
                  className={inputClass}
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  {ROLES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Status">
                <select
                  className={inputClass}
                  value={status}
                  onChange={(e) => setStatus(e.target.value as Status)}
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </Field>
            </div>

            <Field label="Number of team members">
              <input
                type="number"
                min={1}
                max={10}
                className={`${inputClass} sm:w-40`}
                value={memberCount}
                onChange={(e) => changeCount(Number(e.target.value))}
              />
            </Field>

            <div className="grid gap-3 sm:grid-cols-2">
              {memberBoxes.map((box, index) => (
                <input
                  key={box.id}
                  className={inputClass}
                  placeholder={`Member ${index + 1} name`}
                  value={box.name}
                  onChange={(e) => updateMemberName(box.id, e.target.value)}
                  required={index === 0}
                />
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
      {!showForm && entries.length === 0 && (
        <section className="rounded-3xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-50 text-3xl text-teal-800">
            ♧
          </div>
          <h2 className="mt-5 text-xl font-bold text-[#0C2430]">
            No teams added yet
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Click Add Team to create your first team.
          </p>
          <button
            type="button"
            onClick={openAdd}
            className={`${btnPrimary} mt-6`}
          >
            + Add Team
          </button>
        </section>
      )}

      {/* ---------- CARDS ---------- */}
      {!showForm && entries.length > 0 && (
        <section className={cardClass}>
          <div className="mb-6 flex items-center gap-2 border-b border-[#176B73]/20 pb-4">
            <h2 className="text-2xl font-extrabold">Teams</h2>
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#176B73] text-sm font-bold text-[#7FD6CC]">
              {entries.length}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {entries.map((entry) => {
              const people = entry.members?.length
                ? entry.members
                : [entry.name];

              return (
                <div key={entry.id} className={`${itemClass} flex flex-col`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#176B73] text-lg font-black text-[#7FD6CC]">
                        {getInitials(entry.name, "T")}
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-white">
                          {entry.name}
                        </h3>
                        <span className="mt-0.5 inline-block rounded-md bg-[#176B73]/40 px-2 py-0.5 text-[11px] font-semibold text-[#7FD6CC]">
                          {entry.role}
                        </span>
                      </div>
                    </div>
                    <StatusBadge status={entry.status} />
                  </div>

                  <div className="mt-4 flex-1 border-t border-[#176B73]/20 pt-3">
                    <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      Members ({people.length})
                    </p>
                    <ul className="space-y-2">
                      {people.map((person, i) => (
                        <li
                          key={`${person}-${i}`}
                          className="flex items-center gap-2 text-sm text-slate-200"
                        >
                          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#0C2430] text-[11px] font-bold text-[#7FD6CC]">
                            {getInitials(person, "M")}
                          </span>
                          {person}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-[#176B73]/20 pt-3">
                    <button
                      type="button"
                      onClick={() => openUpdate(entry)}
                      className="rounded-lg bg-[#176B73] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#1f8791]"
                    >
                      Update
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(entry.id)}
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