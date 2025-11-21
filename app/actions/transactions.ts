"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

type CreateTransactionInput = {
  amount: number;
  categoryId: string;
  type: "expense" | "income";
  note?: string;
  title?: string;
  transactionDate?: string;
};

function validatePayload(payload: CreateTransactionInput) {
  if (!payload.categoryId) {
    throw new Error("Kategori wajib dipilih");
  }

  if (!payload.amount || Number.isNaN(payload.amount) || payload.amount <= 0) {
    throw new Error("Nominal harus lebih dari 0");
  }
}

export async function createTransactionAction(payload: CreateTransactionInput) {
  validatePayload(payload);

  const transactionDate = payload.transactionDate ? new Date(payload.transactionDate) : new Date();

  await prisma.transaction.create({
    data: {
      amount: payload.amount,
      type: payload.type,
      categoryId: payload.categoryId,
      note: payload.note ?? null,
      title: payload.title ?? payload.note ?? "Transaksi",
      transactionDate,
    },
  });

  revalidatePath("/");
  revalidatePath("/catatan");
  revalidatePath("/grafik");
  revalidatePath("/laporan");
}


