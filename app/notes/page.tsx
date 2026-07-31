import Nav from "@/components/Nav";
import { Card, H2, Sub } from "@/components/ui";
import { loadState } from "@/lib/state";
import { PROBLEMS } from "@/lib/problems";
import { PHASES, FSD_PROBLEMS, PROJECTS } from "@/lib/curriculum";
import NotesClient from "./NotesClient";

export const dynamic = "force-dynamic";

/** Build a human label for every possible note ref, so the notes page reads well. */
function buildLabels() {
  const map: Record<string, string> = {};
  PROBLEMS.forEach((p) => (map[`problem:${p.slug}`] = p.title));
  PHASES.forEach((ph) =>
    ph.modules.forEach((m) =>
      m.items.forEach((it, i) => (map[`item:${m.id}_${i}`] = it.label))
    )
  );
  FSD_PROBLEMS.forEach((p, i) => (map[`fsd:${i}`] = p.title));
  PROJECTS.forEach((pr) =>
    pr.items.forEach((it, i) => (map[`project:${pr.id}_${i}`] = `${pr.title} — ${it}`))
  );
  return map;
}

export default async function NotesPage() {
  const s = await loadState();
  const labels = buildLabels();

  return (
    <div className="max-w-6xl mx-auto px-4 py-5 pb-20">
      <Nav />

      <Card className="mb-3">
        <H2>Notes</H2>
        <div className="mt-1">
          <Sub>
            Everything you&apos;ve written, in one place. Search it before every
            interview — this is your revision sheet, and it&apos;s better than any book
            because you wrote it. {s.notes.length} note
            {s.notes.length === 1 ? "" : "s"} so far.
          </Sub>
        </div>
      </Card>

      <NotesClient notes={s.notes} labels={labels} />
    </div>
  );
}
