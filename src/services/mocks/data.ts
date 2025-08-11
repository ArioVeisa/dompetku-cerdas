import { Category, Tag, Transaction, TxType } from "@/types/finance";

const STORAGE_KEY = "pf_mock_db_v1";

interface DB {
  categories: Category[];
  tags: Tag[];
  transactions: Transaction[];
}

const nowIso = () => new Date().toISOString();

function uid(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

function seed(): DB {
  const userId = "u1";
  const categories: Category[] = [
    { id: uid("cat"), userId, name: "Gaji", type: "INCOME", createdAt: nowIso() },
    { id: uid("cat"), userId, name: "Investasi", type: "INCOME", createdAt: nowIso() },
    { id: uid("cat"), userId, name: "Makanan", type: "EXPENSE", createdAt: nowIso() },
    { id: uid("cat"), userId, name: "Transportasi", type: "EXPENSE", createdAt: nowIso() },
    { id: uid("cat"), userId, name: "Hiburan", type: "EXPENSE", createdAt: nowIso() },
  ];

  const tags: Tag[] = [
    { id: uid("tag"), userId, name: "bulanan", createdAt: nowIso() },
    { id: uid("tag"), userId, name: "harian", createdAt: nowIso() },
    { id: uid("tag"), userId, name: "promo", createdAt: nowIso() },
  ];

  const findCat = (name: string, type: TxType) => categories.find(c => c.name === name && c.type === type)!.id;
  const findTag = (name: string) => tags.find(t => t.name === name)!.id;

  const mkTx = (amount: number, type: TxType, date: string, catName?: string, notes?: string, tagNames: string[] = []): Transaction => ({
    id: uid("tx"),
    userId,
    amount,
    type,
    occurredAt: new Date(date).toISOString(),
    categoryId: catName ? findCat(catName, type) : undefined,
    notes,
    tagIds: tagNames.map(findTag),
    createdAt: nowIso(),
    updatedAt: nowIso(),
  });

  const transactions: Transaction[] = [
    mkTx(12000000, "INCOME", "2025-05-25", "Gaji", "Gaji Mei", ["bulanan"]),
    mkTx(200000, "EXPENSE", "2025-05-26", "Makanan", "Makan siang", ["harian"]),
    mkTx(50000, "EXPENSE", "2025-05-27", "Transportasi", "Ojek online", ["harian"]),
    mkTx(13000000, "INCOME", "2025-06-25", "Gaji", "Gaji Juni", ["bulanan"]),
    mkTx(300000, "EXPENSE", "2025-06-28", "Hiburan", "Nonton film", ["promo"]),
    mkTx(2500000, "INCOME", "2025-07-10", "Investasi", "Dividen", []),
    mkTx(150000, "EXPENSE", "2025-07-12", "Makanan", "Kopi & snack", []),
  ];

  return { categories, tags, transactions };
}

function read(): DB {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    const seeded = seed();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
    return seeded;
  }
  try {
    return JSON.parse(raw) as DB;
  } catch {
    const seeded = seed();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
    return seeded;
  }
}

function write(db: DB) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
}

export const db = {
  get: read,
  set: write,
};
