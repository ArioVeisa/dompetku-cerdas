import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";
import { SummaryCards } from "@/components/dashboard/SummaryCards";
import { TrendsChart } from "@/components/dashboard/TrendsChart";
import { CategoryBreakdown } from "@/components/dashboard/CategoryBreakdown";
import { TransactionsTable } from "@/components/transactions/TransactionsTable";
import { TransactionForm } from "@/components/transactions/TransactionForm";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Download, PlusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { TxType } from "@/types/finance";

const useMonths = (allMonths: string[]) => {
  const sorted = useMemo(() => [...allMonths].sort(), [allMonths]);
  const latest = sorted[sorted.length - 1];
  return { list: sorted, latest };
};

const Index = () => {
  const qc = useQueryClient();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [typeFilter, setTypeFilter] = useState<TxType | undefined>(undefined);

  const { data: categories = [] } = useQuery({ queryKey: ["categories"], queryFn: api.listCategories });
  const { data: tags = [] } = useQuery({ queryKey: ["tags"], queryFn: api.listTags });
  const { data: summaryAll } = useQuery({ queryKey: ["summary"], queryFn: () => api.getSummary() });

  const monthsHook = useMonths(summaryAll?.byMonth.map(m => m.month) ?? []);
  const [month, setMonth] = useState<string | undefined>(monthsHook.latest);

  useEffect(() => { if (monthsHook.latest) setMonth(monthsHook.latest); }, [monthsHook.latest]);

  const { data: monthlySummary } = useQuery({ queryKey: ["summary", month], queryFn: () => api.getSummary(month), enabled: !!month });

  const { data: transactions = [], isLoading } = useQuery({ queryKey: ["transactions", month, typeFilter], queryFn: () => api.listTransactions({ month, type: typeFilter }) });

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b">
        <div className="container mx-auto py-3 flex items-center justify-between">
          <h1 className="text-xl sm:text-2xl font-bold">Dasbor Keuangan Pribadi</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={async () => {
              const blob = await api.exportCsv();
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url; a.download = `transaksi.csv`; a.click(); URL.revokeObjectURL(url);
            }}>
              <Download className="h-4 w-4" />
              <span className="ml-2 hidden sm:inline">Ekspor CSV</span>
            </Button>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className="h-4 w-4" />
                  <span className="ml-2 hidden sm:inline">Tambah Transaksi</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Catat Transaksi</DialogTitle>
                </DialogHeader>
                <TransactionForm
                  categories={categories}
                  tags={tags}
                  onSubmit={async (vals) => {
                    await api.createTransaction({
                      amount: vals.amount,
                      type: vals.type,
                      occurredAt: new Date(vals.occurredAt).toISOString(),
                      categoryId: vals.categoryId,
                      notes: vals.notes,
                      tagIds: vals.tagIds ?? [],
                    });
                    toast({ title: "Tersimpan", description: "Transaksi berhasil ditambahkan" });
                    qc.invalidateQueries({ queryKey: ["transactions"]});
                    qc.invalidateQueries({ queryKey: ["summary"]});
                    setOpen(false);
                  }}
                />
              </DialogContent>
            </Dialog>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 space-y-6">
        <section className="space-y-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">Ringkasan</h2>
            <div className="flex items-center gap-2">
              <Select value={month} onValueChange={(v) => setMonth(v)}>
                <SelectTrigger className="min-w-[160px]">
                  <SelectValue placeholder="Bulan" />
                </SelectTrigger>
                <SelectContent>
                  {(monthsHook.list || []).map(m => (
                    <SelectItem key={m} value={m}>{m}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={typeFilter ?? 'ALL'} onValueChange={(v) => setTypeFilter(v === 'ALL' ? undefined : (v as TxType))}>
                <SelectTrigger className="min-w-[160px]">
                  <SelectValue placeholder="Semua jenis" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Semua jenis</SelectItem>
                  <SelectItem value="INCOME">Pemasukan</SelectItem>
                  <SelectItem value="EXPENSE">Pengeluaran</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {(monthlySummary ?? summaryAll) && <SummaryCards summary={(monthlySummary ?? summaryAll)!} />}
        </section>

        {(summaryAll) && (
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Tren Bulanan</CardTitle>
              </CardHeader>
              <CardContent>
                <TrendsChart summary={summaryAll} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Per Kategori</CardTitle>
              </CardHeader>
              <CardContent>
                <CategoryBreakdown summary={(monthlySummary ?? summaryAll)!} />
              </CardContent>
            </Card>
          </section>
        )}

        <section>
          <Card>
            <CardHeader>
              <CardTitle>Transaksi</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p className="text-sm text-muted-foreground">Memuat...</p>
              ) : (
                <TransactionsTable transactions={transactions} categories={categories} tags={tags} />
              )}
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
};

export default Index;
