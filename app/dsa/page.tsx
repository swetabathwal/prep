import Nav from "@/components/Nav";
import { Card, H2, Sub, Bar, Badge, Note } from "@/components/ui";
import { Seg } from "@/components/Controls";
import NoteDrawer from "@/components/NoteDrawer";
import {
  PROBLEMS,
  PROBLEMS_BY_TOPIC,
  PROBLEM_STATUS,
  problemUrl,
  solutionUrl,
} from "@/lib/problems";
import { RAMP, PATTERNS, RESOURCES } from "@/lib/curriculum";
import { loadState, val, notesFor, solvedCount, masteredCount, weekNumber } from "@/lib/state";

export const dynamic = "force-dynamic";
const PATH = "/dsa";

const STATUS_COLORS = ["#8b8b85", "#b8862b", "#3f7d5c", "#1a1a18"];
const DIFF_TONE = { Easy: "ok", Medium: "warn", Hard: "neutral" } as const;

export default async function DsaPage() {
  const s = await loadState();
  const solved = solvedCount(s);
  const mastered = masteredCount(s);
  const week = weekNumber(s.startDate);
  const weeksLeft = Math.max(1, 24 - week);
  const pace = Math.max(0, Math.ceil((PROBLEMS.length - solved) / weeksLeft));

  return (
    <div className="max-w-6xl mx-auto px-4 py-5 pb-20">
      <Nav />

      <Card className="mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <H2>DSA — NeetCode 150</H2>
          <Badge tone="warn">beginner track</Badge>
        </div>
        <div className="mt-1">
          <Sub>
            Every problem links straight to LeetCode. Four years of frontend work does
            not teach you this — starting from zero here is the norm, not a gap in you.
          </Sub>
        </div>

        <div className="mt-3">
          <Note>
            <b>Three rules that matter more than the number.</b>
            <ul className="list-disc pl-5 mt-1 space-y-1">
              <li>
                <b>Brute force first, always.</b> Say the dumb solution out loud, state
                its complexity, then optimise. Interviewers score this explicitly.
              </li>
              <li>
                <b>25-minute cap.</b> Stuck past it? Read the solution, understand it
                fully, mark it <i>Attempted</i>, then re-solve from blank three days
                later and mark it <i>Mastered</i>.
              </li>
              <li>
                <b>Write a note on every problem you get wrong.</b> Not the solution —
                why you got stuck. That note is worth more than the next ten problems.
              </li>
            </ul>
          </Note>
        </div>

        <div className="flex gap-7 flex-wrap mt-4">
          <div>
            <div className="text-2xl font-bold">{solved}</div>
            <Sub>solved</Sub>
          </div>
          <div>
            <div className="text-2xl font-bold text-[#1a1a18]">{mastered}</div>
            <Sub>mastered (re-solved)</Sub>
          </div>
          <div>
            <div className="text-2xl font-bold">
              {Math.round((solved / PROBLEMS.length) * 100)}%
            </div>
            <Sub>of {PROBLEMS.length}</Sub>
          </div>
          <div>
            <div className="text-2xl font-bold">{pace}/wk</div>
            <Sub>pace needed</Sub>
          </div>
        </div>
        <div className="mt-3">
          <Bar pct={(solved / PROBLEMS.length) * 100} color="#3f7d5c" />
        </div>
      </Card>

      <Card className="mb-3">
        <H2>Your ramp — don&apos;t do 10 a week in month one</H2>
        <div className="mt-1 mb-3">
          <Sub>
            Beginners who start at full volume quit in week three. This starts at 3
            problems a week and builds.
          </Sub>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="text-[11px] uppercase tracking-wider text-[#6b6b66] border-b border-[#e4e4e0]">
                <th className="text-left py-2 px-2 w-20">Weeks</th>
                <th className="text-left py-2 px-2 w-24">Pace</th>
                <th className="text-left py-2 px-2">Focus</th>
                <th className="text-left py-2 px-2">Note</th>
              </tr>
            </thead>
            <tbody>
              {RAMP.map((r) => {
                const [a, b] = r[0].split("–").map(Number);
                const now = week >= a && week <= b;
                return (
                  <tr
                    key={r[0]}
                    className="border-b border-[#f2f1ee]"
                    style={now ? { background: "#fbeee8" } : undefined}
                  >
                    <td className="py-2 px-2 font-semibold">
                      {r[0]} {now && <Badge tone="warn">now</Badge>}
                    </td>
                    <td className="py-2 px-2 font-semibold">{r[1]}</td>
                    <td className="py-2 px-2">{r[2]}</td>
                    <td className="py-2 px-2 text-[#6b6b66]">{r[3]}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="mb-3">
        <H2>The 15 patterns</H2>
        <div className="mt-1 mb-3">
          <Sub>
            Almost every interview problem is one of these wearing a costume. When
            you&apos;re stuck the right question is &quot;which pattern is this?&quot; —
            not &quot;have I seen this exact problem?&quot;
          </Sub>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {PATTERNS.map(([name, tell]) => (
            <div key={name} className="border border-[#e4e4e0] rounded-lg p-2.5">
              <div className="text-[12.5px] font-semibold">{name}</div>
              <div className="text-[11.5px] text-[#6b6b66] mt-0.5">{tell}</div>
            </div>
          ))}
        </div>
      </Card>

      {PROBLEMS_BY_TOPIC.map(({ topic, weeks, problems }) => {
        const done = problems.filter((p) => val(s, "problem", p.slug) >= 2).length;
        const pct = Math.round((done / problems.length) * 100);
        const onSchedule = weeks
          ? week >= Number(weeks.split("–")[0])
          : false;

        return (
          <Card key={topic} className="mb-3">
            <div className="flex items-center justify-between gap-3 flex-wrap mb-2">
              <div className="flex items-center gap-2 flex-wrap">
                <H2>{topic}</H2>
                <Badge tone={onSchedule ? "accent" : "neutral"}>weeks {weeks}</Badge>
              </div>
              <div className="text-[13px] tabular-nums text-[#6b6b66]">
                {done}/{problems.length} · {pct}%
              </div>
            </div>
            <div className="mb-3">
              <Bar pct={pct} color="#3f7d5c" />
            </div>

            <div className="space-y-1">
              {problems.map((p) => {
                const status = val(s, "problem", p.slug);
                return (
                  <div
                    key={p.slug}
                    className="flex items-center gap-2 flex-wrap py-1.5 border-b border-dashed border-[#f0efec] last:border-0"
                  >
                    <a
                      href={problemUrl(p)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-[13px] font-medium hover:text-[#c8613a] hover:underline flex-1 min-w-[200px] ${
                        status >= 2 ? "text-[#6b6b66]" : ""
                      }`}
                    >
                      {p.title}
                      {p.core && <span className="text-[#c8613a] ml-1">★</span>}
                      {p.premium && (
                        <span className="text-[10px] text-[#6b6b66] ml-1">
                          (premium — free on neetcode.io)
                        </span>
                      )}
                    </a>

                    <Badge tone={DIFF_TONE[p.difficulty]}>{p.difficulty}</Badge>
                    <span className="text-[11px] text-[#6b6b66] w-[150px] hidden lg:block">
                      {p.pattern}
                    </span>

                    <Seg
                      kind="problem"
                      itemKey={p.slug}
                      value={status}
                      options={PROBLEM_STATUS}
                      colors={STATUS_COLORS}
                      path={PATH}
                    />

                    <a
                      href={solutionUrl(p)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-[#6b6b66] border border-[#e4e4e0] rounded-md px-2 py-1 hover:bg-[#f4f4f1]"
                    >
                      video
                    </a>

                    <NoteDrawer
                      scope="problem"
                      refKey={p.slug}
                      label={p.title}
                      count={notesFor(s, "problem", p.slug)}
                      path={PATH}
                    />
                  </div>
                );
              })}
            </div>
          </Card>
        );
      })}

      <Card className="mb-3">
        <H2>Where to learn it from</H2>
        <div className="mt-2 space-y-2">
          {RESOURCES.map(([name, why, url]) => (
            <div key={name} className="border-b border-[#f2f1ee] pb-2 last:border-0">
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[13px] font-semibold text-[#c8613a] hover:underline"
              >
                {name} ↗
              </a>
              <div className="text-[12px] text-[#6b6b66]">{why}</div>
            </div>
          ))}
        </div>
        <div className="mt-3">
          <Note>
            <b>Pick one and finish it.</b> The most common beginner failure is
            collecting five resources and completing none. NeetCode&apos;s roadmap is
            the one to start with — its dependency graph stops you attempting graphs
            before recursion clicks.
          </Note>
        </div>
      </Card>

      <Card>
        <H2>How much does this actually matter for you?</H2>
        <div className="mt-2 text-[13px]">
          {[
            ["Remote / international startups", "Low — portfolio beats DSA"],
            ["Well-funded Indian startups (Tier B)", "Medium — mostly Easy/Medium"],
            ["Product companies & GCCs (Tier A)", "High — 1–2 Medium rounds"],
            ["FAANG / top-tier (Tier D)", "Very high — Medium/Hard"],
          ].map(([k, v]) => (
            <div
              key={k}
              className="flex justify-between py-1.5 border-b border-dashed border-[#f0efec] last:border-0"
            >
              <span>{k}</span>
              <b>{v}</b>
            </div>
          ))}
        </div>
        <div className="mt-3">
          <Note tone="warn">
            If your time is ever squeezed, protect <b>frontend system design</b> before
            DSA. Same weight here, far rarer among candidates. DSA gets you past the
            filter; system design gets you the level and the offer.
          </Note>
        </div>
      </Card>
    </div>
  );
}
