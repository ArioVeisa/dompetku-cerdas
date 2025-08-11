import { mockCategories, mockTags, mockTransactions } from "./mocks/transactions";
import { Category, SummaryResponse, Tag, Transaction, TxType } from "@/types/finance";

const delay = (ms = 400) => new Promise((res) => setTimeout(res, ms));

const USER_ID = "u1"; // mock user for now

export const api = {
  async listTransactions(params: { month?: string; type?: TxType }): Promise<Transaction[]> {
    await delay();
    return mockTransactions.list({ userId: USER_ID, ...params });
  },
  async createTransaction(input: Omit<Transaction, "id" | "createdAt" | "updatedAt" | "userId">): Promise<Transaction> {
    await delay();
    return mockTransactions.create(USER_ID, input);
  },
  async deleteTransaction(id: string): Promise<boolean> {
    await delay();
    return mockTransactions.delete(USER_ID, id);
  },
  async getSummary(month?: string): Promise<SummaryResponse> {
    await delay();
    return mockTransactions.summary(USER_ID, month);
  },
  async listCategories(): Promise<Category[]> {
    await delay();
    return mockCategories.list(USER_ID);
  },
  async listTags(): Promise<Tag[]> {
    await delay();
    return mockTags.list(USER_ID);
  },
  async exportCsv(): Promise<Blob> {
    await delay();
    const csv = mockTransactions.exportCsv(USER_ID);
    return new Blob([csv], { type: "text/csv;charset=utf-8;" });
  }
};
