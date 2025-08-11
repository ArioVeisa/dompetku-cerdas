// services/api.ts
import type { Category, SummaryResponse, Tag, Transaction, TxType } from "@/types/finance";

const BASE = (path: string) => {
  // Di development, gunakan proxy Vite untuk menghindari CORS
  if (import.meta.env.DEV) {
    return path; // Proxy akan handle /api -> http://localhost:3000/api
  }
  // Di production, gunakan environment variable
  return `${(import.meta as any).env?.VITE_API_BASE ?? ""}${path}`;
};

// Helper untuk mendapatkan auth token
const getAuthToken = () => {
  const user = localStorage.getItem("authUser");
  if (user) {
    const userData = JSON.parse(user);
    return userData.sessionToken;
  }
  return null;
};

// Helper untuk menambahkan auth header
const getAuthHeaders = () => {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

async function http<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const res = await fetch(input, {
    credentials: "include",
    headers: { 
      "Content-Type": "application/json", 
      ...getAuthHeaders(),
      ...(init?.headers || {}) 
    },
    ...init,
  });
  if (!res.ok) {
    // coba baca error json kalau ada
    let message = `Request failed (${res.status})`;
    try {
      const e = await res.json();
      message = e?.message || message;
    } catch {}
    throw new Error(message);
  }
  // handle CSV dll di caller
  if ((res.headers.get("Content-Type") || "").includes("application/json")) {
    return res.json() as Promise<T>;
  }
  return res as unknown as T;
}

export const api = {
  // Auth endpoints
  async login(email: string, name: string): Promise<{ success: boolean; user: any; sessionToken: string }> {
    return http<{ success: boolean; user: any; sessionToken: string }>(BASE("/api/auth/login"), {
      method: "POST",
      body: JSON.stringify({ email, name }),
    });
  },

  async logout(): Promise<{ success: boolean; message: string }> {
    return http<{ success: boolean; message: string }>(BASE("/api/auth/logout"), {
      method: "POST",
    });
  },

  async listTransactions(params: { month?: string; type?: TxType }): Promise<Transaction[]> {
    const qs = new URLSearchParams();
    if (params?.month) qs.set("month", params.month);      // "YYYY-MM"
    if (params?.type) qs.set("type", params.type);         // "INCOME" | "EXPENSE"
    return http<Transaction[]>(BASE(`/api/transactions?${qs.toString()}`));
  },

  async createTransaction(
    input: Omit<Transaction, "id" | "createdAt" | "updatedAt" | "userId">
  ): Promise<Transaction> {
    return http<Transaction>(BASE("/api/transactions"), {
      method: "POST",
      body: JSON.stringify(input),
    });
  },

  async deleteTransaction(id: string): Promise<boolean> {
    const res = await fetch(BASE(`/api/transactions/${id}`), {
      method: "DELETE",
      credentials: "include",
      headers: getAuthHeaders(),
    });
    if (!res.ok) return false;
    // backend return boolean
    try {
      return (await res.json()) as boolean;
    } catch {
      return true;
    }
  },

  async getSummary(month?: string): Promise<SummaryResponse> {
    const qs = month ? `?month=${encodeURIComponent(month)}` : "";
    return http<SummaryResponse>(BASE(`/api/summary${qs}`));
  },

  async listCategories(): Promise<Category[]> {
    return http<Category[]>(BASE("/api/categories"));
  },

  async listTags(): Promise<Tag[]> {
    return http<Tag[]>(BASE("/api/tags"));
  },

  async exportCsv(): Promise<Blob> {
    const res = await fetch(BASE("/api/exports/csv"), {
      method: "GET",
      credentials: "include",
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error("Gagal export CSV");
    return res.blob();
  },
};
