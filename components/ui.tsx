import type { CSSProperties, ReactNode } from "react";

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-white border border-[#e4e4e0] rounded-xl p-4 sm:p-5 ${className}`}
    >
      {children}
    </div>
  );
}

export function H1({ children }: { children: ReactNode }) {
  return <h1 className="text-xl font-semibold tracking-tight">{children}</h1>;
}
export function H2({ children }: { children: ReactNode }) {
  return <h2 className="text-base font-semibold tracking-tight">{children}</h2>;
}
export function Sub({ children }: { children: ReactNode }) {
  return <p className="text-[12.5px] leading-relaxed text-[#6b6b66]">{children}</p>;
}

export function Bar({ pct, color = "#c8613a" }: { pct: number; color?: string }) {
  return (
    <div className="h-2 bg-[#eceae6] rounded-full overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-300"
        style={{ width: `${Math.max(0, Math.min(100, pct))}%`, background: color }}
      />
    </div>
  );
}

export function Badge({
  children,
  tone = "neutral",
  style,
}: {
  children: ReactNode;
  tone?: "neutral" | "ok" | "warn" | "accent";
  style?: CSSProperties;
}) {
  const tones = {
    neutral: "bg-[#efefec] text-[#6b6b66]",
    ok: "bg-[#e8f2ec] text-[#3f7d5c]",
    warn: "bg-[#fbf3e2] text-[#b8862b]",
    accent: "bg-[#fbeee8] text-[#c8613a]",
  };
  return (
    <span
      className={`inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full ${tones[tone]}`}
      style={style}
    >
      {children}
    </span>
  );
}

export function Note({
  children,
  tone = "accent",
}: {
  children: ReactNode;
  tone?: "accent" | "ok" | "warn";
}) {
  const map = {
    accent: "bg-[#fbeee8] border-[#c8613a]",
    ok: "bg-[#e8f2ec] border-[#3f7d5c]",
    warn: "bg-[#fbf3e2] border-[#b8862b]",
  };
  return (
    <div className={`border-l-[3px] rounded-r-lg px-3 py-2.5 text-[13px] ${map[tone]}`}>
      {children}
    </div>
  );
}

export function Stat({ value, label }: { value: ReactNode; label: string }) {
  return (
    <div>
      <div className="text-2xl font-bold tracking-tight leading-tight">{value}</div>
      <div className="text-[11px] uppercase tracking-wider text-[#6b6b66]">{label}</div>
    </div>
  );
}
