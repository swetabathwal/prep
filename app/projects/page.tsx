import Nav from "@/components/Nav";
import { Card, H2, Sub, Bar, Badge } from "@/components/ui";
import { Check } from "@/components/Controls";
import NoteDrawer from "@/components/NoteDrawer";
import { PROJECTS, pillar } from "@/lib/curriculum";
import { loadState, val, notesFor } from "@/lib/state";

export const dynamic = "force-dynamic";
const PATH = "/projects";

export default async function ProjectsPage() {
  const s = await loadState();

  return (
    <div className="max-w-6xl mx-auto px-4 py-5 pb-20">
      <Nav />

      <Card className="mb-3">
        <H2>Three portfolio projects</H2>
        <div className="mt-1">
          <Sub>
            Your proof of scope — the thing that separates &quot;four years of
            tickets&quot; from &quot;senior&quot;. Each must be public, deployed and
            documented.
          </Sub>
        </div>
      </Card>

      {PROJECTS.map((pr) => {
        const done = pr.items.filter((_, i) => val(s, "project", `${pr.id}_${i}`)).length;
        const pct = Math.round((done / pr.items.length) * 100);
        const p = pillar(pr.pillar);

        return (
          <Card key={pr.id} className="mb-3">
            <div className="flex justify-between items-start gap-3 flex-wrap">
              <div className="flex-1 min-w-[220px]">
                <div className="text-[11px] uppercase tracking-wider text-[#6b6b66]">
                  {pr.weeks}
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <H2>{pr.title}</H2>
                  <Badge style={{ background: p.color, color: "white" }}>{p.name}</Badge>
                </div>
                <div className="mt-1">
                  <Sub>{pr.why}</Sub>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{pct}%</div>
                <Sub>
                  {done}/{pr.items.length}
                </Sub>
              </div>
            </div>

            <div className="my-3">
              <Bar pct={pct} color={p.color} />
            </div>

            {pr.items.map((it, i) => {
              const key = `${pr.id}_${i}`;
              return (
                <div key={key} className="flex items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <Check
                      kind="project"
                      itemKey={key}
                      checked={!!val(s, "project", key)}
                      label={it}
                      path={PATH}
                    />
                  </div>
                  <div className="pt-2">
                    <NoteDrawer
                      scope="project"
                      refKey={key}
                      label={it}
                      count={notesFor(s, "project", key)}
                      path={PATH}
                    />
                  </div>
                </div>
              );
            })}
          </Card>
        );
      })}
    </div>
  );
}
