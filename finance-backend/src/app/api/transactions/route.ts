import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserIdWithFallback } from "@/lib/auth";

// helper: parse month "YYYY-MM" jadi rentang tanggal [start, end)
function monthRange(month?: string) {
  if (!month) return undefined;
  // contoh: "2025-08" -> start: 2025-08-01T00:00:00.000Z, end: 2025-09-01T00:00:00.000Z
  const [y, m] = month.split("-").map(Number);
  if (!y || !m || m < 1 || m > 12) return undefined;
  const start = new Date(Date.UTC(y, m - 1, 1, 0, 0, 0));
  const end = new Date(Date.UTC(m === 12 ? y + 1 : y, m === 12 ? 0 : m, 1, 0, 0, 0));
  return { start, end };
}

export async function GET(req: NextRequest) {
  const userId = getUserIdWithFallback(req);

  const { searchParams } = new URL(req.url);
  const month = searchParams.get("month") ?? undefined; // ex: "2025-08"
  const type = searchParams.get("type") as "INCOME" | "EXPENSE" | null;

  const range = monthRange(month);

  const where: any = { userId };
  if (type === "INCOME" || type === "EXPENSE") where.type = type;
  if (range) where.occurredAt = { gte: range.start, lt: range.end };

  // include tags biar bisa balikin tagIds[]
  const rows = await prisma.transaction.findMany({
    where,
    orderBy: { occurredAt: "desc" },
    include: { tags: true }, // TransactionTag[]
  });

  // map ke shape FE
  const data = rows.map((t) => ({
    id: t.id,
    userId: t.userId,
    amount: Number(t.amount),
    type: t.type, // "INCOME" | "EXPENSE"
    occurredAt: t.occurredAt.toISOString(),
    categoryId: t.categoryId ?? undefined,
    notes: t.notes ?? undefined,
    tagIds: t.tags.map((jt) => jt.tagId),
    createdAt: t.createdAt.toISOString(),
    updatedAt: t.updatedAt.toISOString(),
  }));

  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const userId = getUserIdWithFallback(req);
  const body = await req.json();

  // Validasi minimal (biar cepat), nanti bisa ganti Zod
  const { amount, type, occurredAt, categoryId, notes, tagIds } = body as {
    amount: number;
    type: "INCOME" | "EXPENSE";
    occurredAt: string;            // ISO
    categoryId?: string;
    notes?: string;
    tagIds: string[];              // boleh []
  };

  if (!amount || amount <= 0) {
    return NextResponse.json({ message: "Nominal harus > 0" }, { status: 400 });
  }
  if (type !== "INCOME" && type !== "EXPENSE") {
    return NextResponse.json({ message: "Type invalid" }, { status: 400 });
  }
  if (!occurredAt) {
    return NextResponse.json({ message: "Tanggal wajib" }, { status: 400 });
  }

  // kalau ada kategori, pastikan punya user & tipenya cocok
  if (categoryId) {
    const cat = await prisma.category.findFirst({ where: { id: categoryId, userId } });
    if (!cat) return NextResponse.json({ message: "Kategori tidak ditemukan" }, { status: 400 });
    if (cat.type !== type) {
      return NextResponse.json({ message: "Kategori tidak sesuai dengan tipe transaksi" }, { status: 400 });
    }
  }

  const created = await prisma.$transaction(async (txdb) => {
    const tx = await txdb.transaction.create({
      data: {
        userId,
        amount,                 // Decimal akan di-handle Prisma
        type,
        occurredAt: new Date(occurredAt),
        categoryId: categoryId ?? null,
        notes: notes ?? null,
      },
    });

    if (Array.isArray(tagIds) && tagIds.length) {
      await txdb.transactionTag.createMany({
        data: tagIds.map((tagId) => ({ transactionId: tx.id, tagId })),
        skipDuplicates: true,
      });
    }

    return txdb.transaction.findUniqueOrThrow({
      where: { id: tx.id },
      include: { tags: true },
    });
  });

  return NextResponse.json({
    id: created.id,
    userId: created.userId,
    amount: Number(created.amount),
    type: created.type,
    occurredAt: created.occurredAt.toISOString(),
    categoryId: created.categoryId ?? undefined,
    notes: created.notes ?? undefined,
    tagIds: created.tags.map((t) => t.tagId),
    createdAt: created.createdAt.toISOString(),
    updatedAt: created.updatedAt.toISOString(),
  }, { status: 201 });
}
