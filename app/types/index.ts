import type { ReactNode } from "react";

/**
 * Raw entities: should remain stable because all downstream features rely on these shapes.
 */
export type Category = {
  id: string;
  label: string;
  icon: ReactNode;
  iconBg: string;
};

export type Transaction = {
  id: string;
  title?: string;
  amount: number;
  type: "expense" | "income";
  categoryId: Category["id"];
  transaction_date: string;
  note?: string;
};

/**
 * UI aggregations: flexible structures for screens (e.g., grouped by day).
 */
export type DailyRecord = {
  id: string;
  dateLabel: string;
  day: string;
  totals: {
    expense: string;
    income: string;
  };
  items: Transaction[];
};



