import type { ReactNode } from "react";
import { FiBookOpen, FiFileText, FiPieChart, FiPlus } from "react-icons/fi";

export type BottomNavItem = {
  label: string;
  isActive?: boolean;
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
    isActive: true,
    icon: <FiBookOpen className="h-5 w-5" />,
  },
  {
    label: "Grafik",
    icon: <FiPieChart className="h-5 w-5" />,
  },
  {
    label: "Laporan",
    icon: <FiFileText className="h-5 w-5" />,
  },
  {
    label: "",
    accent: true,
    icon: <FiPlus className="h-5 w-5" />,
  },
];

export function BottomNav({ items = defaultNavItems, onAddClick, className = "" }: BottomNavProps) {
  const midpoint = Math.ceil(items.length / 2);
  const leading = items.slice(0, midpoint);
  const trailing = items.slice(midpoint);

  const renderItem = (item: BottomNavItem) => (
    <button
      key={item.label}
      className={`flex flex-1 flex-col items-center gap-1 ${
        item.isActive ? "text-yellow-400" : "text-zinc-500"
      }`}
      type="button"
    >
      <span
        className={`flex items-center justify-center text-current ${
          item.accent
            ? "h-10 w-10 rounded-full bg-yellow-400 text-black shadow-[0_10px_30px_rgba(255,223,70,0.35)]"
            : "h-6 w-6"
        }`}
      >
        {item.icon ?? (
          <span className="h-2 w-2 rounded-md bg-current" aria-hidden="true" />
        )}
      </span>
      <span>{item.label}</span>
    </button>
  );

  return (
    <nav
      className={`relative flex w-full items-center justify-between bg-[#0f0f0f] px-0 py-4 text-[0.7rem] uppercase tracking-wide text-zinc-500 shadow-[0_-5px_20px_rgba(0,0,0,0.3)] ${className}`}
    >
      {leading.map(renderItem)}

      {trailing.map(renderItem)}
    </nav>
  );
}

