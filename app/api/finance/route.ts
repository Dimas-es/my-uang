import { NextResponse } from "next/server";
import { fetchCategoryOptions } from "@/lib/categories";
import { buildSummaryItems, fetchDailyRecords } from "@/lib/transactions";

export async function GET() {
  const [categories, dailyRecords] = await Promise.all([fetchCategoryOptions(), fetchDailyRecords()]);
  const summaryItems = buildSummaryItems(dailyRecords);

  return NextResponse.json({
    categories,
    dailyRecords,
    summaryItems,
  });
}


