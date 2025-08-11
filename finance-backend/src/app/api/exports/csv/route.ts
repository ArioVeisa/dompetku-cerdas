import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserIdWithFallback } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const userId = getUserIdWithFallback(req);

  try {
    const transactions = await prisma.transaction.findMany({
      where: { userId },
      include: {
        category: true,
        tags: { include: { tag: true } },
      },
      orderBy: { occurredAt: "desc" },
    });

    // Buat header CSV
    const headers = [
      "Tanggal",
      "Jenis",
      "Nominal",
      "Kategori",
      "Catatan",
      "Tags",
    ];

    // Buat baris data
    const rows = transactions.map((t) => [
      t.occurredAt.toISOString().split("T")[0], // YYYY-MM-DD
      t.type === "INCOME" ? "Pemasukan" : "Pengeluaran",
      t.amount.toString(),
      t.category?.name || "",
      t.notes || "",
      t.tags.map((tt) => tt.tag.name).join(", "),
    ]);

    // Gabungkan header dan data
    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    // Tambahkan BOM untuk encoding UTF-8 yang benar di Excel
    const bom = "\uFEFF";
    const csvWithBom = bom + csvContent;

    return new NextResponse(csvWithBom, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": "attachment; filename=transaksi.csv",
      },
    });
  } catch (error) {
    console.error("Error exporting CSV:", error);
    return NextResponse.json(
      { error: "Gagal export CSV" },
      { status: 500 }
    );
  }
}
