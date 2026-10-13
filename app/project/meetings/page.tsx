"use client";

import { useEffect, useState, type FormEvent } from "react";
import StudentShell, {
  Field,
  btnPrimary,
  btnSecondary,
  cardClass,
  formatDate,
  getSupervisorNames,
  inputClass,
  itemClass,
  useActiveProject,
} from "@/components/StudentShell";
import { createId } from "@/lib/project-storage";
import {
  SAMPLE_SUPERVISOR_MEETINGS,
  getMeetingEntries,
  saveMeetingEntries,
  type MeetingEntry,
} from "@/lib/project-data";

function sortByDate(list: MeetingEntry[]) {
  return [...list].sort((a, b) =>
    `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`),
  );
}

export default function MeetingsPage() {
  const project = useActiveProject();

  const [meetings, setMeetings] = useState<MeetingEntry[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [supervisorName, setSupervisorName] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  useEffect(() => {
    if (!project) return;
    setMeetings(getMeetingEntries(project.id));
    setShowForm(false);
    setEditingId(null);
  }, [project]);

  if (!project) return null;

  const supervisorNames = getSupervisorNames(project);

  // Meetings set by the supervisor: saved ones + samples for demo projects
  const supervisorMeetings = sortByDate([
    ...(SAMPLE_SUPERVISOR_MEETINGS[project.id] ?? []),
    ...meetings.filter((m) => m.setBy === "supervisor"),
  ]);
  const myMeetings = sortByDate(meetings.filter((m) => m.setBy === "student"));

  function openAdd() {
    setEditingId(null);
    setTitle("");
    setSupervisorName(supervisorNames[0] ?? "");
    setDate("");
    setTime("");
    setShowForm(true);
  }

  function openUpdate(m: MeetingEntry) {
    setEditingId(m.id);
    setTitle(m.title);
    setSupervisorName(m.supervisorName);
    setDate(m.date);
    setTime(m.time);
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingId(null);
  }

  function handleSave(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!project || !title.trim() || !date || !time) return;

    const entry: MeetingEntry = {
      id: editingId ?? createId(),
      projectId: project.id,
      title: title.trim(),
      supervisorName,
      date,
      time,
      setBy: "student",
    };

    const next = editingId
      ? meetings.map((m) => (m.id === editingId ? entry : m))
      : [...meetings, entry];

    saveMeetingEntries(project.id, next);
    setMeetings(next);
    closeForm();
  }

  function handleDelete(id: string) {
    if (!project) return;
    if (!window.confirm("Delete this meeting?")) return;
    const next = meetings.filter((m) => m.id !== id);
    saveMeetingEntries(project.id, next);
    setMeetings(next);
  }

  const weekday = date
    ? new Date(`${date}T00:00:00`).toLocaleDateString(undefined, {
        weekday: "long",
      })
    : "";

  return (
    <StudentShell
      project={project}
      activeHref="/student/meetings"
      section="MEETINGS"
      title="Meetings"
      subtitle="Schedule and view meetings for"
      action={
        !showForm ? (
          <button type="button" onClick={openAdd} className={btnPrimary}>
            + Add Meeting
          </button>
        ) : undefined
      }
    >
      {showForm && (
        <section className={cardClass}>
          <h2 className="mb-6 text-2xl font-extrabold">
            {editingId ? "Update Meeting" : "Add Meeting"}
          </h2>

          <form onSubmit={handleSave} className="space-y-5">
            <Field label="Meeting title">
              <input
                className={inputClass}
                placeholder="e.g. Weekly progress meeting"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </Field>

            <Field label="Supervisor name">
              {supervisorNames.length > 0 ? (
                <select
                  className={inputClass}
                  value={supervisorName}
                  onChange={(e) => setSupervisorName(e.target.value)}
                >
                  {supervisorNames.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  className={inputClass}
                  placeholder="Supervisor name"
                  value={supervisorName}
                  onChange={(e) => setSupervisorName(e.target.value)}
                />
              )}
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label={`Day${weekday ? ` (${weekday})` : ""}`}>
                <input
                  type="date"
                  className={inputClass}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </Field>
              <Field label="Time">
                <input
                  type="time"
                  className={inputClass}
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  required
                />
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

      {!showForm && (
        <>
          {/* Meetings set by supervisor */}
          <section className={cardClass}>
            <div className="mb-6 flex items-center gap-2 border-b border-[#176B73]/20 pb-4">
              <h2 className="text-2xl font-extrabold">Set by Supervisor</h2>
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#176B73] text-sm font-bold text-[#7FD6CC]">
                {supervisorMeetings.length}
              </span>
            </div>

            {supervisorMeetings.length === 0 ? (
              <p className="text-sm text-slate-400">
                Your supervisor has not scheduled any meetings yet.
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {supervisorMeetings.map((m) => (
                  <div key={m.id} className={itemClass}>
                    <span className="rounded-full border border-[#7FD6CC]/30 bg-[#176B73]/30 px-3 py-1 text-[11px] font-semibold text-[#7FD6CC]">
                      Supervisor meeting
                    </span>
                    <h3 className="mt-3 text-base font-bold text-white">
                      {m.title}
                    </h3>
                    <p className="mt-2 text-sm text-slate-300">
                      {m.supervisorName}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      {formatDate(m.date)} · {m.time}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Meetings added by the student */}
          <section className={cardClass}>
            <div className="mb-6 flex items-center gap-2 border-b border-[#176B73]/20 pb-4">
              <h2 className="text-2xl font-extrabold">My Meetings</h2>
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#176B73] text-sm font-bold text-[#7FD6CC]">
                {myMeetings.length}
              </span>
            </div>

            {myMeetings.length === 0 ? (
              <p className="text-sm text-slate-400">
                No meetings added yet. Click Add Meeting to schedule one.
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {myMeetings.map((m) => (
                  <div key={m.id} className={itemClass}>
                    <h3 className="text-base font-bold text-white">
                      {m.title}
                    </h3>
                    <p className="mt-2 text-sm text-slate-300">
                      With {m.supervisorName || "supervisor"}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      {formatDate(m.date)} · {m.time}
                    </p>

                    <div className="mt-4 flex items-center justify-between border-t border-[#176B73]/20 pt-3">
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
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </StudentShell>
  );
}