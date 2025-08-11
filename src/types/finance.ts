export type TxType = 'INCOME' | 'EXPENSE';

export interface User { id: string; name: string; email: string; }

export interface Category {
  id: string;
  userId: string;
  name: string;
  type: TxType; // INCOME or EXPENSE
  createdAt: string;
}

export interface Tag {
  id: string;
  userId: string;
  name: string;
  createdAt: string;
}

export interface Transaction {
  id: string;
  userId: string;
  amount: number;        // positive value; type determines sign in UI only
  type: TxType;
  occurredAt: string;    // ISO date
  categoryId?: string;
  notes?: string;
  tagIds: string[];      // many-to-many
  createdAt: string;
  updatedAt: string;
}

export interface SummaryResponse {
  income: number;
  expense: number;
  net: number;
  byCategory: Array<{ categoryId: string; categoryName: string; total: number }>;
  byMonth: Array<{ month: string; income: number; expense: number; net: number }>;
  byDay: Array<{ day: string; income: number; expense: number; net: number }>;
}
