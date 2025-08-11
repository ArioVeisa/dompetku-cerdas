import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/utils/format";
import { SummaryResponse } from "@/types/finance";
import { ArrowDownCircle, ArrowUpCircle, Wallet } from "lucide-react";

export function SummaryCards({ summary }: { summary: SummaryResponse }) {
  const items = [
    { label: "Pemasukan", value: summary.income, icon: ArrowDownCircle },
    { label: "Pengeluaran", value: summary.expense, icon: ArrowUpCircle },
    { label: "Bersih", value: summary.net, icon: Wallet },
  ];
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((it) => (
        <Card key={it.label} className="hover-scale">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{it.label}</CardTitle>
            <it.icon className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(it.value)}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
