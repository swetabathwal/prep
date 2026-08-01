"use client";

import { useEffect, useState, useTransition } from "react";
import { createClient } from "@/lib/supabase/client";
import { saveNote, deleteNote } from "@/app/actions";

interface Note {
  id: string;
  title: string | null;
  body: string;
  tags: string[];
  updated_at: string;
}

/** Long notes get clamped in the list with a fade + Expand affordance. */
export const isLong = (body: string) =>
  body.length > 420 || body.split("\n").length > 10;

/**
 * A note button that opens a side drawer. Attach it to anything —
 * a DSA problem, a roadmap item, a system design problem, a project milestone.
 */
export default function NoteDrawer({
  scope,
  refKey,
  label,
  count = 0,
  path,
}: {
  scope: string;
  refKey: string;
  label: string;
  count?: number;
  path?: string;
}) {
  const [open, setOpen] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const [draft, setDraft] = useState("");
  const [title, setTitle] = useState("");
  const [editing, setEditing] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<Note | null>(null);
  const [pending, start] = useTransition();

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    const supabase = createClient();
    supabase
      .from("notes")
      .select("id,title,body,tags,updated_at")
      .eq("scope", scope)
      .eq("ref", refKey)
      .order("updated_at", { ascending: false })
      .then(({ data }) => {
        setNotes((data ?? []) as Note[]);
        setLoading(false);
      });
  }, [open, scope, refKey]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      // close the expanded reader first, then the drawer
      if (expanded) setExpanded(null);
      else setOpen(false);
    };
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, expanded]);

  // keep the expanded note in sync after an edit/delete
  useEffect(() => {
    if (!expanded) return;
    const fresh = notes.find((x) => x.id === expanded.id);
    if (!fresh) setExpanded(null);
    else if (fresh !== expanded) setExpanded(fresh);
  }, [notes, expanded]);

  function reset() {
    setDraft("");
    setTitle("");
    setEditing(null);
  }

  function submit() {
    if (!draft.trim()) return;
    const body = draft;
    const t = title;
    const id = editing ?? undefined;
    start(async () => {
      await saveNote({ id, scope, ref: refKey, title: t || null, body, path });
      const supabase = createClient();
      const { data } = await supabase
        .from("notes")
        .select("id,title,body,tags,updated_at")
        .eq("scope", scope)
        .eq("ref", refKey)
        .order("updated_at", { ascending: false });
      setNotes((data ?? []) as Note[]);
      reset();
    });
  }

  function remove(id: string) {
    start(async () => {
      await deleteNote(id, path);
      setNotes((n) => n.filter((x) => x.id !== id));
      if (editing === id) reset();
    });
  }

  const n = notes.length || count;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        title={`Notes for ${label}`}
        className={`shrink-0 text-[11px] px-2 py-1 rounded-md border transition-colors ${
          n > 0
            ? "border-[#c8613a] bg-[#fbeee8] text-[#c8613a] font-semibold"
            : "border-[#e4e4e0] text-[#6b6b66] hover:bg-[#f4f4f1]"
        }`}
      >
        {n > 0 ? `${n} note${n > 1 ? "s" : ""}` : "+ note"}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/25 flex justify-end"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-md bg-white h-full flex flex-col shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <header className="px-4 py-3 border-b border-[#e4e4e0] flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <div className="text-[10px] uppercase tracking-wider text-[#6b6b66]">
                  {scope}
                </div>
                <h3 className="text-[14px] font-semibold truncate">{label}</h3>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-[#6b6b66] hover:text-black text-lg leading-none px-1"
              >
                ✕
              </button>
            </header>

            <div className="p-4 border-b border-[#e4e4e0] space-y-2">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title (optional) — e.g. 'why my first attempt failed'"
                className="w-full border border-[#e4e4e0] rounded-lg px-3 py-2 text-[13px] outline-none focus:border-[#c8613a]"
              />
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                rows={6}
                placeholder={
                  scope === "problem"
                    ? "What was the trick? What did you miss? Write the pattern in your own words — that's what makes it stick."
                    : "Your notes…"
                }
                className="w-full border border-[#e4e4e0] rounded-lg px-3 py-2 text-[13px] font-mono outline-none focus:border-[#c8613a] resize-y"
              />
              <div className="flex gap-2">
                <button
                  onClick={submit}
                  disabled={pending || !draft.trim()}
                  className="bg-[#1a1a18] text-white rounded-lg px-4 py-2 text-[13px] font-medium hover:bg-black disabled:opacity-40"
                >
                  {editing ? "Update note" : "Save note"}
                </button>
                {editing && (
                  <button
                    onClick={reset}
                    className="border border-[#e4e4e0] rounded-lg px-3 py-2 text-[13px]"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto scroll-thin p-4 space-y-3">
              {loading && <p className="text-[12.5px] text-[#6b6b66]">Loading…</p>}
              {!loading && notes.length === 0 && (
                <p className="text-[12.5px] text-[#6b6b66]">
                  No notes yet. For DSA problems, the single most valuable note is{" "}
                  <i>why you got stuck</i> — not the solution.
                </p>
              )}
              {notes.map((note) => {
                const long = isLong(note.body);
                return (
                <article
                  key={note.id}
                  className="border border-[#e4e4e0] rounded-lg p-3 bg-[#fcfcfa]"
                >
                  <div className="flex items-start gap-2">
                    {note.title && (
                      <h4 className="text-[13px] font-semibold mb-1 flex-1 min-w-0">
                        {note.title}
                      </h4>
                    )}
                    <button
                      onClick={() => setExpanded(note)}
                      title="Expand note"
                      aria-label="Expand note"
                      className="ml-auto shrink-0 text-[11px] px-1.5 py-0.5 rounded border border-[#e4e4e0] text-[#6b6b66] hover:border-[#c8613a] hover:text-[#c8613a]"
                    >
                      ⤢
                    </button>
                  </div>
                  <pre
                    onDoubleClick={() => setExpanded(note)}
                    style={
                      long
                        ? {
                            maskImage:
                              "linear-gradient(to bottom, black 75%, transparent)",
                            WebkitMaskImage:
                              "linear-gradient(to bottom, black 75%, transparent)",
                          }
                        : undefined
                    }
                    className={`text-[12.5px] whitespace-pre-wrap font-mono leading-relaxed cursor-zoom-in ${
                      long ? "max-h-56 overflow-hidden" : ""
                    }`}
                  >
                    {note.body}
                  </pre>
                  <div className="flex gap-3 mt-2 text-[11px] text-[#6b6b66]">
                    <span>{new Date(note.updated_at).toLocaleDateString()}</span>
                    <button
                      className="hover:text-[#c8613a]"
                      onClick={() => setExpanded(note)}
                    >
                      Expand
                    </button>
                    <button
                      className="hover:text-[#c8613a]"
                      onClick={() => {
                        setEditing(note.id);
                        setTitle(note.title ?? "");
                        setDraft(note.body);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="hover:text-[#b0473f]"
                      onClick={() => remove(note.id)}
                    >
                      Delete
                    </button>
                  </div>
                </article>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {expanded && (
        <div
          className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center p-4 sm:p-8"
          onClick={() => setExpanded(null)}
        >
          <div
            className="w-full max-w-3xl max-h-full bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <header className="px-5 py-3 border-b border-[#e4e4e0] flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <div className="text-[10px] uppercase tracking-wider text-[#6b6b66]">
                  {scope} · {label}
                </div>
                <h3 className="text-[15px] font-semibold">
                  {expanded.title || "Untitled note"}
                </h3>
              </div>
              <span className="text-[11px] text-[#6b6b66] mt-1">
                {new Date(expanded.updated_at).toLocaleDateString()}
              </span>
              <button
                onClick={() => setExpanded(null)}
                title="Close (Esc)"
                className="text-[#6b6b66] hover:text-black text-lg leading-none px-1"
              >
                ✕
              </button>
            </header>

            <div className="flex-1 overflow-y-auto scroll-thin px-6 py-5">
              <pre className="text-[13.5px] whitespace-pre-wrap font-mono leading-[1.7]">
                {expanded.body}
              </pre>
            </div>

            <footer className="px-5 py-3 border-t border-[#e4e4e0] flex gap-2">
              <button
                onClick={() => {
                  setEditing(expanded.id);
                  setTitle(expanded.title ?? "");
                  setDraft(expanded.body);
                  setExpanded(null);
                }}
                className="border border-[#e4e4e0] rounded-lg px-3 py-1.5 text-[13px] hover:bg-[#f4f4f1]"
              >
                Edit
              </button>
              <button
                onClick={() => navigator.clipboard?.writeText(expanded.body)}
                className="border border-[#e4e4e0] rounded-lg px-3 py-1.5 text-[13px] hover:bg-[#f4f4f1]"
              >
                Copy
              </button>
              <button
                onClick={() => setExpanded(null)}
                className="ml-auto bg-[#1a1a18] text-white rounded-lg px-4 py-1.5 text-[13px] font-medium hover:bg-black"
              >
                Close
              </button>
            </footer>
          </div>
        </div>
      )}
    </>
  );
}
