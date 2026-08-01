"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "@/app/actions";

const LINKS = [
  ["/", "Dashboard"],
  ["/roadmap", "Roadmap"],
  ["/dsa", "DSA"],
  ["/system-design", "System Design"],
  ["/projects", "Projects"],
  ["/notes", "Notes"],
  ["/jobs", "Jobs"],
] as const;

export default function Nav() {
  const path = usePathname();

  return (
    <nav className="flex items-center gap-1 flex-wrap border-b border-[#e4e4e0] mb-4 -mx-1">
      {LINKS.map(([href, label]) => {
        const active = href === "/" ? path === "/" : path.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`px-3 py-2 text-[13px] font-medium rounded-t-md border-b-2 transition-colors ${
              active
                ? "text-[#c8613a] border-[#c8613a]"
                : "text-[#6b6b66] border-transparent hover:text-[#1a1a18] hover:bg-[#efefec]"
            }`}
          >
            {label}
          </Link>
        );
      })}

      <form action={signOut} className="ml-auto">
        <button className="px-3 py-2 text-[12px] text-[#6b6b66] hover:text-[#1a1a18]">
          Sign out
        </button>
      </form>
    </nav>
  );
}
