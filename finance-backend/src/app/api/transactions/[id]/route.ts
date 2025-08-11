import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserIdWithFallback } from "@/lib/auth";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const userId = getUserIdWithFallback(req);
  const { id } = params;

  try {
    // Pastikan transaksi milik user yang sedang login
    const transaction = await prisma.transaction.findFirst({
      where: { id, userId },
    });

    if (!transaction) {
      return NextResponse.json(false);
    }

    // Hapus transaction tags terlebih dahulu
    await prisma.transactionTag.deleteMany({
      where: { transactionId: id },
    });

    // Hapus transaksi
    const deleted = await prisma.transaction.deleteMany({
      where: { id, userId },
    });

    return NextResponse.json(deleted.count > 0);
  } catch (error) {
    console.error("Error deleting transaction:", error);
    return NextResponse.json(false);
  }
}
