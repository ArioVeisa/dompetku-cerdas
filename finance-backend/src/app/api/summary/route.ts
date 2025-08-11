import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserIdWithFallback } from "@/lib/auth";

// helper: "YYYY-MM-DD"
function dayKey(date: Date) {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export async function GET(req: NextRequest) {
  const userId = getUserIdWithFallback(req);
  const { searchParams } = new URL(req.url);
  const month = searchParams.get("month") ?? undefined; // ex: "2025-08"

  // ambil semua transaksi user
  const all = await prisma.transaction.findMany({
    where: { userId },
    orderBy: { occurredAt: "desc" },
    include: { tags: false },
  });

  // filter untuk ringkasan "bulan aktif" kalau dikirim
  const current = month
    ? all.filter((t) => t.occurredAt.toISOString().startsWith(month))
    : all;

  const income = current
    .filter((t) => t.type === "INCOME")
    .reduce((s, t) => s + Number(t.amount), 0);

  const expense = current
    .filter((t) => t.type === "EXPENSE")
    .reduce((s, t) => s + Number(t.amount), 0);

  const net = income - expense;

  // byCategory (pakai nama kategori; fokus expense)
  const cats = await prisma.category.findMany({ where: { userId } });
  const byCatMap = new Map<string, number>();
  for (const t of current) {
    if (!t.categoryId) continue;
    if (t.type !== "EXPENSE") continue; // biasanya pie untuk expense
    byCatMap.set(t.categoryId, (byCatMap.get(t.categoryId) ?? 0) + Number(t.amount));
  }
  const byCategory = Array.from(byCatMap.entries()).map(([categoryId, total]) => {
    const cat = cats.find((c) => c.id === categoryId);
    return {
      categoryId,
      categoryName: cat?.name ?? "(Tanpa Kategori)",
      total,
    };
  });

  // byDay: semua hari yang ada transaksi (buat line chart tren harian)
  const days = Array.from(new Set(all.map((t) => dayKey(t.occurredAt)))).sort();
  const byDay = days.map((day) => {
    const dayTransactions = all.filter((t) => dayKey(t.occurredAt) === day);
    const inc = dayTransactions.filter((t) => t.type === "INCOME").reduce((s, t) => s + Number(t.amount), 0);
    const exp = dayTransactions.filter((t) => t.type === "EXPENSE").reduce((s, t) => s + Number(t.amount), 0);
    return { day, income: inc, expense: exp, net: inc - exp };
  });

  // byMonth: untuk fallback dan kompatibilitas (tetap ada tapi tidak digunakan di chart)
  const months = Array.from(new Set(all.map((t) => t.occurredAt.toISOString().substring(0, 7)))).sort();
  const byMonth = months.map((m) => {
    const ms = all.filter((t) => t.occurredAt.toISOString().startsWith(m));
    const inc = ms.filter((t) => t.type === "INCOME").reduce((s, t) => s + Number(t.amount), 0);
    const exp = ms.filter((t) => t.type === "EXPENSE").reduce((s, t) => s + Number(t.amount), 0);
    return { month: m, income: inc, expense: exp, net: inc - exp };
  });

  return NextResponse.json({ 
    income, 
    expense, 
    net, 
    byCategory, 
    byMonth, // untuk kompatibilitas
    byDay // data baru untuk chart harian
  });
}
