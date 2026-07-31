import Nav from "@/components/Nav";
import { Card, H2, Sub, Bar, Badge } from "@/components/ui";
import { Check } from "@/components/Controls";
import NoteDrawer from "@/components/NoteDrawer";
import { PHASES, pillar } from "@/lib/curriculum";
import { loadState, val, notesFor } from "@/lib/state";

export const dynamic = "force-dynamic";
const PATH = "/roadmap";

export default async function RoadmapPage() {
  const s = await loadState();

  return (
    <div className="max-w-6xl mx-auto px-4 py-5 pb-20">
      <Nav />

      <Card className="mb-3">
        <H2>24-week roadmap</H2>
        <div className="mt-1">
          <Sub>
            ~2.5 hrs weekdays + 6 hrs weekends ≈ 18 hrs/week. Tick items as you
            genuinely master them, not as you read them. Every item takes notes — click
            &quot;+ note&quot; on anything you want to come back to.
          </Sub>
        </div>
      </Card>

      {PHASES.map((ph) => {
        let total = 0;
        let done = 0;
        ph.modules.forEach((m) =>
          m.items.forEach((_, idx) => {
            total++;
            if (val(s, "item", `${m.id}_${idx}`)) done++;
          })
        );
        const pct = total ? Math.round((done / total) * 100) : 0;

        return (
          <Card key={ph.id} className="mb-3">
            <div className="flex justify-between items-start gap-3 flex-wrap">
              <div className="flex-1 min-w-[220px]">
                <div className="text-[11px] uppercase tracking-wider text-[#6b6b66]">
                  {ph.weeks}
                </div>
                <h2
                  className="text-base font-semibold tracking-tight"
                  style={{ color: ph.color }}
                >
                  {ph.title}
                </h2>
                <div className="mt-1">
                  <Sub>{ph.goal}</Sub>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{pct}%</div>
                <Sub>
                  {done}/{total}
                </Sub>
              </div>
            </div>

            <div className="my-3">
              <Bar pct={pct} color={ph.color} />
            </div>

            <div className="space-y-2.5">
              {ph.modules.map((m) => {
                const mdone = m.items.filter((_, idx) =>
                  val(s, "item", `${m.id}_${idx}`)
                ).length;
                const p = pillar(m.pillar);

                return (
                  <details
                    key={m.id}
                    className="border border-[#e4e4e0] rounded-lg overflow-hidden group"
                    open={mdone > 0 && mdone < m.items.length}
                  >
                    <summary className="flex items-center gap-2.5 px-3 py-2.5 bg-[#fcfcfa] hover:bg-[#f4f4f1] cursor-pointer list-none">
                      <span className="text-[#6b6b66] text-[10px] group-open:rotate-90 transition-transform">
                        ▶
                      </span>
                      <h3 className="text-[13.5px] font-semibold flex-1">{m.title}</h3>
                      <Badge style={{ background: p.color, color: "white" }}>
                        {p.name}
                      </Badge>
                      <span className="text-[11.5px] text-[#6b6b66] tabular-nums w-11 text-right">
                        {mdone}/{m.items.length}
                      </span>
                    </summary>
                    <div className="px-3 pb-2">
                      {m.items.map((it, idx) => {
                        const key = `${m.id}_${idx}`;
                        return (
                          <div key={key} className="flex items-start gap-2">
                            <div className="flex-1 min-w-0">
                              <Check
                                kind="item"
                                itemKey={key}
                                checked={!!val(s, "item", key)}
                                label={it.label}
                                hint={it.hint}
                                path={PATH}
                              />
                            </div>
                            <div className="pt-2">
                              <NoteDrawer
                                scope="item"
                                refKey={key}
                                label={it.label}
                                count={notesFor(s, "item", key)}
                                path={PATH}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </details>
                );
              })}
            </div>
          </Card>
        );
      })}
    </div>
  );
}
