"use client";

import { useMemo, useState } from "react";
import { FiChevronDown, FiTrendingUp, FiTrendingDown, FiMinus, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import type { DailyRecord, Transaction } from "@/app/types";
import { useFinanceData, type ClientCategory } from "@/app/hooks/useFinanceData";
import { renderIcon } from "@/lib/iconMap";

type PeriodKey = "week" | "month" | "year";

const periodTabs: { value: PeriodKey; label: string }[] = [
  { value: "week", label: "Pekan" },
  { value: "month", label: "Bulan" },
  { value: "year", label: "Tahun" },
];

const getAllTransactions = (records: DailyRecord[]): Transaction[] => {
  return records.flatMap((record) => record.items);
};

const getWeekNumber = (date: Date): number => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
};

const getWeekRange = (year: number, week: number): { start: Date; end: Date } => {
  const startOfYear = new Date(year, 0, 1);
  const daysToAdd = (week - 1) * 7;
  const startDate = new Date(startOfYear);
  startDate.setDate(startDate.getDate() + daysToAdd);

  const dayOfWeek = startDate.getDay();
  const diff = startDate.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
  startDate.setDate(diff);

  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 6);

  return { start: startDate, end: endDate };
};

function getAvailablePeriods(period: PeriodKey, transactions: Transaction[]): Array<{ value: string; label: string }> {
  const periods = new Set<string>();

  transactions.forEach((t) => {
    const date = new Date(t.transaction_date);
    if (period === "week") {
      const week = getWeekNumber(date);
      const year = date.getFullYear();
      periods.add(`${year}-W${week}`);
    } else if (period === "month") {
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      periods.add(`${year}-${String(month).padStart(2, "0")}`);
    } else if (period === "year") {
      periods.add(String(date.getFullYear()));
    }
  });

  const sorted = Array.from(periods).sort().reverse();

  return sorted.map((p) => {
    if (period === "week") {
      const [year, week] = p.split("-W");
      const weekNum = parseInt(week);
      const weekRange = getWeekRange(parseInt(year), weekNum);
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
      const startMonth = monthNames[weekRange.start.getMonth()];
      const endMonth = monthNames[weekRange.end.getMonth()];
      const startDay = weekRange.start.getDate();
      const endDay = weekRange.end.getDate();

      const today = new Date();
      const currentWeek = getWeekNumber(today);
      const currentYear = today.getFullYear();

      if (weekNum === currentWeek && parseInt(year) === currentYear) {
        return { value: p, label: `Minggu ini (${startDay} ${startMonth} - ${endDay} ${endMonth})` };
      }

      return { value: p, label: `Minggu ${weekNum} (${startDay} ${startMonth} - ${endDay} ${endMonth})` };
    } else if (period === "month") {
      const [year, month] = p.split("-");
      const monthNum = parseInt(month);
      const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

      const today = new Date();
      if (monthNum === today.getMonth() + 1 && parseInt(year) === today.getFullYear()) {
        return { value: p, label: `${monthNames[monthNum - 1]} (Bulan ini)` };
      }

      return { value: p, label: `${monthNames[monthNum - 1]} ${year}` };
    } else {
      const today = new Date();
      if (p === String(today.getFullYear())) {
        return { value: p, label: `${p} (Tahun ini)` };
      }
      return { value: p, label: p };
    }
  });
}

function getTransactionsByPeriod(
  period: PeriodKey,
  transactions: Transaction[],
  selectedPeriod?: string,
): Transaction[] {
  const today = new Date();

  if (!selectedPeriod) {
    if (period === "week") {
      return transactions;
    } else if (period === "month") {
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0");
      return transactions.filter((t) => t.transaction_date.startsWith(`${year}-${month}`));
    } else if (period === "year") {
      return transactions.filter((t) => t.transaction_date.startsWith(String(today.getFullYear())));
    }
  } else {
    if (period === "week") {
      const [year, week] = selectedPeriod.split("-W");
      const weekNum = parseInt(week);
      const weekRange = getWeekRange(parseInt(year), weekNum);
      return transactions.filter((t) => {
        const txDate = new Date(t.transaction_date);
        return txDate >= weekRange.start && txDate <= weekRange.end;
      });
    } else if (period === "month") {
      return transactions.filter((t) => t.transaction_date.startsWith(selectedPeriod));
    } else if (period === "year") {
      return transactions.filter((t) => t.transaction_date.startsWith(selectedPeriod));
    }
  }

  return transactions;
}

function getPreviousPeriodTransactions(
  period: PeriodKey,
  transactions: Transaction[],
  selectedPeriod?: string,
): Transaction[] {
  const today = new Date();

  if (!selectedPeriod) {
    if (period === "week") {
      return [];
    } else if (period === "month") {
      const prevMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const year = prevMonth.getFullYear();
      const month = String(prevMonth.getMonth() + 1).padStart(2, "0");
      return transactions.filter((t) => t.transaction_date.startsWith(`${year}-${month}`));
    } else if (period === "year") {
      return transactions.filter((t) => t.transaction_date.startsWith(String(today.getFullYear() - 1)));
    }
  } else {
    if (period === "week") {
      const [year, week] = selectedPeriod.split("-W");
      const weekNum = parseInt(week);
      let prevWeek = weekNum - 1;
      let prevYear = parseInt(year);

      if (prevWeek < 1) {
        prevWeek = 52;
        prevYear -= 1;
      }

      const weekRange = getWeekRange(prevYear, prevWeek);
      return transactions.filter((t) => {
        const txDate = new Date(t.transaction_date);
        return txDate >= weekRange.start && txDate <= weekRange.end;
      });
    } else if (period === "month") {
      const [year, month] = selectedPeriod.split("-");
      const monthNum = parseInt(month);
      let prevMonth = monthNum - 1;
      let prevYear = parseInt(year);

      if (prevMonth < 1) {
        prevMonth = 12;
        prevYear -= 1;
      }

      const prevPeriod = `${prevYear}-${String(prevMonth).padStart(2, "0")}`;
      return transactions.filter((t) => t.transaction_date.startsWith(prevPeriod));
    } else if (period === "year") {
      const prevYear = parseInt(selectedPeriod) - 1;
      return transactions.filter((t) => t.transaction_date.startsWith(String(prevYear)));
    }
  }

  return [];
}

function aggregateByCategory(
  transactions: Transaction[],
  type: "expense" | "income",
  categoryMap: Record<string, ClientCategory>,
) {
  const filtered = transactions.filter((t) => t.type === type);
  const grouped = filtered.reduce((acc, t) => {
    const catId = t.categoryId;
    if (!acc[catId]) {
      acc[catId] = { amount: 0, count: 0 };
    }
    acc[catId].amount += t.amount;
    acc[catId].count += 1;
    return acc;
  }, {} as Record<string, { amount: number; count: number }>);

  return Object.entries(grouped)
    .map(([catId, data]) => ({
      id: catId,
      label: categoryMap[catId]?.label || catId,
      amount: data.amount,
      count: data.count,
      iconKey: categoryMap[catId]?.iconKey,
      iconBg: categoryMap[catId]?.iconBg || "bg-zinc-500",
    }))
    .sort((a, b) => b.amount - a.amount);
}

const formatCurrency = (value: number) =>
  value.toLocaleString("id-ID", { minimumFractionDigits: 0 });

const formatPercentage = (value: number) => {
  const absValue = Math.abs(value);
  return `${value >= 0 ? "+" : ""}${absValue.toFixed(0)}%`;
};

export function LaporanPage() {
  const { categories: categoryMap, dailyRecords, loading, error } = useFinanceData();
  const [period, setPeriod] = useState<PeriodKey>("month");
  const [selectedPeriod, setSelectedPeriod] = useState<string | undefined>(undefined);

  const allTransactions = useMemo(() => getAllTransactions(dailyRecords), [dailyRecords]);
  const availablePeriods = useMemo(() => getAvailablePeriods(period, allTransactions), [period, allTransactions]);

  const normalizedSelectedPeriod = useMemo(() => {
    if (availablePeriods.length === 0) return undefined;
    if (selectedPeriod && availablePeriods.some((p) => p.value === selectedPeriod)) {
      return selectedPeriod;
    }
    return availablePeriods[0]?.value;
  }, [selectedPeriod, availablePeriods]);

  const currentTransactions = useMemo(
    () => getTransactionsByPeriod(period, allTransactions, normalizedSelectedPeriod),
    [period, normalizedSelectedPeriod, allTransactions],
  );
  const previousTransactions = useMemo(
    () => getPreviousPeriodTransactions(period, allTransactions, normalizedSelectedPeriod),
    [period, normalizedSelectedPeriod, allTransactions],
  );

  // Calculate totals
  const currentExpense = useMemo(
    () => currentTransactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0),
    [currentTransactions]
  );
  const currentIncome = useMemo(
    () => currentTransactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0),
    [currentTransactions]
  );
  const currentBalance = currentIncome - currentExpense;

  const previousExpense = useMemo(
    () => previousTransactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0),
    [previousTransactions]
  );
  const previousIncome = useMemo(
    () => previousTransactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0),
    [previousTransactions]
  );
  const previousBalance = previousIncome - previousExpense;

  // Calculate changes
  const expenseChange = previousExpense > 0 ? ((currentExpense - previousExpense) / previousExpense) * 100 : 0;
  const incomeChange = previousIncome > 0 ? ((currentIncome - previousIncome) / previousIncome) * 100 : 0;
  const balanceChange = previousBalance !== 0 ? ((currentBalance - previousBalance) / Math.abs(previousBalance)) * 100 : 0;

  // Top categories
  const topExpenseCategories = useMemo(
    () => aggregateByCategory(currentTransactions, "expense", categoryMap).slice(0, 5),
    [currentTransactions, categoryMap],
  );
  const topIncomeCategories = useMemo(
    () => aggregateByCategory(currentTransactions, "income", categoryMap).slice(0, 5),
    [currentTransactions, categoryMap],
  );

  // Statistics
  const totalTransactions = currentTransactions.length;
  const expenseTransactions = currentTransactions.filter((t) => t.type === "expense").length;
  const incomeTransactions = currentTransactions.filter((t) => t.type === "income").length;
  const avgExpense = expenseTransactions > 0 ? currentExpense / expenseTransactions : 0;
  const avgIncome = incomeTransactions > 0 ? currentIncome / incomeTransactions : 0;

  // Get current period label
  const currentPeriodLabel = useMemo(() => {
    if (!normalizedSelectedPeriod) return "";
    const found = availablePeriods.find((p) => p.value === normalizedSelectedPeriod);
    return found ? found.label : "";
  }, [normalizedSelectedPeriod, availablePeriods]);

  // Navigation helpers
  const currentIndex = useMemo(() => {
    if (!normalizedSelectedPeriod) return -1;
    return availablePeriods.findIndex((p) => p.value === normalizedSelectedPeriod);
  }, [availablePeriods, normalizedSelectedPeriod]);

  const canGoNext = currentIndex < availablePeriods.length - 1;
  const canGoPrev = currentIndex > 0;

  const handleNext = () => {
    if (canGoNext) {
      setSelectedPeriod(availablePeriods[currentIndex + 1].value);
    }
  };

  const handlePrev = () => {
    if (canGoPrev) {
      setSelectedPeriod(availablePeriods[currentIndex - 1].value);
    }
  };

  if (loading) {
    return <div className="py-20 text-center text-zinc-500">Memuat data…</div>;
  }

  if (error) {
    return (
      <div className="py-20 text-center text-red-400">
        {error}
      </div>
    );
  }

  return (
    <div className="pb-10">
      {/* Period Type Selector */}
      <section className="mt-2">
        <div className="relative">
          <select
            className="flex w-full items-center justify-between rounded-2xl border border-white/5 bg-white/5 px-4 py-3 text-left text-base text-white appearance-none"
            value={period}
            onChange={(event) => {
              setPeriod(event.target.value as PeriodKey);
              setSelectedPeriod(undefined); // Reset to trigger useEffect
            }}
          >
            {periodTabs.map((tab) => (
              <option key={tab.value} value={tab.value} className="text-black">
                {tab.label}
              </option>
            ))}
          </select>
          <FiChevronDown className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" />
        </div>
      </section>

      {/* Period Navigation */}
      {availablePeriods.length > 0 && normalizedSelectedPeriod && (
        <section className="mt-4">
          <div className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/5 px-4 py-3">
            <button
              type="button"
              onClick={handlePrev}
              disabled={!canGoPrev}
              className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
                canGoPrev ? "text-white hover:bg-white/10" : "text-zinc-600 cursor-not-allowed"
              }`}
            >
              <FiChevronLeft className="h-5 w-5" />
            </button>
            
            <div className="flex-1 text-center">
              <div className="text-sm font-medium text-white">{currentPeriodLabel}</div>
              {availablePeriods.length > 1 && (
                <div className="mt-1 text-xs text-zinc-500">
                  {currentIndex + 1} dari {availablePeriods.length}
                </div>
              )}
            </div>
            
            <button
              type="button"
              onClick={handleNext}
              disabled={!canGoNext}
              className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
                canGoNext ? "text-white hover:bg-white/10" : "text-zinc-600 cursor-not-allowed"
              }`}
            >
              <FiChevronRight className="h-5 w-5" />
            </button>
          </div>
        </section>
      )}

      {/* Alternative: Dropdown selector for period */}
      {availablePeriods.length > 0 && normalizedSelectedPeriod && (
        <section className="mt-3">
          <div className="relative">
            <select
              className="flex w-full items-center justify-between rounded-2xl border border-white/5 bg-white/5 px-4 py-3 text-left text-sm text-white appearance-none"
              value={normalizedSelectedPeriod}
              onChange={(event) => setSelectedPeriod(event.target.value)}
            >
              {availablePeriods.map((p) => (
                <option key={p.value} value={p.value} className="text-black">
                  {p.label}
                </option>
              ))}
            </select>
            <FiChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          </div>
        </section>
      )}

      {/* Summary Cards */}
      <section className="mt-6 rounded-2xl border border-white/5 bg-white/5 px-5 py-4">
        <div className="grid grid-cols-3 gap-3 text-center text-xs font-medium uppercase tracking-wide text-zinc-400">
          <div>
            <div>Pemasukan</div>
            <div className="mt-3 text-base font-normal text-white">{formatCurrency(currentIncome)}</div>
            {previousIncome > 0 && (
              <div className={`mt-2 flex items-center justify-center gap-1 text-[0.7rem] ${incomeChange >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                {incomeChange > 0 ? <FiTrendingUp className="h-3 w-3" /> : incomeChange < 0 ? <FiTrendingDown className="h-3 w-3" /> : <FiMinus className="h-3 w-3" />}
                <span>{formatPercentage(incomeChange)}</span>
              </div>
            )}
          </div>
          <div>
            <div>Pengeluaran</div>
            <div className="mt-3 text-base font-normal text-white">{formatCurrency(currentExpense)}</div>
            {previousExpense > 0 && (
              <div className={`mt-2 flex items-center justify-center gap-1 text-[0.7rem] ${expenseChange <= 0 ? "text-emerald-400" : "text-red-400"}`}>
                {expenseChange < 0 ? <FiTrendingDown className="h-3 w-3" /> : expenseChange > 0 ? <FiTrendingUp className="h-3 w-3" /> : <FiMinus className="h-3 w-3" />}
                <span>{formatPercentage(expenseChange)}</span>
              </div>
            )}
          </div>
          <div>
            <div>Saldo</div>
            <div className="mt-3 text-base font-normal text-white">{formatCurrency(currentBalance)}</div>
            {previousBalance !== 0 && (
              <div className={`mt-2 flex items-center justify-center gap-1 text-[0.7rem] ${balanceChange >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                {balanceChange > 0 ? <FiTrendingUp className="h-3 w-3" /> : balanceChange < 0 ? <FiTrendingDown className="h-3 w-3" /> : <FiMinus className="h-3 w-3" />}
                <span>{formatPercentage(balanceChange)}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="mt-6 rounded-2xl border border-white/5 bg-white/5 px-5 py-4">
        <div className="text-xs font-medium uppercase tracking-wide text-zinc-500">Statistik</div>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-zinc-400">Total Transaksi</div>
            <div className="mt-1 text-lg font-normal text-white">{totalTransactions}</div>
          </div>
          <div>
            <div className="text-xs text-zinc-400">Rata-rata Pengeluaran</div>
            <div className="mt-1 text-lg font-normal text-white">{formatCurrency(avgExpense)}</div>
          </div>
          <div>
            <div className="text-xs text-zinc-400">Transaksi Pengeluaran</div>
            <div className="mt-1 text-lg font-normal text-white">{expenseTransactions}</div>
          </div>
          <div>
            <div className="text-xs text-zinc-400">Rata-rata Pemasukan</div>
            <div className="mt-1 text-lg font-normal text-white">{formatCurrency(avgIncome)}</div>
          </div>
        </div>
      </section>

      {/* Top Expense Categories */}
      {topExpenseCategories.length > 0 && (
        <section className="mt-6 rounded-2xl border border-white/5 bg-white/5 px-5 py-4">
          <div className="text-xs font-medium uppercase tracking-wide text-zinc-500">Top Kategori Pengeluaran</div>
          <div className="mt-4 space-y-4">
            {topExpenseCategories.map((category) => (
              <div key={category.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full text-black ${category.iconBg}`}>
                    {renderIcon(category.iconKey ?? "FiGrid", "h-5 w-5")}
                  </div>
                  <div>
                    <div className="text-base text-white">{category.label}</div>
                    <div className="text-xs text-zinc-500">{category.count} transaksi</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-base font-normal text-white">{formatCurrency(category.amount)}</div>
                  <div className="text-xs text-zinc-500">
                    {currentExpense > 0 ? Math.round((category.amount / currentExpense) * 100) : 0}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Top Income Categories */}
      {topIncomeCategories.length > 0 && (
        <section className="mt-6 rounded-2xl border border-white/5 bg-white/5 px-5 py-4">
          <div className="text-xs font-medium uppercase tracking-wide text-zinc-500">Top Kategori Pemasukan</div>
          <div className="mt-4 space-y-4">
            {topIncomeCategories.map((category) => (
              <div key={category.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full text-black ${category.iconBg}`}>
                    {renderIcon(category.iconKey ?? "FiGrid", "h-5 w-5")}
                  </div>
                  <div>
                    <div className="text-base text-white">{category.label}</div>
                    <div className="text-xs text-zinc-500">{category.count} transaksi</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-base font-normal text-white">{formatCurrency(category.amount)}</div>
                  <div className="text-xs text-zinc-500">
                    {currentIncome > 0 ? Math.round((category.amount / currentIncome) * 100) : 0}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Insights */}
      <section className="mt-6 rounded-2xl border border-white/5 bg-[#121212] px-5 py-4">
        <div className="text-xs font-medium uppercase tracking-wide text-zinc-500">Insights</div>
        <div className="mt-4 space-y-3">
          {currentBalance >= 0 ? (
            <div className="flex items-start gap-3 rounded-xl bg-emerald-500/10 px-3 py-2">
              <FiTrendingUp className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-400" />
              <div className="text-sm text-white">
                Saldo positif! Pemasukan lebih besar dari pengeluaran pada periode {currentPeriodLabel.toLowerCase()}.
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-3 rounded-xl bg-red-500/10 px-3 py-2">
              <FiTrendingDown className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-400" />
              <div className="text-sm text-white">
                Perhatian: Pengeluaran melebihi pemasukan. Pertimbangkan untuk mengurangi pengeluaran.
              </div>
            </div>
          )}

          {topExpenseCategories.length > 0 && (
            <div className="flex items-start gap-3 rounded-xl bg-white/5 px-3 py-2">
              <div className="mt-0.5 h-4 w-4 flex-shrink-0 text-yellow-400">💡</div>
              <div className="text-sm text-white">
                Kategori <span className="font-medium text-yellow-400">{topExpenseCategories[0].label}</span> adalah pengeluaran terbesar dengan total {formatCurrency(topExpenseCategories[0].amount)}.
              </div>
            </div>
          )}

          {expenseChange > 10 && previousExpense > 0 && (
            <div className="flex items-start gap-3 rounded-xl bg-yellow-500/10 px-3 py-2">
              <FiTrendingUp className="mt-0.5 h-4 w-4 flex-shrink-0 text-yellow-400" />
              <div className="text-sm text-white">
                Pengeluaran meningkat {formatPercentage(expenseChange)} dibandingkan periode sebelumnya. Perhatikan pengeluaran Anda.
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default LaporanPage;


