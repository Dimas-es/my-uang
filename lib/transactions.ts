import type { Transaction as PrismaTransaction } from "@prisma/client";
import type { DailyRecord, Transaction } from "@/app/types";
import { dailyRecords as mockDailyRecords } from "@/app/mock/catatan";
import { prisma } from "@/lib/prisma";

const DAY_NAMES = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

const currencyFormatter = new Intl.NumberFormat("id-ID", {
  minimumFractionDigits: 0,
});

function formatCurrency(value: number): string {
  return currencyFormatter.format(value);
}

function mapRecordToTransaction(record: PrismaTransaction): Transaction {
  return {
    id: record.id,
    title: record.title ?? undefined,
    amount: record.amount,
    type: record.type as Transaction["type"],
    categoryId: record.categoryId,
    transaction_date: record.transactionDate.toISOString(),
    note: record.note ?? undefined,
  };
}

function mapFallbackTransactions(): Transaction[] {
  return mockDailyRecords.flatMap((record) => record.items);
}

function buildDailyRecord(dateKey: string, items: Transaction[]): DailyRecord {
  const date = new Date(dateKey);
  const expenseTotal = items
    .filter((item) => item.type === "expense")
    .reduce((sum, item) => sum + item.amount, 0);
  const incomeTotal = items
    .filter((item) => item.type === "income")
    .reduce((sum, item) => sum + item.amount, 0);

  return {
    id: dateKey,
    dateLabel: `${date.getDate()} ${MONTH_NAMES[date.getMonth()]}`,
    day: DAY_NAMES[date.getDay()],
    totals: {
      expense: formatCurrency(expenseTotal),
      income: formatCurrency(incomeTotal),
    },
    items: items.sort((a, b) => (a.transaction_date > b.transaction_date ? -1 : 1)),
  };
}

export async function fetchTransactions(): Promise<Transaction[]> {
  try {
    const records = await prisma.transaction.findMany({
      orderBy: { transactionDate: "desc" },
    });

    if (records.length === 0) {
      return mapFallbackTransactions();
    }

    return records.map(mapRecordToTransaction);
  } catch (error) {
    console.error("[fetchTransactions] Failed to load from database, falling back to mock data", error);
    return mapFallbackTransactions();
  }
}

export async function fetchDailyRecords(): Promise<DailyRecord[]> {
  const transactions = await fetchTransactions();
  if (transactions.length === 0) {
    return mockDailyRecords;
  }

  const grouped = transactions.reduce<Record<string, Transaction[]>>((acc, transaction) => {
    const dateKey = transaction.transaction_date.split("T")[0];
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(transaction);
    return acc;
  }, {});

  return Object.entries(grouped)
    .sort(([a], [b]) => (a > b ? -1 : 1))
    .map(([dateKey, items]) => buildDailyRecord(dateKey, items));
}

export function buildSummaryItems(records: DailyRecord[]) {
  const totals = records.reduce(
    (acc, record) => {
      record.items.forEach((item) => {
        if (item.type === "expense") {
          acc.expense += item.amount;
        } else if (item.type === "income") {
          acc.income += item.amount;
        }
      });
      return acc;
    },
    { expense: 0, income: 0 },
  );

  const balance = totals.income - totals.expense;

  return [
    { label: "Pengeluaran", value: formatCurrency(totals.expense) },
    { label: "Pemasukan", value: formatCurrency(totals.income) },
    { label: "Saldo", value: formatCurrency(balance) },
  ];
}


