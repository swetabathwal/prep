"use client";

import { useOptimistic, useTransition } from "react";
import { setProgress } from "@/app/actions";

/** A checkbox bound to progress(kind, key). */
export function Check({
  kind,
  itemKey,
  checked,
  label,
  hint,
  path,
}: {
  kind: string;
  itemKey: string;
  checked: boolean;
  label: string;
  hint?: string;
  path: string;
}) {
  const [optimistic, setOptimistic] = useOptimistic(checked);
  const [, start] = useTransition();

  return (
    <label className="flex gap-2.5 items-start py-1.5 border-b border-dashed border-[#f0efec] last:border-0 cursor-pointer group">
      <input
        type="checkbox"
        checked={optimistic}
        onChange={(e) => {
          const next = e.target.checked;
          start(async () => {
            setOptimistic(next);
            await setProgress(kind, itemKey, next ? 1 : 0, path);
          });
        }}
        className="mt-[3px] w-[15px] h-[15px] shrink-0 accent-[#c8613a]"
      />
      <span className="text-[13px] leading-snug">
        <span className={optimistic ? "line-through text-[#6b6b66]" : ""}>{label}</span>
        {hint && (
          <span className="block text-[11.5px] text-[#6b6b66] mt-0.5">{hint}</span>
        )}
      </span>
    </label>
  );
}

/** A segmented control bound to progress(kind, key) with integer values. */
export function Seg({
  kind,
  itemKey,
  value,
  options,
  path,
  colors,
}: {
  kind: string;
  itemKey: string;
  value: number;
  options: readonly string[];
  path: string;
  colors?: string[];
}) {
  const [optimistic, setOptimistic] = useOptimistic(value);
  const [, start] = useTransition();

  return (
    <div className="inline-flex border border-[#e4e4e0] rounded-lg overflow-hidden">
      {options.map((opt, idx) => {
        const on = optimistic === idx;
        return (
          <button
            key={opt}
            onClick={() =>
              start(async () => {
                setOptimistic(idx);
                await setProgress(kind, itemKey, idx, path);
              })
            }
            className={`px-2.5 py-1 text-[11.5px] border-r border-[#e4e4e0] last:border-r-0 whitespace-nowrap transition-colors ${
              on ? "text-white font-medium" : "bg-white hover:bg-[#f4f4f1]"
            }`}
            style={on ? { background: colors?.[idx] ?? "#1a1a18" } : undefined}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}
