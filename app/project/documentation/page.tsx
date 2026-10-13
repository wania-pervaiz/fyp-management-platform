"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import StudentShell, {
  Field,
  btnPrimary,
  btnSecondary,
  cardClass,
  inputClass,
  itemClass,
  useActiveProject,
} from "@/components/StudentShell";
import { createId } from "@/lib/project-storage";
import {
  getDocEntries,
  saveDocEntries,
  type DocEntry,
} from "@/lib/project-data";

export default function DocumentationPage() {
  const project = useActiveProject();

  const [docs, setDocs] = useState<DocEntry[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [kind, setKind] = useState<DocEntry["kind"]>("none");
  const [attachmentName, setAttachmentName] = useState("");
  const [comment, setComment] = useState("");

  useEffect(() => {
    if (!project) return;
    setDocs(getDocEntries(project.id));
    setShowForm(false);
    setEditingId(null);
  }, [project]);

  if (!project) return null;

  function openAdd() {
    setEditingId(null);
    setName("");
    setKind("none");
    setAttachmentName("");
    setComment("");
    setShowForm(true);
  }

  function openUpdate(doc: DocEntry) {
    setEditingId(doc.id);
    setName(doc.name);
    setKind(doc.kind);
    setAttachmentName(doc.attachmentName);
    setComment(doc.comment);
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingId(null);
  }

  function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setKind("file");
    setAttachmentName(file.name);
    e.target.value = "";
  }

  function handleFolder(e: ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const first = files[0] as File & { webkitRelativePath?: string };
    const folderName = first.webkitRelativePath?.split("/")[0] || "Folder";
    setKind("folder");
    setAttachmentName(`${folderName} (${files.length} files)`);
    e.target.value = "";
  }

  function handleSave(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!project || !name.trim()) return;

    const existing = docs.find((d) => d.id === editingId);

    const entry: DocEntry = {
      id: editingId ?? createId(),
      projectId: project.id,
      name: name.trim(),
      kind,
      attachmentName,
      comment: comment.trim(),
      addedAt: existing?.addedAt ?? new Date().toISOString(),
    };

    const next = editingId
      ? docs.map((d) => (d.id === editingId ? entry : d))
      : [...docs, entry];

    saveDocEntries(project.id, next);
    setDocs(next);
    closeForm();
  }

  function handleDelete(id: string) {
    if (!project) return;
    if (!window.confirm("Delete this document?")) return;
    const next = docs.filter((d) => d.id !== id);
    saveDocEntries(project.id, next);
    setDocs(next);
  }

  return (
    <StudentShell
      project={project}
      activeHref="/student/documentation"
      section="DOCUMENTATION"
      title="Documentation"
      subtitle="Project documents for"
      action={
        !showForm && docs.length > 0 ? (
          <button type="button" onClick={openAdd} className={btnPrimary}>
            + Add Document
          </button>
        ) : undefined
      }
    >
      {showForm && (
        <section className={cardClass}>
          <h2 className="mb-6 text-2xl font-extrabold">
            {editingId ? "Update Document" : "Add Document"}
          </h2>

          <form onSubmit={handleSave} className="space-y-5">
            <Field label="Document name">
              <input
                className={inputClass}
                placeholder="e.g. Project Proposal"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Field>

            <Field label="File or folder">
              <div className="flex flex-wrap items-center gap-3">
                <label className={btnSecondary}>
                  Add File
                  <input type="file" className="hidden" onChange={handleFile} />
                </label>
                <label className={btnSecondary}>
                  Add Folder
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFolder}
                    {...({ webkitdirectory: "", directory: "" } as Record<
                      string,
                      string
                    >)}
                  />
                </label>
                {attachmentName && (
                  <span className="rounded-lg bg-[#176B73]/30 px-3 py-2 text-xs font-semibold text-[#7FD6CC]">
                    {kind === "folder" ? "📁" : "📄"} {attachmentName}
                  </span>
                )}
              </div>
            </Field>

            <Field label="Comment">
              <textarea
                className={`${inputClass} min-h-[110px]`}
                placeholder="Write a comment about this document..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </Field>

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

      {!showForm && docs.length === 0 && (
        <section className="rounded-3xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-50 text-3xl text-teal-800">
            ▤
          </div>
          <h2 className="mt-5 text-xl font-bold text-[#0C2430]">
            No documents added yet
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Click Add Document to attach your first file or folder.
          </p>
          <button
            type="button"
            onClick={openAdd}
            className={`${btnPrimary} mt-6`}
          >
            + Add Document
          </button>
        </section>
      )}

      {!showForm && docs.length > 0 && (
        <section className={cardClass}>
          <div className="mb-6 flex items-center gap-2 border-b border-[#176B73]/20 pb-4">
            <h2 className="text-2xl font-extrabold">Documents</h2>
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#176B73] text-sm font-bold text-[#7FD6CC]">
              {docs.length}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {docs.map((doc) => (
              <div key={doc.id} className={itemClass}>
                <h3 className="text-base font-bold text-white">{doc.name}</h3>

                {doc.attachmentName && (
                  <p className="mt-2 inline-block rounded-lg bg-[#176B73]/30 px-3 py-1.5 text-xs font-semibold text-[#7FD6CC]">
                    {doc.kind === "folder" ? "📁" : "📄"} {doc.attachmentName}
                  </p>
                )}

                {doc.comment && (
                  <p className="mt-3 whitespace-pre-wrap text-sm text-slate-300">
                    {doc.comment}
                  </p>
                )}

                <p className="mt-3 text-xs text-slate-300">
                  Added {new Date(doc.addedAt).toLocaleDateString()}
                </p>

                <div className="mt-4 flex items-center justify-between border-t border-[#176B73]/20 pt-3">
                  <button
                    type="button"
                    onClick={() => openUpdate(doc)}
                    className="rounded-lg bg-[#176B73] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#1f8791]"
                  >
                    Update
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(doc.id)}
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