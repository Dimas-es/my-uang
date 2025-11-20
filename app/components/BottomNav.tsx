"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiBookOpen, FiFileText, FiPieChart, FiPlus } from "react-icons/fi";

export type BottomNavItem = {
  label: string;
  href?: string;
  icon?: ReactNode;
  accent?: boolean;
};

type BottomNavProps = {
  items?: BottomNavItem[];
  onAddClick?: () => void;
  className?: string;
};

export const defaultNavItems: BottomNavItem[] = [
  {
    label: "Catatan",
    href: "/catatan",
    icon: <FiBookOpen className="h-5 w-5" />,
  },
  {
    label: "Grafik",
    href: "/grafik",
    icon: <FiPieChart className="h-5 w-5" />,
  },
  {
    label: "Laporan",
    href: "/laporan",
    icon: <FiFileText className="h-5 w-5" />,
  },
  {
    label: "",
    accent: true,
    icon: <FiPlus className="h-5 w-5" />,
  },
];

export function BottomNav({ items = defaultNavItems, onAddClick, className = "" }: BottomNavProps) {
  const pathname = usePathname();
  const midpoint = Math.ceil(items.length / 2);
  const leading = items.slice(0, midpoint);
  const trailing = items.slice(midpoint);

  const renderItem = (item: BottomNavItem) => {
    const isActive = item.href ? pathname === item.href : false;
    const isAccent = item.accent;

    if (isAccent) {
      return (
        <button
          key={item.label || "add"}
          onClick={onAddClick}
          className="flex flex-1 flex-col items-center gap-1 text-zinc-500"
          type="button"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-400 text-black shadow-[0_10px_30px_rgba(255,223,70,0.35)]">
            {item.icon ?? (
              <span className="h-2 w-2 rounded-md bg-current" aria-hidden="true" />
            )}
          </span>
          <span>{item.label}</span>
        </button>
      );
    }

    if (item.href) {
      return (
        <Link
          key={item.label}
          href={item.href}
          className={`flex flex-1 flex-col items-center gap-1 cursor-pointer transition-colors relative z-10 min-h-[44px] min-w-[44px] justify-center touch-manipulation ${
            isActive ? "text-yellow-400" : "text-zinc-500 hover:text-zinc-300"
          }`}
          style={{ touchAction: "manipulation" }}
        >
          <span className="flex h-6 w-6 items-center justify-center text-current pointer-events-none">
            {item.icon ?? (
              <span className="h-2 w-2 rounded-md bg-current" aria-hidden="true" />
            )}
          </span>
          <span className="pointer-events-none">{item.label}</span>
        </Link>
      );
    }

    return (
      <button
        key={item.label}
        className={`flex flex-1 flex-col items-center gap-1 ${
          isActive ? "text-yellow-400" : "text-zinc-500"
        }`}
        type="button"
      >
        <span className="flex h-6 w-6 items-center justify-center text-current">
          {item.icon ?? (
            <span className="h-2 w-2 rounded-md bg-current" aria-hidden="true" />
          )}
        </span>
        <span>{item.label}</span>
      </button>
    );
  };

  return (
    <nav
      className={`relative flex w-full items-center justify-between bg-[#0f0f0f] px-0 py-4 text-[0.7rem] uppercase tracking-wide text-zinc-500 shadow-[0_-5px_20px_rgba(0,0,0,0.3)] ${className}`}
    >
      {leading.map(renderItem)}
      {trailing.map(renderItem)}
    </nav>
  );
}

