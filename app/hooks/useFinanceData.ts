"use client";

import { useEffect, useMemo, useState } from "react";
import type { DailyRecord } from "@/app/types";

export type ClientCategory = {
  id: string;
  label: string;
  iconKey: string;
  iconBg: string;
  flow: "expense" | "income";
};

type FinanceResponse = {
  categories: ClientCategory[];
  dailyRecords: DailyRecord[];
};

export function useFinanceData() {
  const [data, setData] = useState<FinanceResponse>({ categories: [], dailyRecords: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    fetch("/api/finance")
      .then((res) => res.json())
      .then((payload: FinanceResponse) => {
        if (!mounted) return;
        setData(payload);
        setLoading(false);
      })
      .catch((err) => {
        if (!mounted) return;
        console.error(err);
        setError("Gagal memuat data");
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const categoryMap = useMemo(() => {
    return data.categories.reduce<Record<string, ClientCategory>>((acc, category) => {
      acc[category.id] = category;
      return acc;
    }, {});
  }, [data.categories]);

  return {
    categories: categoryMap,
    dailyRecords: data.dailyRecords,
    loading,
    error,
  };
}


