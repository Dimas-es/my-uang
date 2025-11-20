import { FiCoffee, FiTruck } from "react-icons/fi";
import type { Category, DailyRecord } from "@/app/types";

export const summaryItems = [
  { label: "Pengeluaran", value: "15.000" },
  { label: "Pemasukan", value: "50.000" },
  { label: "Saldo", value: "35.000" },
];

export const categories: Record<Category["id"], Category> = {
  transport: {
    id: "transport",
    label: "Transport",
    icon: <FiTruck className="h-5 w-5" />,
    iconBg: "bg-emerald-500",
  },
  lifestyle: {
    id: "lifestyle",
    label: "Lifestyle",
    icon: <FiCoffee className="h-5 w-5" />,
    iconBg: "bg-lime-500",
  },
};

export const dailyRecords: DailyRecord[] = [
  {
    id: "2025-11-20",
    dateLabel: "20 Nov",
    day: "Kamis",
    totals: {
      expense: "15.000",
      income: "50.000",
    },
    items: [
      {
        id: "trx-gojek",
        title: "gojek",
        amount: 50000,
        type: "income",
        categoryId: "transport",
        transaction_date: "2025-11-20",
      },
      {
        id: "trx-marlboro",
        title: "Marlboro",
        amount: 15000,
        type: "expense",
        categoryId: "lifestyle",
        transaction_date: "2025-11-20",
      },
    ],
  },
];

