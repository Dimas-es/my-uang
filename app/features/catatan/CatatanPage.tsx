import type { ReactNode } from "react";
import { FiCoffee, FiTruck } from "react-icons/fi";

const summaryItems = [
  { label: "Pengeluaran", value: "15.000" },
  { label: "Pemasukan", value: "50.000" },
  { label: "Saldo", value: "35.000" },
];

type Category = {
  id: string;
  label: string;
  icon: ReactNode;
  iconBg: string;
};

const categories: Record<string, Category> = {
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

type Transaction = {
  id: string;
  title: string;
  amount: number;
  type: "expense" | "income";
  categoryId: keyof typeof categories;
};

type DailyRecord = {
  id: string;
  dateLabel: string;
  day: string;
  totals: {
    expense: string;
    income: string;
  };
  items: Transaction[];
};

const dailyRecords: DailyRecord[] = [
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
      },
      {
        id: "trx-marlboro",
        title: "Marlboro",
        amount: 15000,
        type: "expense",
        categoryId: "lifestyle",
      },
    ],
  },
];

const formatCurrency = (value: number) =>
  value.toLocaleString("id-ID", { minimumFractionDigits: 0 });

export function CatatanPage() {
  return (
    <>
      <header>
        <div className="text-sm text-zinc-400">2025</div>
        <div className="mt-1 flex items-center text-3xl font-normal text-white">
          Nov
          <svg
            className="ml-2 h-5 w-5 text-zinc-400"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M5.8 7.3 10 11.5l4.2-4.2 1.4 1.4-5.6 5.6-5.6-5.6z" />
          </svg>
        </div>
        <section className="mt-5 rounded-2xl border border-white/5 bg-white/5 px-5 py-4">
          <div className="grid grid-cols-3 gap-3 text-center text-xs font-medium uppercase tracking-wide text-zinc-400">
            {summaryItems.map((item) => (
              <div key={item.label}>
                <div>{item.label}</div>
                <div className="mt-3 text-base font-normal text-white">{item.value}</div>
              </div>
            ))}
          </div>
        </section>
      </header>

      <section className="mt-6 space-y-5">
        {dailyRecords.map((record) => (
          <article key={record.id} className="rounded-2xl px-4 py-1">
            <div className="flex items-center justify-between text-xs font-medium uppercase tracking-wide text-zinc-500">
              <div className="flex items-center gap-2 text-white">
                <span className="text-[0.7rem] font-normal leading-none">{record.dateLabel}</span>
                <span className="text-[0.7rem] text-zinc-500 leading-none">{record.day}</span>
              </div>
              <div className="flex items-center gap-4 text-[0.7rem]">
                <span>Pengeluaran: {record.totals.expense}</span>
                <span>Pemasukan: {record.totals.income}</span>
              </div>
            </div>

            <ul className="mt-4 space-y-3">
              {record.items.map((item) => {
                const category = categories[item.categoryId];
                return (
                  <li key={item.id} className="flex items-center justify-between border-b border-white/10 px-0 py-3 last:border-b-0">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-full text-black ${category.iconBg}`}
                        title={category.label}
                      >
                        {category.icon}
                      </div>
                      <p className="text-base capitalize text-white">{item.title}</p>
                    </div>
                    <span
                      className={`text-base font-normal ${
                        item.type === "expense" ? "text-white" : "text-white"
                      }`}
                    >
                      {item.type === "expense" ? "-" : ""}
                      {formatCurrency(item.amount)}
                    </span>
                  </li>
                );
              })}
            </ul>
          </article>
        ))}
      </section>
    </>
  );
}

