import { db } from "./data";
import { Category, SummaryResponse, Tag, Transaction, TxType } from "@/types/finance";

const byUser = (userId: string) => (item: { userId: string }) => item.userId === userId;

function monthKey(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export interface ListFilter {
  userId: string;
  month?: string; // YYYY-MM
  type?: TxType;
}

export const mockTransactions = {
  list(filter: ListFilter): Transaction[] {
    const { userId, month, type } = filter;
    const { transactions } = db.get();
    return transactions
      .filter(byUser(userId))
      .filter(t => (month ? monthKey(t.occurredAt) === month : true))
      .filter(t => (type ? t.type === type : true))
      .sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime());
  },
  create(userId: string, input: Omit<Transaction, "id" | "createdAt" | "updatedAt" | "userId">): Transaction {
    const current = db.get();
    const newTx: Transaction = {
      ...input,
      id: `tx_${crypto.randomUUID?.() ?? Math.random().toString(36).slice(2)}`,
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    current.transactions.push(newTx);
    db.set(current);
    return newTx;
  },
  delete(userId: string, id: string) {
    const current = db.get();
    const idx = current.transactions.findIndex(t => t.id === id && t.userId === userId);
    if (idx >= 0) {
      current.transactions.splice(idx, 1);
      db.set(current);
      return true;
    }
    return false;
  },
  summary(userId: string, month?: string): SummaryResponse {
    const { transactions, categories } = db.get();
    const txs = transactions.filter(byUser(userId)).filter(t => (month ? monthKey(t.occurredAt) === month : true));

    const income = txs.filter(t => t.type === "INCOME").reduce((s, t) => s + t.amount, 0);
    const expense = txs.filter(t => t.type === "EXPENSE").reduce((s, t) => s + t.amount, 0);
    const net = income - expense;

    const byCategoryMap = new Map<string, number>();
    txs.forEach(t => {
      if (!t.categoryId) return;
      byCategoryMap.set(t.categoryId, (byCategoryMap.get(t.categoryId) ?? 0) + t.amount);
    });
    const byCategory = Array.from(byCategoryMap.entries()).map(([categoryId, total]) => {
      const cat = categories.find(c => c.id === categoryId);
      return { categoryId, categoryName: cat?.name ?? "(Tanpa Kategori)", total };
    });

    // Build last 6 months trend from all data
    const monthsSet = new Set<string>(transactions.filter(byUser(userId)).map(t => monthKey(t.occurredAt)));
    const months = Array.from(monthsSet).sort();

    const byMonth = months.map(m => {
      const ms = transactions.filter(byUser(userId)).filter(t => monthKey(t.occurredAt) === m);
      const inc = ms.filter(t => t.type === "INCOME").reduce((s, t) => s + t.amount, 0);
      const exp = ms.filter(t => t.type === "EXPENSE").reduce((s, t) => s + t.amount, 0);
      return { month: m, income: inc, expense: exp, net: inc - exp };
    });

    return { income, expense, net, byCategory, byMonth };
  },
  exportCsv(userId: string): string {
    const { transactions, categories, tags } = db.get();
    const rows = [
      ["id","type","amount","occurredAt","category","tags","notes"],
      ...transactions.filter(byUser(userId)).map(t => [
        t.id,
        t.type,
        String(t.amount),
        t.occurredAt,
        categories.find(c => c.id === t.categoryId)?.name ?? "",
        t.tagIds.map(id => tags.find(tt => tt.id === id)?.name ?? "").filter(Boolean).join("|"),
        t.notes ?? "",
      ])
    ];
    return rows.map(r => r.map(cell => `"${String(cell).replace(/"/g,'""')}"`).join(",")).join("\n");
  }
};

export const mockCategories = {
  list(userId: string): Category[] {
    const { categories } = db.get();
    return categories.filter(byUser(userId));
  }
};

export const mockTags = {
  list(userId: string): Tag[] {
    const { tags } = db.get();
    return tags.filter(byUser(userId));
  }
};
