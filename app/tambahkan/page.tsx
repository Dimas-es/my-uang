"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  FiShoppingCart,
  FiCoffee,
  FiPhone,
  FiMonitor,
  FiBook,
  FiScissors,
  FiActivity,
  FiUsers,
  FiTruck,
  FiShoppingBag,
  FiNavigation,
  FiDroplet,
  FiZap,
  FiHardDrive,
  FiSend,
  FiHeart,
  FiHome,
  FiTool,
  FiGift,
  FiDollarSign,
  FiGrid,
  FiStar,
  FiUser,
  FiPackage,
  FiTarget,
  FiSettings,
  FiCamera,
  FiCheck,
  FiCalendar,
  FiPlus,
  FiMinus,
  FiDelete,
  FiClock,
} from "react-icons/fi";
import type { Category } from "@/app/types";

type TransactionType = "expense" | "income";

const expenseCategories: Category[] = [
  { id: "belanja", label: "Belanja", icon: <FiShoppingCart className="h-6 w-6" />, iconBg: "bg-zinc-700" },
  { id: "makanan", label: "Makanan", icon: <FiCoffee className="h-6 w-6" />, iconBg: "bg-zinc-700" },
  { id: "telepon", label: "Telepon", icon: <FiPhone className="h-6 w-6" />, iconBg: "bg-zinc-700" },
  { id: "hiburan", label: "Hiburan", icon: <FiMonitor className="h-6 w-6" />, iconBg: "bg-zinc-700" },
  { id: "pendidikan", label: "Pendidikan", icon: <FiBook className="h-6 w-6" />, iconBg: "bg-zinc-700" },
  { id: "kecantikan", label: "Kecantikan", icon: <FiScissors className="h-6 w-6" />, iconBg: "bg-zinc-700" },
  { id: "olahraga", label: "Olahraga", icon: <FiActivity className="h-6 w-6" />, iconBg: "bg-zinc-700" },
  { id: "sosial", label: "Sosial", icon: <FiUsers className="h-6 w-6" />, iconBg: "bg-zinc-700" },
  { id: "transportasi", label: "Transportasi", icon: <FiTruck className="h-6 w-6" />, iconBg: "bg-zinc-700" },
  { id: "pakaian", label: "Pakaian", icon: <FiShoppingBag className="h-6 w-6" />, iconBg: "bg-zinc-700" },
  { id: "mobil", label: "Mobil", icon: <FiNavigation className="h-6 w-6" />, iconBg: "bg-zinc-700" },
  { id: "minuman", label: "Minuman", icon: <FiDroplet className="h-6 w-6" />, iconBg: "bg-zinc-700" },
  { id: "rokok", label: "Rokok", icon: <FiZap className="h-6 w-6" />, iconBg: "bg-zinc-700" },
  { id: "elektronik", label: "Elektronik", icon: <FiHardDrive className="h-6 w-6" />, iconBg: "bg-zinc-700" },
  { id: "bepergian", label: "Bepergian", icon: <FiSend className="h-6 w-6" />, iconBg: "bg-zinc-700" },
  { id: "kesehatan", label: "Kesehatan", icon: <FiHeart className="h-6 w-6" />, iconBg: "bg-zinc-700" },
  { id: "peliharaan", label: "Peliharaan", icon: <FiHome className="h-6 w-6" />, iconBg: "bg-zinc-700" },
  { id: "perbaikan", label: "Perbaikan", icon: <FiTool className="h-6 w-6" />, iconBg: "bg-zinc-700" },
  { id: "perumahan", label: "Perumahan", icon: <FiHome className="h-6 w-6" />, iconBg: "bg-zinc-700" },
  { id: "rumah", label: "Rumah", icon: <FiHome className="h-6 w-6" />, iconBg: "bg-zinc-700" },
  { id: "hadiah", label: "Hadiah", icon: <FiGift className="h-6 w-6" />, iconBg: "bg-zinc-700" },
  { id: "donasi", label: "Donasi", icon: <FiDollarSign className="h-6 w-6" />, iconBg: "bg-zinc-700" },
  { id: "lotre", label: "Lotre", icon: <FiGrid className="h-6 w-6" />, iconBg: "bg-zinc-700" },
  { id: "makanan-ringan", label: "Makanan ringan", icon: <FiStar className="h-6 w-6" />, iconBg: "bg-zinc-700" },
  { id: "anak-anak", label: "Anak-anak", icon: <FiUser className="h-6 w-6" />, iconBg: "bg-zinc-700" },
  { id: "sayur-mayur", label: "Sayur-mayur", icon: <FiPackage className="h-6 w-6" />, iconBg: "bg-zinc-700" },
  { id: "buah", label: "Buah", icon: <FiTarget className="h-6 w-6" />, iconBg: "bg-zinc-700" },
  { id: "pengaturan", label: "Pengaturan", icon: <FiSettings className="h-6 w-6" />, iconBg: "bg-zinc-700" },
];

const incomeCategories: Category[] = [
  { id: "gaji", label: "Gaji", icon: <FiDollarSign className="h-5 w-5" />, iconBg: "bg-zinc-700" },
  { id: "bonus", label: "Bonus", icon: <FiGift className="h-5 w-5" />, iconBg: "bg-zinc-700" },
  { id: "investasi", label: "Investasi", icon: <FiActivity className="h-5 w-5" />, iconBg: "bg-zinc-700" },
  { id: "bisnis", label: "Bisnis", icon: <FiShoppingCart className="h-5 w-5" />, iconBg: "bg-zinc-700" },
];

export default function TambahkanPage() {
  const router = useRouter();
  const [transactionType, setTransactionType] = useState<TransactionType>("expense");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [amount, setAmount] = useState<string>("0");
  const [note, setNote] = useState<string>("");

  const categories = transactionType === "expense" 
    ? expenseCategories 
    : incomeCategories;

  const formatDisplayAmount = (value: string): string => {
    // Remove all non-numeric characters
    const numericOnly = value.replace(/[^\d]/g, "");
    if (numericOnly === "" || numericOnly === "0") return "0";
    
    // Convert to number and format with Indonesian locale (dots for thousands)
    const numValue = parseInt(numericOnly, 10);
    return numValue.toLocaleString("id-ID");
  };

  const handleNumberInput = (value: string) => {
    const currentNumeric = amount.replace(/[^\d]/g, "");
    if (currentNumeric === "0") {
      setAmount(value);
    } else {
      setAmount(currentNumeric + value);
    }
  };

  const handleComma = () => {
    // For now, comma is just a separator, we'll handle decimal later if needed
    const currentNumeric = amount.replace(/[^\d]/g, "");
    if (!amount.includes(",")) {
      setAmount(currentNumeric + ",");
    }
  };

  const handleBackspace = () => {
    const currentNumeric = amount.replace(/[^\d]/g, "");
    if (currentNumeric.length > 1) {
      setAmount(currentNumeric.slice(0, -1));
    } else {
      setAmount("0");
    }
  };

  const handleSave = () => {
    // TODO: Save transaction logic
    console.log({ transactionType, selectedCategory, amount, note });
    router.back();
  };

  const displayAmount = formatDisplayAmount(amount);

  return (
    <div className="flex min-h-screen flex-col pb-[400px]">
      {/* Header */}
      <header className="flex items-center justify-between py-4">
        <button
          onClick={() => router.back()}
          className="text-base text-white"
          type="button"
        >
          Batalkan
        </button>
        <h1 className="text-lg font-medium text-white">Tambahkan</h1>
        <button
          className="text-base text-white"
          type="button"
        >
          <FiClock className="h-5 w-5" />
        </button>
      </header>

      {/* Transaction Type Tabs */}
      <div className="mt-4 flex gap-2 rounded-xl bg-white/5 p-1">
        <button
          onClick={() => setTransactionType("expense")}
          className={`flex-1 rounded-lg py-2 text-center text-sm font-medium transition-colors ${
            transactionType === "expense"
              ? "bg-white text-black"
              : "text-white"
          }`}
          type="button"
        >
          Pengeluaran
        </button>
        <button
          onClick={() => setTransactionType("income")}
          className={`flex-1 rounded-lg py-2 text-center text-sm font-medium transition-colors ${
            transactionType === "income"
              ? "bg-white text-black"
              : "text-white"
          }`}
          type="button"
        >
          Pemasukan
        </button>
      </div>

      {/* Category Grid */}
      <div className="mt-6 grid grid-cols-4 gap-3">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className="flex flex-col items-center gap-2 rounded-xl p-2 transition-colors bg-transparent"
            type="button"
          >
            <div
              className={`flex h-14 w-14 items-center justify-center rounded-full ${
                selectedCategory === category.id
                  ? "bg-yellow-400"
                  : "bg-zinc-800"
              } ${selectedCategory === category.id ? "text-black" : "text-white"}`}
            >
              {category.icon}
            </div>
            <span className="text-xs text-center text-white">
              {category.label}
            </span>
          </button>
        ))}
      </div>

      {/* Amount Display, Note Input, and Numeric Keypad - Fixed */}
      {selectedCategory && (
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-50 bg-[#0c0c0c]" style={{ margin: 0, paddingLeft: 0, paddingRight: 0, paddingBottom: 0 }}>
          {/* Amount Display and Note Input */}
          <div className="flex flex-col gap-4 px-6 pb-4">
            <div className="flex justify-end">
              <div className="text-5xl font-medium text-white">
                {displayAmount}
              </div>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
              <input
                type="text"
                placeholder="Catatan: Masukkan catatan..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full bg-transparent text-sm text-white placeholder:text-zinc-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Numeric Keypad */}
          <div className="grid grid-cols-4 gap-3 px-6 pt-0 pb-0 my-5">
        {/* Row 1: 7, 8, 9, Today */}
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
          className="flex h-14 flex-col items-center justify-center gap-1 rounded-xl bg-white/5 text-xs text-white active:bg-white/10"
          type="button"
        >
          <FiCalendar className="h-4 w-4" />
          <span>Hari ini</span>
        </button>

        {/* Row 2: 4, 5, 6, Plus */}
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
        <button
          className="flex h-14 items-center justify-center rounded-xl bg-white/5 text-white active:bg-white/10"
          type="button"
        >
          <FiPlus className="h-5 w-5" />
        </button>

        {/* Row 3: 1, 2, 3, Minus */}
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
        <button
          className="flex h-14 items-center justify-center rounded-xl bg-white/5 text-white active:bg-white/10"
          type="button"
        >
          <FiMinus className="h-5 w-5" />
        </button>

        {/* Row 4: Comma, 0, Backspace, Checkmark */}
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
          className="flex h-14 items-center justify-center rounded-xl bg-yellow-400 text-black active:bg-yellow-500"
          type="button"
        >
          <FiCheck className="h-6 w-6" />
        </button>
      </div>
      </div>
      )}
    </div>
  );
}

