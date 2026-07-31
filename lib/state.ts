import { createClient } from "@/lib/supabase/server";
import { PHASES, PILLARS, PROJECTS, FSD_PROBLEMS } from "@/lib/curriculum";
import { PROBLEMS } from "@/lib/problems";

export interface ProgressRow {
  kind: string;
  key: string;
  value: number;
  attempts: number;
}
export interface NoteRow {
  id: string;
  scope: string;
  ref: string | null;
  title: string | null;
  body: string;
  tags: string[];
  pinned: boolean;
  updated_at: string;
}
export interface SessionRow {
  day: string;
  hours: number;
  focus: string | null;
}
export interface AppRow {
  id: string;
  company: string;
  role: string | null;
  ctc_ask: string | null;
  stage: string;
  link: string | null;
  notes: string | null;
  created_at: string;
}

export interface AppState {
  progress: Map<string, ProgressRow>;
  notes: NoteRow[];
  noteCount: Map<string, number>;
  sessions: SessionRow[];
  applications: AppRow[];
  startDate: string;
}

const pkey = (kind: string, key: string) => `${kind}:${key}`;

export async function loadState(): Promise<AppState> {
  const supabase = await createClient();

  const [progress, notes, sessions, applications, settings] = await Promise.all([
    supabase.from("progress").select("kind,key,value,attempts"),
    supabase
      .from("notes")
      .select("id,scope,ref,title,body,tags,pinned,updated_at")
      .order("updated_at", { ascending: false }),
    supabase.from("sessions").select("day,hours,focus").order("day", { ascending: false }),
    supabase.from("applications").select("*").order("created_at", { ascending: false }),
    supabase.from("settings").select("start_date").maybeSingle(),
  ]);

  const pmap = new Map<string, ProgressRow>();
  (progress.data ?? []).forEach((r) => pmap.set(pkey(r.kind, r.key), r as ProgressRow));

  const noteCount = new Map<string, number>();
  (notes.data ?? []).forEach((n) => {
    if (!n.ref) return;
    const k = pkey(n.scope, n.ref);
    noteCount.set(k, (noteCount.get(k) ?? 0) + 1);
  });

  return {
    progress: pmap,
    notes: (notes.data ?? []) as NoteRow[],
    noteCount,
    sessions: (sessions.data ?? []) as SessionRow[],
    applications: (applications.data ?? []) as AppRow[],
    startDate: settings.data?.start_date ?? new Date().toISOString().slice(0, 10),
  };
}

/* ─────────────────────────── derived values ─────────────────────────── */

export const val = (s: AppState, kind: string, key: string) =>
  s.progress.get(pkey(kind, key))?.value ?? 0;

export const notesFor = (s: AppState, scope: string, ref: string) =>
  s.noteCount.get(pkey(scope, ref)) ?? 0;

/** A problem counts as done at status >= 2 (Solved). */
export const solvedCount = (s: AppState) =>
  PROBLEMS.filter((p) => val(s, "problem", p.slug) >= 2).length;

export const masteredCount = (s: AppState) =>
  PROBLEMS.filter((p) => val(s, "problem", p.slug) >= 3).length;

export function pillarScores(s: AppState): Record<string, number> {
  const tot: Record<string, number> = {};
  const got: Record<string, number> = {};
  PILLARS.forEach((p) => {
    tot[p.key] = 0;
    got[p.key] = 0;
  });

  PHASES.forEach((ph) =>
    ph.modules.forEach((m) =>
      m.items.forEach((_, idx) => {
        tot[m.pillar]++;
        if (val(s, "item", `${m.id}_${idx}`)) got[m.pillar]++;
      })
    )
  );

  // DSA: actual problems dominate the checklist
  const solved = solvedCount(s);
  const dsaProblems = Math.min(1, solved / PROBLEMS.length);
  const dsaChecklist = tot.dsa ? got.dsa / tot.dsa : 0;

  // System design: half checklist, half practice status
  const fsdPractice =
    FSD_PROBLEMS.reduce((a, _, idx) => a + val(s, "fsd", String(idx)) / 2, 0) /
    FSD_PROBLEMS.length;
  const fsdChecklist = tot.fsd ? got.fsd / tot.fsd : 0;

  // Projects
  let pt = 0;
  let pg = 0;
  PROJECTS.forEach((pr) =>
    pr.items.forEach((_, idx) => {
      pt++;
      if (val(s, "project", `${pr.id}_${idx}`)) pg++;
    })
  );

  const out: Record<string, number> = {};
  PILLARS.forEach((p) => {
    if (p.key === "dsa") out[p.key] = dsaProblems * 0.7 + dsaChecklist * 0.3;
    else if (p.key === "fsd") out[p.key] = fsdChecklist * 0.5 + fsdPractice * 0.5;
    else if (p.key === "proj") out[p.key] = pt ? pg / pt : 0;
    else out[p.key] = tot[p.key] ? got[p.key] / tot[p.key] : 0;
  });
  return out;
}

export function readiness(s: AppState): number {
  const sc = pillarScores(s);
  return PILLARS.reduce((a, p) => a + sc[p.key] * p.weight, 0);
}

export function weekNumber(startDate: string): number {
  const days = (Date.now() - new Date(startDate).getTime()) / 86_400_000;
  return Math.max(1, Math.min(24, Math.floor(days / 7) + 1));
}

export function streak(sessions: SessionRow[]): number {
  const set = new Set(sessions.filter((s) => s.hours > 0).map((s) => s.day));
  const d = new Date();
  let n = 0;
  const iso = () => d.toISOString().slice(0, 10);
  if (!set.has(iso())) d.setDate(d.getDate() - 1); // today not logged yet is fine
  while (set.has(iso()) && n < 400) {
    n++;
    d.setDate(d.getDate() - 1);
  }
  return n;
}

export function totalHours(sessions: SessionRow[]): number {
  return sessions.reduce((a, s) => a + Number(s.hours), 0);
}

export function gate(s: AppState) {
  const r = readiness(s);
  const solved = solvedCount(s);
  const shipped = PROJECTS.filter((pr) =>
    pr.items.every((_, idx) => val(s, "project", `${pr.id}_${idx}`))
  ).length;
  const canTeach = FSD_PROBLEMS.filter((_, idx) => val(s, "fsd", String(idx)) === 2).length;
  return { readiness: r, solved, shipped, canTeach, open: r >= 60 };
}
