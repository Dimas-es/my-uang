"use client";

import { useEffect, useMemo, useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import type { Transaction } from "@/app/types";
import { categories, dailyRecords } from "@/app/mock";

type FlowType = "expense" | "income";
type PeriodKey = "day" | "week" | "month" | "year";

type ChartCategory = {
  id: string;
  label: string;
  percentage: number;
  amount: number;
  color: string;
};

type ChartSection = {
  title: string;
  dateLabel: string;
  total: number;
  categories: ChartCategory[];
  timeline: string[];
  currentTimelineIndex?: number;
};

// Color mapping untuk chart berdasarkan iconBg dari categories
const getCategoryColor = (categoryId: string): string => {
  const category = categories[categoryId];
  if (!category) return "#888888";
  
  // Map iconBg ke color hex
  const colorMap: Record<string, string> = {
    "bg-emerald-500": "#4ade80",
    "bg-lime-500": "#f5c84c",
  };
  
  return colorMap[category.iconBg] || "#888888";
};

// Extract semua transactions dari dailyRecords
const getAllTransactions = (): Transaction[] => {
  return dailyRecords.flatMap((record) => record.items);
};

// Helper untuk mendapatkan nomor minggu dalam tahun (ISO week)
const getWeekNumber = (date: Date): number => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
};

// Helper untuk mendapatkan tanggal awal dan akhir dari suatu minggu
const getWeekRange = (weekOffset: number): { start: Date; end: Date } => {
  const today = new Date();
  const currentWeek = getWeekNumber(today);
  const targetWeek = currentWeek - weekOffset;
  
  // Hitung tanggal awal minggu (Senin)
  const startOfYear = new Date(today.getFullYear(), 0, 1);
  const daysToAdd = (targetWeek - 1) * 7;
  const startDate = new Date(startOfYear);
  startDate.setDate(startDate.getDate() + daysToAdd);
  
  // Set ke Senin (day 1)
  const dayOfWeek = startDate.getDay();
  const diff = startDate.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
  startDate.setDate(diff);
  
  // Tanggal akhir minggu (Minggu)
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 6);
  
  return { start: startDate, end: endDate };
};

// Helper function untuk mengaggregasi transactions menjadi chart data
function aggregateTransactions(transactions: Transaction[], type: FlowType): ChartCategory[] {
  const filtered = transactions.filter((t) => t.type === type);
  const total = filtered.reduce((sum, t) => sum + t.amount, 0);
  
  const grouped = filtered.reduce((acc, t) => {
    const catId = t.categoryId;
    if (!acc[catId]) {
      acc[catId] = 0;
    }
    acc[catId] += t.amount;
    return acc;
  }, {} as Record<string, number>);
  
  return Object.entries(grouped)
    .map(([catId, amount]) => ({
      id: catId,
      label: categories[catId]?.label || catId,
      percentage: total > 0 ? Math.round((amount / total) * 100) : 0,
      amount,
      color: getCategoryColor(catId),
    }))
    .sort((a, b) => b.amount - a.amount);
}

const flowOptions: { value: FlowType; label: string }[] = [
  { value: "expense", label: "Pengeluaran" },
  { value: "income", label: "Pemasukan" },
];

const periodTabs: { value: PeriodKey; label: string }[] = [
  { value: "day", label: "Hari" },
  { value: "week", label: "Pekan" },
  { value: "month", label: "Bulan" },
  { value: "year", label: "Tahun" },
];

// Helper untuk mendapatkan transactions berdasarkan periode
function getTransactionsByPeriod(period: PeriodKey, type: FlowType): Transaction[] {
  // Ambil semua transactions dari dailyRecords
  let filtered = getAllTransactions().filter((t) => t.type === type);
  
  // Filter berdasarkan periode
  if (period === "day") {
    // Hari ini - ambil dari dailyRecords yang paling baru
    const latestRecord = dailyRecords[0];
    if (latestRecord) {
      filtered = latestRecord.items.filter((t) => t.type === type);
    }
  } else if (period === "week") {
    // Minggu ini - ambil dari semua dailyRecords (asumsi semua dalam 1 minggu)
    filtered = dailyRecords.flatMap((record) => 
      record.items.filter((t) => t.type === type)
    );
  } else if (period === "month") {
    // Bulan ini - ambil dari semua dailyRecords
    filtered = dailyRecords.flatMap((record) => 
      record.items.filter((t) => t.type === type)
    );
  } else if (period === "year") {
    // Tahun ini - ambil dari semua dailyRecords
    filtered = dailyRecords.flatMap((record) => 
      record.items.filter((t) => t.type === type)
    );
  }
  
  return filtered;
}

// Helper untuk generate timeline
const getDayTimeline = (): string[] => {
  const dayNames = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const today = new Date();
  const timeline: string[] = [];
  
  // Hari-hari sebelumnya (4 hari lalu, 3 hari lalu, 2 hari lalu)
  for (let i = 4; i >= 2; i--) {
    const pastDay = new Date(today);
    pastDay.setDate(pastDay.getDate() - i);
    timeline.push(dayNames[pastDay.getDay()]);
  }
  
  // Kemarin
  timeline.push("Kemarin");
  
  // Hari ini
  timeline.push("Hari ini");
  
  return timeline;
};

const getMonthTimeline = (): string[] => {
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
  const today = new Date();
  const timeline: string[] = [];
  
  // Bulan-bulan sebelumnya (4 bulan lalu, 3 bulan lalu, 2 bulan lalu)
  for (let i = 4; i >= 2; i--) {
    const pastMonth = new Date(today.getFullYear(), today.getMonth() - i, 1);
    timeline.push(monthNames[pastMonth.getMonth()]);
  }
  
  // Bulan lalu
  timeline.push("Bulan lalu");
  
  // Bulan ini
  timeline.push("Bulan ini");
  
  return timeline;
};

const getYearTimeline = (): string[] => {
  const today = new Date();
  const currentYear = today.getFullYear();
  const timeline: string[] = [];
  
  // Tahun-tahun sebelumnya (4 tahun lalu, 3 tahun lalu, 2 tahun lalu)
  for (let i = 4; i >= 2; i--) {
    timeline.push(String(currentYear - i));
  }
  
  // Tahun lalu
  timeline.push("Tahun lalu");
  
  // Tahun ini
  timeline.push("Tahun ini");
  
  return timeline;
};

// Generate timeline sekali dan simpan
const dayTimeline = getDayTimeline();
const monthTimeline = getMonthTimeline();
const yearTimeline = getYearTimeline();

// Generate chart data dari transactions
const chartData: Record<FlowType, Record<PeriodKey, ChartSection>> = {
  expense: {
    day: {
      title: "Hari ini",
      dateLabel: "Kamis, 20 Nov",
      total: 0,
      categories: [],
      timeline: dayTimeline,
      currentTimelineIndex: dayTimeline.length - 1,
    },
    week: {
      title: "Minggu ini",
      dateLabel: "16 Nov - 22 Nov",
      total: 0,
      categories: [],
      timeline: ["Minggu 44", "Minggu 45", "Minggu lalu", "Minggu ini"],
      currentTimelineIndex: 3,
    },
    month: {
      title: "November",
      dateLabel: "2025",
      total: 0,
      categories: [],
      timeline: monthTimeline,
      currentTimelineIndex: monthTimeline.length - 1,
    },
    year: {
      title: "2025",
      dateLabel: "Jan - Des",
      total: 0,
      categories: [],
      timeline: yearTimeline,
      currentTimelineIndex: yearTimeline.length - 1,
    },
  },
  income: {
    day: {
      title: "Hari ini",
      dateLabel: "Kamis, 20 Nov",
      total: 0,
      categories: [],
      timeline: dayTimeline,
      currentTimelineIndex: dayTimeline.length - 1,
    },
    week: {
      title: "Minggu ini",
      dateLabel: "16 Nov - 22 Nov",
      total: 0,
      categories: [],
      timeline: ["Minggu 44", "Minggu 45", "Minggu lalu", "Minggu ini"],
      currentTimelineIndex: 3,
    },
    month: {
      title: "November",
      dateLabel: "2025",
      total: 0,
      categories: [],
      timeline: monthTimeline,
      currentTimelineIndex: monthTimeline.length - 1,
    },
    year: {
      title: "2025",
      dateLabel: "Jan - Des",
      total: 0,
      categories: [],
      timeline: yearTimeline,
      currentTimelineIndex: yearTimeline.length - 1,
    },
  },
};

// Populate chart data dari transactions
Object.keys(chartData).forEach((flowType) => {
  Object.keys(chartData[flowType as FlowType]).forEach((period) => {
    const transactions = getTransactionsByPeriod(period as PeriodKey, flowType as FlowType);
    const aggregated = aggregateTransactions(transactions, flowType as FlowType);
    const total = transactions.reduce((sum, t) => sum + t.amount, 0);
    
    chartData[flowType as FlowType][period as PeriodKey] = {
      ...chartData[flowType as FlowType][period as PeriodKey],
      total,
      categories: aggregated,
    };
  });
});

const formatCurrency = (value: number) =>
  value.toLocaleString("id-ID", { minimumFractionDigits: 0 });

function DonutChart({ percentage, color }: { percentage: number; color: string }) {
  const radius = 72;
  const circumference = 2 * Math.PI * radius;
  const dashArray = `${(percentage / 100) * circumference} ${circumference}`;

  return (
    <div className="relative flex h-40 w-40 items-center justify-center">
      <svg className="h-full w-full rotate-[-90deg]" viewBox="0 0 200 200">
        <circle cx="100" cy="100" r={radius} stroke="#1f1f1f" strokeWidth="16" fill="transparent" />
        <circle
          cx="100"
          cy="100"
          r={radius}
          stroke={color}
          strokeWidth="16"
          strokeLinecap="round"
          fill="transparent"
          strokeDasharray={dashArray}
        />
      </svg>
      <div className="absolute flex flex-col items-center text-center">
        <span className="text-base font-normal">{percentage}%</span>
        <span className="text-xs text-zinc-500">Total</span>
      </div>
    </div>
  );
}

export function GrafikPage() {
  const [flow, setFlow] = useState<FlowType>("expense");
  const [period, setPeriod] = useState<PeriodKey>("week");
  const [selectedTimelineIndex, setSelectedTimelineIndex] = useState<number | null>(null);

  const section = useMemo(() => chartData[flow][period], [flow, period]);

  // Reset timeline index saat period atau flow berubah
  useEffect(() => {
    setSelectedTimelineIndex(section.currentTimelineIndex ?? section.timeline.length - 1);
  }, [period, flow, section.currentTimelineIndex, section.timeline.length]);

  // Get transactions berdasarkan timeline yang dipilih
  const getTransactionsByTimeline = useMemo(() => {
    if (selectedTimelineIndex === null) return [];
    
    const today = new Date();
    let filtered: Transaction[] = [];
    
    if (period === "day") {
      const dayIndex = selectedTimelineIndex;
      const targetDate = new Date(today);
      
      if (dayIndex === section.timeline.length - 1) {
        // Hari ini
        targetDate.setDate(today.getDate());
      } else if (dayIndex === section.timeline.length - 2) {
        // Kemarin
        targetDate.setDate(today.getDate() - 1);
      } else {
        // Hari sebelumnya (4, 3, 2 hari lalu)
        const daysAgo = section.timeline.length - 1 - dayIndex;
        targetDate.setDate(today.getDate() - daysAgo);
      }
      
      const dateStr = targetDate.toISOString().split("T")[0];
      filtered = getAllTransactions().filter(
        (t) => t.transaction_date === dateStr && t.type === flow
      );
    } else if (period === "week") {
      const weekIndex = selectedTimelineIndex;
      const today = new Date();
      
      if (weekIndex === section.timeline.length - 1) {
        // Minggu ini
        const weekRange = getWeekRange(0);
        filtered = getAllTransactions().filter((t) => {
          const txDate = new Date(t.transaction_date);
          return txDate >= weekRange.start && txDate <= weekRange.end && t.type === flow;
        });
      } else if (weekIndex === section.timeline.length - 2) {
        // Minggu lalu
        const weekRange = getWeekRange(1);
        filtered = getAllTransactions().filter((t) => {
          const txDate = new Date(t.transaction_date);
          return txDate >= weekRange.start && txDate <= weekRange.end && t.type === flow;
        });
      } else {
        // Minggu sebelumnya (Minggu 44, 45, dll)
        // Hitung offset berdasarkan index (0 = minggu paling lama)
        const weeksAgo = section.timeline.length - 1 - weekIndex;
        const weekRange = getWeekRange(weeksAgo);
        filtered = getAllTransactions().filter((t) => {
          const txDate = new Date(t.transaction_date);
          return txDate >= weekRange.start && txDate <= weekRange.end && t.type === flow;
        });
      }
    } else if (period === "month") {
      const monthIndex = selectedTimelineIndex;
      const targetMonth = new Date(today);
      
      if (monthIndex === section.timeline.length - 1) {
        // Bulan ini
        targetMonth.setMonth(today.getMonth());
      } else if (monthIndex === section.timeline.length - 2) {
        // Bulan lalu
        targetMonth.setMonth(today.getMonth() - 1);
      } else {
        // Bulan sebelumnya
        const monthsAgo = section.timeline.length - 1 - monthIndex;
        targetMonth.setMonth(today.getMonth() - monthsAgo);
      }
      
      const year = targetMonth.getFullYear();
      const month = String(targetMonth.getMonth() + 1).padStart(2, "0");
      filtered = getAllTransactions().filter(
        (t) => t.transaction_date.startsWith(`${year}-${month}`) && t.type === flow
      );
    } else if (period === "year") {
      const yearIndex = selectedTimelineIndex;
      const targetYear = today.getFullYear();
      
      if (yearIndex === section.timeline.length - 1) {
        // Tahun ini
        filtered = getAllTransactions().filter(
          (t) => t.transaction_date.startsWith(String(targetYear)) && t.type === flow
        );
      } else if (yearIndex === section.timeline.length - 2) {
        // Tahun lalu
        filtered = getAllTransactions().filter(
          (t) => t.transaction_date.startsWith(String(targetYear - 1)) && t.type === flow
        );
      } else {
        // Tahun sebelumnya
        const yearsAgo = section.timeline.length - 1 - yearIndex;
        filtered = getAllTransactions().filter(
          (t) => t.transaction_date.startsWith(String(targetYear - yearsAgo)) && t.type === flow
        );
      }
    }
    
    return filtered;
  }, [selectedTimelineIndex, period, flow, section.timeline.length]);

  // Generate chart data dari transactions yang difilter
  const filteredSection = useMemo(() => {
    const aggregated = aggregateTransactions(getTransactionsByTimeline, flow);
    const total = getTransactionsByTimeline.reduce((sum, t) => sum + t.amount, 0);
    
    return {
      ...section,
      total,
      categories: aggregated,
    };
  }, [getTransactionsByTimeline, flow, section]);

  const dominantCategory = useMemo(() => {
    if (filteredSection.categories.length === 0) {
      return { percentage: 0, color: "#888888" };
    }
    return filteredSection.categories.reduce((prev, current) =>
      current.percentage > prev.percentage ? current : prev,
    );
  }, [filteredSection]);

  return (
    <div className="pb-10">
      <section className="mt-2">
        <div className="relative">
          <select
            className="flex w-full items-center justify-between rounded-2xl border border-white/5 bg-white/5 px-4 py-3 text-left text-base text-white appearance-none"
            value={flow}
            onChange={(event) => setFlow(event.target.value as FlowType)}
          >
            {flowOptions.map((option) => (
              <option key={option.value} value={option.value} className="text-black">
                {option.label}
              </option>
            ))}
          </select>
          <FiChevronDown className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" />
        </div>
      </section>

      <section className="mt-6 flex gap-2 rounded-2xl bg-white/5 p-1 text-sm font-medium text-zinc-400">
        {periodTabs.map((tab) => (
          <button
            key={tab.value}
            type="button"
            className={`flex-1 rounded-2xl px-3 py-2 ${
              tab.value === period ? "bg-yellow-400 text-black" : "bg-transparent"
            }`}
            onClick={() => setPeriod(tab.value)}
          >
            {tab.label}
          </button>
        ))}
      </section>

      <section className="mt-6">
        <div className="flex items-center justify-between text-xs font-medium uppercase tracking-wide text-zinc-500">
          {section.timeline.map((label, index) => {
            const isActive = selectedTimelineIndex === index;
            return (
              <button
                key={label}
                type="button"
                onClick={() => setSelectedTimelineIndex(index)}
                className={`flex flex-col items-center px-2 cursor-pointer transition-colors ${
                  isActive ? "text-yellow-400" : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                <span>{label}</span>
                {isActive && (
                  <div className="mt-2 h-0.5 w-full rounded-full bg-yellow-400" />
                )}
              </button>
            );
          })}
        </div>
      </section>

      <section className="mt-6 space-y-6 rounded-3xl border border-white/5 bg-[#121212] px-6 py-8">
        <div className="flex items-center justify-between text-sm text-zinc-400">
          <div>
            <p>{filteredSection.title}</p>
            <p className="text-xs text-zinc-500">{filteredSection.dateLabel}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-zinc-500">Total</p>
            <p className="text-base font-normal text-white">{formatCurrency(filteredSection.total)}</p>
          </div>
        </div>

        {filteredSection.categories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-base text-zinc-500">Tidak ada catatan</p>
            <p className="mt-2 text-sm text-zinc-600">
              Belum ada {flow === "expense" ? "pengeluaran" : "pemasukan"} pada periode ini
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-6">
            <DonutChart percentage={dominantCategory.percentage} color={dominantCategory.color} />

            <div className="w-full space-y-4">
              {filteredSection.categories.map((category) => (
                <article key={category.id}>
                  <div className="flex items-center justify-between text-base">
                    <div className="flex items-center gap-3">
                      <span
                        className="h-9 w-9 rounded-full"
                        style={{ backgroundColor: `${category.color}33` }}
                      >
                        <span
                          className="sr-only"
                        >{`Kategori ${category.label}`}</span>
                      </span>
                      <div>
                        <p className="text-white">{category.label}</p>
                        <p className="text-xs text-zinc-500">{category.percentage}%</p>
                      </div>
                    </div>
                    <div className="text-right text-white">{formatCurrency(category.amount)}</div>
                  </div>
                  <div className="mt-3 h-2 rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${category.percentage}%`, backgroundColor: category.color }}
                    />
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

export default GrafikPage;
