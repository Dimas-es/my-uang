"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { FiCalendar, FiCheck, FiClock, FiDelete, FiMinus, FiPlus } from "react-icons/fi";
import type { CategoryOption } from "@/lib/categories";
import { renderIcon } from "@/lib/iconMap";
import { createTransactionAction } from "@/app/actions/transactions";

type TransactionType = "expense" | "income";

type TambahkanFormProps = {
  categories: CategoryOption[];
};

const formatDisplayAmount = (value: string): string => {
  const numericOnly = value.replace(/[^\d]/g, "");
  if (numericOnly === "" || numericOnly === "0") return "0";
  const numValue = parseInt(numericOnly, 10);
  return numValue.toLocaleString("id-ID");
};

const formatDateInput = (value: Date) => value.toISOString().split("T")[0];
const formatTimeInput = (value: Date) => value.toISOString().split("T")[1].slice(0, 5);
const formatReadableDate = (value: Date) =>
  value.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

export function TambahkanForm({ categories }: TambahkanFormProps) {
  const router = useRouter();
  const [transactionType, setTransactionType] = useState<TransactionType>("expense");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [amount, setAmount] = useState<string>("0");
  const [note, setNote] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [liveTime, setLiveTime] = useState(() => new Date());
  const [dateValue, setDateValue] = useState(() => formatDateInput(new Date()));
  const [timeValue, setTimeValue] = useState(() => formatTimeInput(new Date()));
  const [showDatePicker, setShowDatePicker] = useState(false);

  const groupedCategories = useMemo(() => {
    return {
      expense: categories.filter((category) => category.flow === "expense"),
      income: categories.filter((category) => category.flow === "income"),
    };
  }, [categories]);

  const visibleCategories = useMemo(
    () => groupedCategories[transactionType] ?? [],
    [groupedCategories, transactionType],
  );

  const activeCategoryId = useMemo(() => {
    if (!selectedCategory) return null;
    return visibleCategories.some((category) => category.id === selectedCategory) ? selectedCategory : null;
  }, [selectedCategory, visibleCategories]);

  const selectedDateTime = useMemo(() => new Date(`${dateValue}T${timeValue}:00`), [dateValue, timeValue]);

  useEffect(() => {
    const timer = setInterval(() => setLiveTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleResetDateTime = () => {
    const now = new Date();
    setDateValue(formatDateInput(now));
    setTimeValue(formatTimeInput(now));
  };

  const handleNumberInput = (value: string) => {
    setAmount((prev) => {
      const currentNumeric = prev.replace(/[^\d]/g, "");
      if (currentNumeric === "0") {
        return value;
      }
      return currentNumeric + value;
    });
  };

  const handleComma = () => {
    setAmount((prev) => {
      if (prev.includes(",")) {
        return prev;
      }
      const numericOnly = prev.replace(/[^\d]/g, "");
      return `${numericOnly},`;
    });
  };

  const handleBackspace = () => {
    setAmount((prev) => {
      const currentNumeric = prev.replace(/[^\d]/g, "");
      if (currentNumeric.length > 1) {
        return currentNumeric.slice(0, -1);
      }
      return "0";
    });
  };

  const handleSave = () => {
    if (!activeCategoryId) {
      setErrorMessage("Pilih kategori dulu ya");
      return;
    }

    const numeric = parseInt(amount.replace(/[^\d]/g, ""), 10);
    if (!numeric || Number.isNaN(numeric) || numeric <= 0) {
      setErrorMessage("Nominal harus lebih dari 0");
      return;
    }

    startTransition(async () => {
      try {
        await createTransactionAction({
          amount: numeric,
          categoryId: activeCategoryId,
          type: transactionType,
          note: note || undefined,
          title: note || undefined,
          transactionDate: selectedDateTime.toISOString(),
        });
        setErrorMessage(null);
        router.back();
      } catch (error) {
        console.error(error);
        setErrorMessage(error instanceof Error ? error.message : "Gagal menyimpan transaksi");
      }
    });
  };

  const displayAmount = formatDisplayAmount(amount);
  const liveTimeLabel = liveTime.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  const readableSelectedDate = formatReadableDate(selectedDateTime);

  return (
    <div className="flex min-h-screen flex-col pb-[400px]">
      <header className="flex items-center justify-between py-4">
        <button
          onClick={() => router.back()}
          className="text-base text-white"
          type="button"
          disabled={isPending}
        >
          Batalkan
        </button>
        <h1 className="text-lg font-medium text-white">Tambahkan</h1>
        <div className="text-right text-xs text-zinc-400">
          <div className="flex items-center justify-end gap-1">
            <FiClock className="h-4 w-4" />
            <span>{liveTimeLabel}</span>
          </div>
          <p className="text-[0.6rem] text-zinc-500">{readableSelectedDate}</p>
        </div>
      </header>

      <div className="mt-4 flex gap-2 rounded-xl bg-white/5 p-1">
        {(["expense", "income"] as TransactionType[]).map((type) => (
          <button
            key={type}
            onClick={() => setTransactionType(type)}
            className={`flex-1 rounded-lg py-2 text-center text-sm font-medium transition-colors ${
              transactionType === type ? "bg-white text-black" : "text-white"
            }`}
            type="button"
          >
            {type === "expense" ? "Pengeluaran" : "Pemasukan"}
          </button>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-4 gap-3">
        {visibleCategories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className="flex flex-col items-center gap-2 rounded-xl p-2 transition-colors bg-transparent"
            type="button"
          >
            <div
              className={`flex h-14 w-14 items-center justify-center rounded-full ${
                activeCategoryId === category.id ? "bg-yellow-400 text-black" : "bg-zinc-800 text-white"
              }`}
            >
              {renderIcon(category.iconKey, "h-6 w-6")}
            </div>
            <span className="text-xs text-center text-white">{category.label}</span>
          </button>
        ))}
      </div>

      {activeCategoryId && (
        <div
          className="fixed bottom-0 left-1/2 z-50 w-full max-w-md -translate-x-1/2 bg-[#0c0c0c]"
          style={{ margin: 0, paddingLeft: 0, paddingRight: 0, paddingBottom: 0 }}
        >
          <div className="flex flex-col gap-4 px-6 pb-4">
            <div className="flex justify-end">
              <div className="text-5xl font-medium text-white">{displayAmount}</div>
            </div>
            <button
              type="button"
              onClick={() => setShowDatePicker((prev) => !prev)}
              className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm text-white"
            >
              <div>
                <p className="text-xs uppercase tracking-wide text-zinc-400">Tanggal & Waktu</p>
                <p className="text-base">{readableSelectedDate}</p>
                <p className="text-xs text-zinc-500">{timeValue} WIB</p>
              </div>
              <FiCalendar className="h-5 w-5 text-white" />
            </button>
            {showDatePicker && (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <label className="text-xs uppercase tracking-wide text-zinc-400">Pilih tanggal</label>
                <input
                  type="date"
                  value={dateValue}
                  onChange={(event) => setDateValue(event.target.value)}
                  className="mt-2 w-full rounded-lg bg-black/20 px-3 py-2 text-sm text-white focus:outline-none"
                />
                <label className="mt-4 block text-xs uppercase tracking-wide text-zinc-400">Pilih waktu</label>
                <input
                  type="time"
                  value={timeValue}
                  onChange={(event) => setTimeValue(event.target.value)}
                  className="mt-2 w-full rounded-lg bg-black/20 px-3 py-2 text-sm text-white focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleResetDateTime}
                  className="mt-4 w-full rounded-lg border border-white/10 px-3 py-2 text-sm text-white hover:bg-white/10"
                >
                  Gunakan waktu sekarang
                </button>
              </div>
            )}
            <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
              <input
                type="text"
                placeholder="Catatan: Masukkan catatan..."
                value={note}
                onChange={(event) => setNote(event.target.value)}
                className="w-full bg-transparent text-sm text-white placeholder:text-zinc-500 focus:outline-none"
                disabled={isPending}
              />
            </div>
            {errorMessage && <p className="text-sm text-red-400">{errorMessage}</p>}
          </div>

          <div className="my-5 grid grid-cols-4 gap-3 px-6 pt-0 pb-0">
            <button
              onClick={() => handleNumberInput("7")}
              className="flex h-14 items-center justify-center rounded-xl bg-white/5 text-xl font-medium text-white active:bg-white/10"
              type="button"
            >
              7
            </button>
            <button
              onClick={() => handleNumberInput("8")}
              className="flex h-14 items-center justify-center rounded-xl bg-white/5 text-xl font-medium text-white active:bg-white/10"
              type="button"
            >
              8
            </button>
            <button
              onClick={() => handleNumberInput("9")}
              className="flex h-14 items-center justify-center rounded-xl bg-white/5 text-xl font-medium text-white active:bg-white/10"
              type="button"
            >
              9
            </button>
            <button
              onClick={() => setShowDatePicker((prev) => !prev)}
              className="flex h-14 flex-col items-center justify-center gap-1 rounded-xl bg-white/5 text-xs text-white active:bg-white/10"
              type="button"
            >
              <FiCalendar className="h-4 w-4" />
              <span>Atur</span>
            </button>

            <button
              onClick={() => handleNumberInput("4")}
              className="flex h-14 items-center justify-center rounded-xl bg-white/5 text-xl font-medium text-white active:bg-white/10"
              type="button"
            >
              4
            </button>
            <button
              onClick={() => handleNumberInput("5")}
              className="flex h-14 items-center justify-center rounded-xl bg-white/5 text-xl font-medium text-white active:bg-white/10"
              type="button"
            >
              5
            </button>
            <button
              onClick={() => handleNumberInput("6")}
              className="flex h-14 items-center justify-center rounded-xl bg-white/5 text-xl font-medium text-white active:bg-white/10"
              type="button"
            >
              6
            </button>
            <button className="flex h-14 items-center justify-center rounded-xl bg-white/5 text-white active:bg-white/10" type="button" disabled>
              <FiPlus className="h-5 w-5" />
            </button>

            <button
              onClick={() => handleNumberInput("1")}
              className="flex h-14 items-center justify-center rounded-xl bg-white/5 text-xl font-medium text-white active:bg-white/10"
              type="button"
            >
              1
            </button>
            <button
              onClick={() => handleNumberInput("2")}
              className="flex h-14 items-center justify-center rounded-xl bg-white/5 text-xl font-medium text-white active:bg-white/10"
              type="button"
            >
              2
            </button>
            <button
              onClick={() => handleNumberInput("3")}
              className="flex h-14 items-center justify-center rounded-xl bg-white/5 text-xl font-medium text-white active:bg-white/10"
              type="button"
            >
              3
            </button>
            <button className="flex h-14 items-center justify-center rounded-xl bg-white/5 text-white active:bg-white/10" type="button" disabled>
              <FiMinus className="h-5 w-5" />
            </button>

            <button
              onClick={handleComma}
              className="flex h-14 items-center justify-center rounded-xl bg-white/5 text-xl font-medium text-white active:bg-white/10"
              type="button"
            >
              ,
            </button>
            <button
              onClick={() => handleNumberInput("0")}
              className="flex h-14 items-center justify-center rounded-xl bg-white/5 text-xl font-medium text-white active:bg-white/10"
              type="button"
            >
              0
            </button>
            <button
              onClick={handleBackspace}
              className="flex h-14 items-center justify-center rounded-xl bg-white/5 text-white active:bg-white/10"
              type="button"
            >
              <FiDelete className="h-5 w-5" />
            </button>
            <button
              onClick={handleSave}
              className="flex h-14 items-center justify-center rounded-xl bg-yellow-400 text-black active:bg-yellow-500 disabled:opacity-70"
              type="button"
              disabled={isPending}
            >
              <FiCheck className="h-6 w-6" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TambahkanForm;


