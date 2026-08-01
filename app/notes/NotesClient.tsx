"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { Card, H2, Sub, Badge } from "@/components/ui";
import { saveNote, deleteNote, togglePin } from "@/app/actions";
import type { NoteRow } from "@/lib/state";
import { isLong } from "@/components/NoteDrawer";

const SCOPES = ["all", "journal", "problem", "item", "fsd", "project"] as const;
const SCOPE_LABEL: Record<string, string> = {
  journal: "Journal",
  problem: "DSA",
  item: "Roadmap",
  fsd: "System design",
  project: "Project",
};

export default function NotesClient({
  notes,
  labels,
}: {
  notes: NoteRow[];
  labels: Record<string, string>;
}) {
  const [q, setQ] = useState("");
  const [scope, setScope] = useState<string>("all");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const expanded = useMemo(
    () => notes.find((n) => n.id === expandedId) ?? null,
    [notes, expandedId]
  );

  useEffect(() => {
    if (!expanded) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setExpandedId(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [expanded]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return notes
      .filter((n) => scope === "all" || n.scope === scope)
      .filter(
        (n) =>
          !needle ||
          n.body.toLowerCase().includes(needle) ||
          (n.title ?? "").toLowerCase().includes(needle) ||
          (labels[`${n.scope}:${n.ref}`] ?? "").toLowerCase().includes(needle)
      )
      .sort((a, b) => Number(b.pinned) - Number(a.pinned));
  }, [notes, q, scope, labels]);

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    notes.forEach((n) => (c[n.scope] = (c[n.scope] ?? 0) + 1));
    return c;
  }, [notes]);

  return (
    <>
      <Card className="mb-3">
        <H2>New journal entry</H2>
        <div className="mt-1 mb-3">
          <Sub>
            Use this for the weekly review: what clicked, what didn&apos;t, what to redo.
            Notes attached to a specific problem or topic are added from that page.
          </Sub>
        </div>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title — e.g. 'Week 3 review'"
          className="w-full border border-[#e4e4e0] rounded-lg px-3 py-2 text-[13px] mb-2 outline-none focus:border-[#c8613a]"
        />
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={5}
          placeholder="What did I get wrong this week, and what am I doing about it?"
          className="w-full border border-[#e4e4e0] rounded-lg px-3 py-2 text-[13px] font-mono outline-none focus:border-[#c8613a] resize-y"
        />
        <button
          disabled={pending || !body.trim()}
          onClick={() =>
            start(async () => {
              await saveNote({ scope: "journal", title: title || null, body });
              setTitle("");
              setBody("");
            })
          }
          className="mt-2 bg-[#1a1a18] text-white rounded-lg px-4 py-2 text-[13px] font-medium hover:bg-black disabled:opacity-40"
        >
          Save entry
        </button>
      </Card>

      <Card className="mb-3">
        <div className="flex gap-2 flex-wrap items-center">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search all notes…"
            className="flex-1 min-w-[200px] border border-[#e4e4e0] rounded-lg px-3 py-2 text-[13px] outline-none focus:border-[#c8613a]"
          />
          <div className="inline-flex border border-[#e4e4e0] rounded-lg overflow-hidden">
            {SCOPES.map((sc) => (
              <button
                key={sc}
                onClick={() => setScope(sc)}
                className={`px-2.5 py-1.5 text-[12px] border-r border-[#e4e4e0] last:border-0 ${
                  scope === sc ? "bg-[#1a1a18] text-white" : "bg-white hover:bg-[#f4f4f1]"
                }`}
              >
                {sc === "all" ? "All" : SCOPE_LABEL[sc]}
                {sc !== "all" && counts[sc] ? (
                  <span className="ml-1 opacity-60">{counts[sc]}</span>
                ) : null}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {filtered.length === 0 && (
        <Card>
          <Sub>
            {notes.length === 0
              ? "No notes yet. The habit that matters most: after every DSA problem you get wrong, write one line on why you got stuck."
              : "Nothing matches that search."}
          </Sub>
        </Card>
      )}

      <div className="space-y-2">
        {filtered.map((n) => {
          const attached = n.ref ? labels[`${n.scope}:${n.ref}`] : null;
          return (
            <Card key={n.id}>
              <div className="flex items-start justify-between gap-3 mb-1.5">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge tone={n.scope === "journal" ? "neutral" : "accent"}>
                      {SCOPE_LABEL[n.scope] ?? n.scope}
                    </Badge>
                    {attached && (
                      <span className="text-[12px] font-semibold">{attached}</span>
                    )}
                    {n.pinned && <Badge tone="warn">pinned</Badge>}
                  </div>
                  {n.title && (
                    <h3 className="text-[13.5px] font-semibold mt-1">{n.title}</h3>
                  )}
                </div>
                <div className="flex gap-2.5 text-[11px] text-[#6b6b66] shrink-0">
                  <span>{new Date(n.updated_at).toLocaleDateString()}</span>
                  <button
                    className="hover:text-[#c8613a]"
                    title="Expand note"
                    onClick={() => setExpandedId(n.id)}
                  >
                    Expand
                  </button>
                  <button
                    className="hover:text-[#b8862b]"
                    onClick={() => start(() => togglePin(n.id, !n.pinned))}
                  >
                    {n.pinned ? "Unpin" : "Pin"}
                  </button>
                  <button
                    className="hover:text-[#b0473f]"
                    onClick={() => start(() => deleteNote(n.id))}
                  >
                    Delete
                  </button>
                </div>
              </div>
              <pre
                onDoubleClick={() => setExpandedId(n.id)}
                style={
                  isLong(n.body)
                    ? {
                        maskImage:
                          "linear-gradient(to bottom, black 78%, transparent)",
                        WebkitMaskImage:
                          "linear-gradient(to bottom, black 78%, transparent)",
                      }
                    : undefined
                }
                className={`text-[12.5px] whitespace-pre-wrap font-mono leading-relaxed cursor-zoom-in ${
                  isLong(n.body) ? "max-h-64 overflow-hidden" : ""
                }`}
              >
                {n.body}
              </pre>
            </Card>
          );
        })}
      </div>

      {expanded && (
        <div
          className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center p-4 sm:p-8"
          onClick={() => setExpandedId(null)}
        >
          <div
            className="w-full max-w-3xl max-h-full bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <header className="px-5 py-3 border-b border-[#e4e4e0] flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <div className="text-[10px] uppercase tracking-wider text-[#6b6b66]">
                  {SCOPE_LABEL[expanded.scope] ?? expanded.scope}
                  {expanded.ref && labels[`${expanded.scope}:${expanded.ref}`]
                    ? ` · ${labels[`${expanded.scope}:${expanded.ref}`]}`
                    : ""}
                </div>
                <h3 className="text-[15px] font-semibold">
                  {expanded.title || "Untitled note"}
                </h3>
              </div>
              <span className="text-[11px] text-[#6b6b66] mt-1">
                {new Date(expanded.updated_at).toLocaleDateString()}
              </span>
              <button
                onClick={() => setExpandedId(null)}
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
                onClick={() => navigator.clipboard?.writeText(expanded.body)}
                className="border border-[#e4e4e0] rounded-lg px-3 py-1.5 text-[13px] hover:bg-[#f4f4f1]"
              >
                Copy
              </button>
              <button
                onClick={() => setExpandedId(null)}
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
