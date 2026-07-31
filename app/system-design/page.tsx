import Nav from "@/components/Nav";
import { Card, H2, Sub, Bar, Note } from "@/components/ui";
import { Seg } from "@/components/Controls";
import NoteDrawer from "@/components/NoteDrawer";
import { FSD_PROBLEMS, FSD_STATUS, RADIO } from "@/lib/curriculum";
import { loadState, val, notesFor } from "@/lib/state";

export const dynamic = "force-dynamic";
const PATH = "/system-design";
const COLORS = ["#8b8b85", "#b8862b", "#3f7d5c"];

export default async function SystemDesignPage() {
  const s = await loadState();
  const scores = FSD_PROBLEMS.map((_, i) => val(s, "fsd", String(i)));
  const canTeach = scores.filter((v) => v === 2).length;
  const pct = Math.round((scores.reduce((a, b) => a + b / 2, 0) / FSD_PROBLEMS.length) * 100);

  return (
    <div className="max-w-6xl mx-auto px-4 py-5 pb-20">
      <Nav />

      <Card className="mb-3">
        <H2>Frontend system design</H2>
        <div className="mt-1">
          <Sub>
            This is the round that cuts the most people at senior level, and it&apos;s
            newer than your career. It did not exist when you started. It is the single
            highest-leverage thing on this whole board.
          </Sub>
        </div>
        <div className="flex gap-7 mt-4">
          <div>
            <div className="text-2xl font-bold">{canTeach}</div>
            <Sub>can teach</Sub>
          </div>
          <div>
            <div className="text-2xl font-bold">{pct}%</div>
            <Sub>overall</Sub>
          </div>
        </div>
        <div className="mt-3">
          <Bar pct={pct} color="#6d5296" />
        </div>
        <div className="mt-3">
          <Note>
            Practise each one <b>out loud with a whiteboard for 45 minutes</b>, then
            compare against a written solution. Mark &quot;Can teach it&quot; only when
            you can run the full 45 minutes unaided. Keep your structure notes on each
            problem — they become your revision sheet the week before interviews.
          </Note>
        </div>
      </Card>

      <Card className="mb-3">
        <H2>RADIO — the template you run on any prompt</H2>
        <div className="mt-2 space-y-1.5">
          {RADIO.map(([step, detail]) => (
            <div
              key={step}
              className="flex gap-3 py-1.5 border-b border-dashed border-[#f0efec] last:border-0"
            >
              <span className="text-[13px] font-semibold w-[170px] shrink-0">
                {step}
              </span>
              <span className="text-[12.5px] text-[#6b6b66]">{detail}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <H2>The 12 problems</H2>
        <div className="mt-3 space-y-1">
          {FSD_PROBLEMS.map((p, i) => (
            <div
              key={p.title}
              className="flex items-center gap-3 flex-wrap py-2 border-b border-dashed border-[#f0efec] last:border-0"
            >
              <div className="flex-1 min-w-[220px]">
                <div className="text-[13px] font-semibold">{p.title}</div>
                <div className="text-[11.5px] text-[#6b6b66]">{p.tests}</div>
              </div>
              <Seg
                kind="fsd"
                itemKey={String(i)}
                value={scores[i]}
                options={FSD_STATUS}
                colors={COLORS}
                path={PATH}
              />
              <NoteDrawer
                scope="fsd"
                refKey={String(i)}
                label={p.title}
                count={notesFor(s, "fsd", String(i))}
                path={PATH}
              />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
