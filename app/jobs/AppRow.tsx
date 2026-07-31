"use client";

import { useTransition } from "react";
import { Badge } from "@/components/ui";
import { STAGES } from "@/lib/curriculum";
import { updateStage, deleteApplication } from "@/app/actions";
import type { AppRow as Row } from "@/lib/state";

export default function AppRow({ app }: { app: Row }) {
  const [pending, start] = useTransition();

  const tone =
    app.stage === "Offer" ? "ok" : app.stage === "Rejected" ? "neutral" : "warn";

  return (
    <tr className="border-b border-[#f2f1ee]" style={{ opacity: pending ? 0.5 : 1 }}>
      <td className="py-2 px-2 font-semibold">{app.company}</td>
      <td className="py-2 px-2">{app.role ?? "—"}</td>
      <td className="py-2 px-2 tabular-nums">{app.ctc_ask ?? "—"}</td>
      <td className="py-2 px-2">
        <select
          value={app.stage}
          onChange={(e) => {
            const v = e.target.value;
            start(() => updateStage(app.id, v));
          }}
          className="text-[12px] border border-[#e4e4e0] rounded-md px-1.5 py-1 bg-white"
        >
          {STAGES.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <span className="ml-2 hidden sm:inline-block">
          <Badge tone={tone}>{app.stage}</Badge>
        </span>
      </td>
      <td className="py-2 px-2 text-[#6b6b66] text-[12px]">
        {new Date(app.created_at).toLocaleDateString()}
      </td>
      <td className="py-2 px-2">
        <button
          onClick={() => start(() => deleteApplication(app.id))}
          className="text-[#6b6b66] hover:text-[#b0473f] px-1"
        >
          ✕
        </button>
      </td>
    </tr>
  );
}
