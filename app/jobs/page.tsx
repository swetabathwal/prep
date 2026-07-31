import Nav from "@/components/Nav";
import { Card, H2, Sub, Bar, Badge, Note } from "@/components/ui";
import { TIERS, NEGOTIATION, STAGES } from "@/lib/curriculum";
import { loadState, gate } from "@/lib/state";
import { addApplication } from "@/app/actions";
import AppRow from "./AppRow";

export const dynamic = "force-dynamic";

const BANDS: [string, string][] = [
  ["IT services, senior FE", "₹18–24L"],
  ["Mid product co / startup", "₹22–32L"],
  ["Large product co & GCC", "₹28–42L"],
  ["Top-tier / FAANG India", "₹40–60L"],
  ["Remote international", "₹35–70L eq."],
  ["Design-system / architecture owner", "₹45–65L"],
];

export default async function JobsPage() {
  const s = await loadState();
  const g = gate(s);
  const r = g.readiness;

  return (
    <div className="max-w-6xl mx-auto px-4 py-5 pb-20">
      <Nav />

      {!g.open ? (
        <Card>
          <div className="text-center py-8 px-4">
            <div className="text-4xl">🔒</div>
            <h2 className="text-lg font-semibold mt-2 mb-2">Job search locked</h2>
            <div className="max-w-lg mx-auto mb-5">
              <Sub>
                Applying before you&apos;re ready burns your best companies for 6–12
                months. This unlocks at 60% readiness. You&apos;re at{" "}
                <b>{r.toFixed(0)}%</b>.
              </Sub>
            </div>
            <div className="max-w-sm mx-auto">
              <Bar pct={(r / 60) * 100} />
              <div className="mt-4 text-left text-[13px]">
                <div className="text-[11px] uppercase tracking-wider text-[#6b6b66] mb-1">
                  Milestones on the way
                </div>
                {[
                  ["Readiness ≥ 60%", r >= 60, `${r.toFixed(0)}%`],
                  ["75+ DSA problems", g.solved >= 75, `${g.solved}`],
                  ["1 project shipped", g.shipped >= 1, `${g.shipped}`],
                  ["6 design problems at 'can teach'", g.canTeach >= 6, `${g.canTeach}`],
                ].map(([label, ok, v]) => (
                  <div
                    key={String(label)}
                    className="flex justify-between py-1.5 border-b border-dashed border-[#f0efec]"
                  >
                    <span>
                      {ok ? "✓" : "○"} {label}
                    </span>
                    <b>{v}</b>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      ) : (
        <>
          <Card className="mb-3">
            <Note tone={r >= 72 ? "ok" : "warn"}>
              {r >= 85 ? (
                <>
                  <b>Go everywhere, including top-tier.</b> You&apos;re at{" "}
                  {r.toFixed(0)}%. Interview Tier A and B first for practice, then hit
                  Tier D with offers already in hand.
                </>
              ) : r >= 72 ? (
                <>
                  <b>Apply broadly to Tier A, B and C.</b> You&apos;re at {r.toFixed(0)}%.
                  Hold off on FAANG a few more weeks — the rejection cooldown is too long
                  to waste.
                </>
              ) : (
                <>
                  <b>Start warm — Tier B and C only.</b> You&apos;re at {r.toFixed(0)}%.
                  Use these as live practice. Save Tier A and D for 75%+.
                </>
              )}
            </Note>
          </Card>

          <Card className="mb-3">
            <H2>Application tracker</H2>
            <div className="mt-1 mb-3">
              <Sub>
                Target 8–12 quality applications a week, 60%+ through referrals.
                Spray-and-pray gets you nowhere at this band.
              </Sub>
            </div>

            <form action={addApplication} className="flex gap-2 flex-wrap mb-4">
              <input
                name="company"
                required
                placeholder="Company"
                className="flex-[2] min-w-[140px] border border-[#e4e4e0] rounded-lg px-3 py-2 text-[13px] outline-none focus:border-[#c8613a]"
              />
              <input
                name="role"
                placeholder="Role"
                className="flex-[2] min-w-[140px] border border-[#e4e4e0] rounded-lg px-3 py-2 text-[13px] outline-none focus:border-[#c8613a]"
              />
              <input
                name="ctc_ask"
                placeholder="CTC ask"
                className="flex-1 min-w-[90px] border border-[#e4e4e0] rounded-lg px-3 py-2 text-[13px] outline-none focus:border-[#c8613a]"
              />
              <select
                name="stage"
                className="flex-1 min-w-[130px] border border-[#e4e4e0] rounded-lg px-3 py-2 text-[13px] bg-white"
              >
                {STAGES.map((st) => (
                  <option key={st}>{st}</option>
                ))}
              </select>
              <button className="bg-[#1a1a18] text-white rounded-lg px-4 py-2 text-[13px] font-medium hover:bg-black">
                Add
              </button>
            </form>

            {s.applications.length === 0 ? (
              <Sub>Nothing tracked yet.</Sub>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-[13px]">
                  <thead>
                    <tr className="text-[11px] uppercase tracking-wider text-[#6b6b66] border-b border-[#e4e4e0]">
                      <th className="text-left py-2 px-2">Company</th>
                      <th className="text-left py-2 px-2">Role</th>
                      <th className="text-left py-2 px-2">Ask</th>
                      <th className="text-left py-2 px-2">Stage</th>
                      <th className="text-left py-2 px-2">Added</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {s.applications.map((a) => (
                      <AppRow key={a.id} app={a} />
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>

          <Card className="mb-3">
            <H2>Where to apply, in order</H2>
            <div className="mt-2">
              {TIERS.map((t) => {
                const ready = r >= t.minReadiness;
                return (
                  <div key={t.title} className="py-3 border-b border-[#e4e4e0] last:border-0">
                    <div className="flex justify-between items-start gap-3 flex-wrap">
                      <h3 className="text-[13.5px] font-semibold">{t.title}</h3>
                      <div className="flex gap-2">
                        <Badge tone="ok">{t.band}</Badge>
                        <Badge tone={ready ? "accent" : "neutral"}>
                          {ready ? "ready now" : `needs ${t.minReadiness}%`}
                        </Badge>
                      </div>
                    </div>
                    <div className="my-1.5">
                      <Sub>{t.list}</Sub>
                    </div>
                    <Note>{t.note}</Note>
                  </div>
                );
              })}
            </div>
          </Card>
        </>
      )}

      <div className="grid md:grid-cols-2 gap-3 mt-3">
        <Card>
          <H2>Salary bands — India, 2026</H2>
          <div className="mt-2 text-[13px]">
            {BANDS.map(([k, v]) => (
              <div
                key={k}
                className="flex justify-between py-1.5 border-b border-dashed border-[#f0efec] last:border-0"
              >
                <span>{k}</span>
                <b className="tabular-nums">{v}</b>
              </div>
            ))}
          </div>
          <div className="mt-3">
            <Sub>
              IT services pay roughly 25–35% below these at every band. Bengaluru runs
              10–20% above other cities for the same role.
            </Sub>
          </div>
        </Card>

        <Card>
          <H2>Negotiation — read before any call</H2>
          <div className="mt-2 space-y-2.5">
            {NEGOTIATION.map(([rule, why]) => (
              <div key={rule}>
                <div className="text-[13px] font-semibold">{rule}</div>
                <div className="text-[12px] text-[#6b6b66]">{why}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
