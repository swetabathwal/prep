"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

async function userId() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in");
  return { supabase, uid: user.id };
}

/** Set any checkbox / rating. value 0 deletes the row to keep the table small. */
export async function setProgress(kind: string, key: string, value: number, path = "/") {
  const { supabase, uid } = await userId();

  if (value === 0) {
    await supabase.from("progress").delete().match({ user_id: uid, kind, key });
  } else {
    await supabase
      .from("progress")
      .upsert({ user_id: uid, kind, key, value }, { onConflict: "user_id,kind,key" });
  }
  revalidatePath(path);
}

export async function bumpAttempts(slug: string) {
  const { supabase, uid } = await userId();
  const { data } = await supabase
    .from("progress")
    .select("attempts,value")
    .match({ user_id: uid, kind: "problem", key: slug })
    .maybeSingle();

  await supabase.from("progress").upsert(
    {
      user_id: uid,
      kind: "problem",
      key: slug,
      value: data?.value ?? 1,
      attempts: (data?.attempts ?? 0) + 1,
    },
    { onConflict: "user_id,kind,key" }
  );
  revalidatePath("/dsa");
}

/* ─────────────────────────── notes ─────────────────────────── */

export async function saveNote(input: {
  id?: string;
  scope: string;
  ref?: string | null;
  title?: string | null;
  body: string;
  tags?: string[];
  path?: string;
}) {
  const { supabase, uid } = await userId();
  const row = {
    user_id: uid,
    scope: input.scope,
    ref: input.ref ?? null,
    title: input.title ?? null,
    body: input.body,
    tags: input.tags ?? [],
  };

  if (input.id) {
    await supabase.from("notes").update(row).match({ id: input.id, user_id: uid });
  } else {
    await supabase.from("notes").insert(row);
  }
  revalidatePath(input.path ?? "/notes");
  revalidatePath("/notes");
}

export async function deleteNote(id: string, path = "/notes") {
  const { supabase, uid } = await userId();
  await supabase.from("notes").delete().match({ id, user_id: uid });
  revalidatePath(path);
  revalidatePath("/notes");
}

export async function togglePin(id: string, pinned: boolean) {
  const { supabase, uid } = await userId();
  await supabase.from("notes").update({ pinned }).match({ id, user_id: uid });
  revalidatePath("/notes");
}

/* ─────────────────────────── sessions ─────────────────────────── */

export async function logSession(hours: number, focus?: string) {
  const { supabase, uid } = await userId();
  const day = new Date().toISOString().slice(0, 10);

  const { data } = await supabase
    .from("sessions")
    .select("hours")
    .match({ user_id: uid, day })
    .maybeSingle();

  await supabase.from("sessions").upsert(
    { user_id: uid, day, hours: Number(data?.hours ?? 0) + hours, focus: focus ?? null },
    { onConflict: "user_id,day" }
  );
  revalidatePath("/");
}

export async function clearToday() {
  const { supabase, uid } = await userId();
  const day = new Date().toISOString().slice(0, 10);
  await supabase.from("sessions").delete().match({ user_id: uid, day });
  revalidatePath("/");
}

/* ─────────────────────────── applications ─────────────────────────── */

export async function addApplication(form: FormData) {
  const { supabase, uid } = await userId();
  const company = String(form.get("company") ?? "").trim();
  if (!company) return;

  await supabase.from("applications").insert({
    user_id: uid,
    company,
    role: String(form.get("role") ?? "") || null,
    ctc_ask: String(form.get("ctc_ask") ?? "") || null,
    stage: String(form.get("stage") ?? "Researching"),
    link: String(form.get("link") ?? "") || null,
  });
  revalidatePath("/jobs");
}

export async function updateStage(id: string, stage: string) {
  const { supabase, uid } = await userId();
  await supabase.from("applications").update({ stage }).match({ id, user_id: uid });
  revalidatePath("/jobs");
}

export async function deleteApplication(id: string) {
  const { supabase, uid } = await userId();
  await supabase.from("applications").delete().match({ id, user_id: uid });
  revalidatePath("/jobs");
}

/* ─────────────────────────── auth ─────────────────────────── */

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/");
}
