"use client";

import { useState, useTransition } from "react";
import { logSession, clearToday } from "@/app/actions";

export default function LogSession() {
  const [hours, setHours] = useState("2.5");
  const [pending, start] = useTransition();

  return (
    <div className="flex gap-2 items-center flex-wrap">
      <input
        type="number"
        min="0.5"
        max="12"
        step="0.5"
        value={hours}
        onChange={(e) => setHours(e.target.value)}
        className="w-20 border border-[#e4e4e0] rounded-lg px-2.5 py-1.5 text-[13px] outline-none focus:border-[#c8613a]"
      />
      <button
        disabled={pending}
        onClick={() => start(() => logSession(parseFloat(hours) || 0))}
        className="bg-[#1a1a18] text-white rounded-lg px-3.5 py-1.5 text-[13px] font-medium hover:bg-black disabled:opacity-50"
      >
        Log session
      </button>
      <button
        disabled={pending}
        onClick={() => start(() => clearToday())}
        className="border border-[#e4e4e0] rounded-lg px-3 py-1.5 text-[13px] hover:bg-[#f4f4f1]"
      >
        Clear today
      </button>
    </div>
  );
}
