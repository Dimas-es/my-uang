const bgToHex: Record<string, string> = {
  "bg-rose-500": "#f43f5e",
  "bg-rose-400": "#fb7185",
  "bg-amber-500": "#f59e0b",
  "bg-amber-600": "#d97706",
  "bg-sky-500": "#0ea5e9",
  "bg-sky-400": "#38bdf8",
  "bg-violet-500": "#8b5cf6",
  "bg-indigo-500": "#6366f1",
  "bg-pink-500": "#ec4899",
  "bg-pink-600": "#db2777",
  "bg-green-500": "#22c55e",
  "bg-cyan-500": "#06b6d4",
  "bg-cyan-600": "#0891b2",
  "bg-emerald-500": "#10b981",
  "bg-emerald-600": "#059669",
  "bg-emerald-400": "#34d399",
  "bg-blue-500": "#3b82f6",
  "bg-blue-600": "#2563eb",
  "bg-orange-500": "#f97316",
  "bg-orange-600": "#ea580c",
  "bg-lime-500": "#84cc16",
  "bg-lime-600": "#65a30d",
  "bg-yellow-500": "#eab308",
  "bg-fuchsia-500": "#d946ef",
  "bg-teal-500": "#14b8a6",
  "bg-red-500": "#ef4444",
  "bg-slate-500": "#64748b",
  "bg-stone-500": "#78716c",
  "bg-neutral-500": "#737373",
  "bg-gray-500": "#6b7280",
  "bg-purple-500": "#a855f7",
  "bg-white/10": "rgba(255, 255, 255, 0.1)",
};

const DEFAULT_COLOR = "#3f3f46";

export function resolveCategoryColor(className?: string): string {
  if (!className) return DEFAULT_COLOR;
  if (bgToHex[className]) return bgToHex[className];
  if (className.startsWith("#")) return className;
  return DEFAULT_COLOR;
}

export function isLightColor(hexColor: string): boolean {
  const hex = hexColor.replace("#", "");
  const bigint = parseInt(hex.length === 3 ? hex.repeat(2) : hex, 16);
  if (Number.isNaN(bigint)) return false;
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.7;
}


