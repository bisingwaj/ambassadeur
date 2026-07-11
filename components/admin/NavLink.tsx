"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavLink({ href, label, exact }: { href: string; label: string; exact?: boolean }) {
  const pathname = usePathname();
  const active = exact ? pathname === href : pathname === href || pathname.startsWith(href + "/");
  return (
    <Link
      href={href}
      style={{
        font: "600 13.5px/1 var(--font-schibsted),sans-serif",
        color: active ? "#fff" : "#A9BCDE",
        padding: "8px 2px",
        borderBottom: `2px solid ${active ? "#4C8DF0" : "transparent"}`,
      }}
    >
      {label}
    </Link>
  );
}
