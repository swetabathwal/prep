import Nav from "@/components/Nav";
import { Card, H2, Sub, Bar, Badge, Note, Stat } from "@/components/ui";
import { PILLARS, PHASES } from "@/lib/curriculum";
import {
  loadState,
  pillarScores,
  readiness,
  weekNumber,
  streak,
  totalHours,
  solvedCount,
  masteredCount,
  gate,
} from "@/lib/state";
import { PROBLEMS } from "@/lib/problems";
import LogSession from "./LogSession";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const s = await loadState();
  const scores = pillarScores(s);
  const r = readiness(s);
  const week = weekNumber(s.startDate);
  const g = gate(s);
  const hours = totalHours(s.sessions);
  const activeDays = s.sessions.filter((x) => x.hours > 0).length;
  const today = new Date().toISOString().slice(0, 10);
  const loggedToday = s.sessions.find((x) => x.day === today)?.hours ?? 0;

  const phase =
    week <= 6
      ? PHASES[0]
      : week <= 12
      ? PHASES[1]
      : week <= 18
      ? PHASES[2]
      : PHASES[3];

  const label =
    r < 20
      ? "Foundation phase"
      : r < 40
      ? "Building"
      : r < 60
      ? "Getting there"
      : r < 75
      ? "Interview-capable"
      : r < 88
      ? "Strong candidate"
      : "Top-tier ready";

  return (
    <div className="max-w-6xl mx-auto px-4 py-5 pb-20">
      <header className="bg-gradient-to-br from-[#1f1f1d] to-[#33322e] text-[#f4f2ee] rounded-2xl p-5 mb-4">
        <h1 className="text-xl font-semibold tracking-tight">Prep OS</h1>
        <p className="text-[12.5px] text-[#b5b2ab] mt-1">
          Senior frontend switch · 24 weeks · Angular depth + React + system design +
          DSA from zero
        </p>
        <div className="flex gap-7 flex-wrap mt-4">
          <div>
            <div className="text-xl font-bold leading-tight">{r.toFixed(0)}%</div>
            <div className="text-[11px] uppercase tracking-wider text-[#a9a69f]">
              Readiness
            </div>
          </div>
          <div>
            <div className="text-xl font-bold leading-tight">Week {week}</div>
            <div className="text-[11px] uppercase tracking-wider text-[#a9a69f]">
              of 24
            </div>
          </div>
          <div>
            <div className="text-xl font-bold leading-tight">
              {solvedCount(s)}
              <span className="text-[13px] font-normal text-[#a9a69f]">
                /{PROBLEMS.length}
              </span>
            </div>
            <div className="text-[11px] uppercase tracking-wider text-[#a9a69f]">
              DSA solved
            </div>
          </div>
          <div>
            <div className="text-xl font-bold leading-tight">{masteredCount(s)}</div>
            <div className="text-[11px] uppercase tracking-wider text-[#a9a69f]">
              Mastered
            </div>
          </div>
          <div>
            <div className="text-xl font-bold leading-tight">{hours.toFixed(0)}h</div>
            <div className="text-[11px] uppercase tracking-wider text-[#a9a69f]">
              Logged
            </div>
          </div>
          <div>
            <div className="text-xl font-bold leading-tight">
              {streak(s.sessions)}
            </div>
            <div className="text-[11px] uppercase tracking-wider text-[#a9a69f]">
              Day streak
            </div>
          </div>
        </div>
      </header>

      <Nav />

      <div className="grid md:grid-cols-2 gap-3 mb-3">
        <Card>
          <H2>Readiness</H2>
          <div className="flex items-baseline gap-3 mt-2 mb-4">
            <div className="text-4xl font-bold tracking-tight">{r.toFixed(0)}%</div>
            <Sub>{label}</Sub>
          </div>
          <div className="space-y-2.5">
            {PILLARS.map((p) => {
              const pct = Math.round(scores[p.key] * 100);
              return (
                <div key={p.key} className="flex items-center gap-2.5">
                  <span className="text-[12px] font-medium w-[118px] shrink-0">
                    {p.name}
                  </span>
                  <div className="flex-1">
                    <Bar pct={pct} color={p.color} />
                  </div>
                  <span className="text-[11.5px] text-[#6b6b66] w-[62px] text-right tabular-nums">
                    {pct}% · w{p.weight}
                  </span>
                </div>
              );
            })}
          </div>
        </Card>

        <div className="space-y-3">
          <Card>
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-[11px] uppercase tracking-wider text-[#6b6b66]">
                  {phase.weeks}
                </div>
                <H2>{phase.title}</H2>
              </div>
              <Badge tone="accent">Current phase</Badge>
            </div>
            <div className="mt-2">
              <Sub>{phase.goal}</Sub>
            </div>
          </Card>

          <Card>
            <H2>Today</H2>
            <div className="mt-2 mb-3">
              <Sub>
                {loggedToday > 0
                  ? `${loggedToday}h logged today. Good.`
                  : "Nothing logged yet today."}
              </Sub>
            </div>
            <LogSession />
            <div className="flex gap-6 mt-4">
              <Stat value={streak(s.sessions)} label="day streak" />
              <Stat value={hours.toFixed(1)} label="total hours" />
              <Stat
                value={activeDays ? (hours / activeDays).toFixed(1) : "0"}
                label="avg / active day"
              />
            </div>
          </Card>
        </div>
      </div>

      <Card className="mb-3">
        {g.open ? (
          <Note tone="ok">
            <b>Job search is unlocked.</b> The Jobs page now shows which tiers to target
            at your current level.
          </Note>
        ) : (
          <>
            <div className="flex items-start justify-between gap-3">
              <div>
                <H2>
                  Job search <Badge>locked</Badge>
                </H2>
                <div className="mt-1">
                  <Sub>
                    Unlocks at 60% readiness — {(60 - r).toFixed(0)} points to go.
                    Applying before you&apos;re ready burns your best companies for
                    6–12 months.
                  </Sub>
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-2xl font-bold">
                  {r.toFixed(0)}
                  <span className="text-[13px] text-[#6b6b66]">/60</span>
                </div>
              </div>
            </div>
            <div className="mt-3">
              <Bar pct={(r / 60) * 100} />
            </div>
            <div className="grid sm:grid-cols-3 gap-2 mt-4 text-[12.5px]">
              <div className="flex justify-between border-b border-dashed border-[#f0efec] py-1">
                <span>{g.solved >= 75 ? "✓" : "○"} 75+ problems</span>
                <b>{g.solved}</b>
              </div>
              <div className="flex justify-between border-b border-dashed border-[#f0efec] py-1">
                <span>{g.shipped >= 1 ? "✓" : "○"} 1 project shipped</span>
                <b>{g.shipped}</b>
              </div>
              <div className="flex justify-between border-b border-dashed border-[#f0efec] py-1">
                <span>{g.canTeach >= 6 ? "✓" : "○"} 6 design problems</span>
                <b>{g.canTeach}</b>
              </div>
            </div>
          </>
        )}
      </Card>

      <div className="grid md:grid-cols-2 gap-3">
        <Card>
          <H2>The one rule that matters</H2>
          <div className="mt-2 mb-3">
            <Note tone="warn">
              <b>No AI during practice hours.</b> Copilot and Claude off, autocomplete
              off, docs allowed. You lost the fundamentals because the tool did the
              recall for you — the only way back is unaided reps. Use AI freely{" "}
              <i>after</i> you&apos;ve written the answer, to review it.
            </Note>
          </div>
          <h3 className="text-[13px] font-semibold mb-1">How each session should look</h3>
          <ul className="list-disc pl-5 text-[13px] space-y-1">
            <li>
              <b>25 min</b> — write-from-scratch drill, no editor help
            </li>
            <li>
              <b>50 min</b> — DSA at your current ramp pace (weeks 1–2 that&apos;s one
              Easy problem, untimed)
            </li>
            <li>
              <b>45 min</b> — current phase topic: read, then build a tiny demo
            </li>
            <li>
              <b>20 min</b> — explain today&apos;s topic out loud as if interviewing
            </li>
          </ul>
        </Card>

        <Card>
          <H2>Where you are vs. where the money is</H2>
          <div className="grid grid-cols-3 gap-3 mt-3">
            <div>
              <Sub>Current</Sub>
              <div className="text-2xl font-bold tracking-tight">₹12L</div>
              <Sub>Below band</Sub>
            </div>
            <div>
              <Sub>After this plan</Sub>
              <div className="text-2xl font-bold tracking-tight text-[#3f7d5c]">
                ₹28–42L
              </div>
              <Sub>Product cos &amp; GCCs</Sub>
            </div>
            <div>
              <Sub>Stretch</Sub>
              <div className="text-2xl font-bold tracking-tight text-[#c8613a]">
                ₹45L+
              </div>
              <Sub>Top-tier / remote</Sub>
            </div>
          </div>
          <div className="mt-4">
            <Note>
              Even today, before any prep, ₹12L is roughly 30–40% under band for four
              years at a product company. Part of the gap is skill; part is simply that
              you have never asked. This plan fixes both.
            </Note>
          </div>
        </Card>
      </div>
    </div>
  );
}
