import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { SummaryResponse } from "@/types/finance";
import { formatNumber } from "@/utils/format";

export function TrendsChart({ summary }: { summary: SummaryResponse }) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={summary.byMonth} margin={{ left: 8, right: 8 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" tick={{ fontSize: 12 }} />
          <YAxis tickFormatter={(v) => formatNumber(v)} width={80} />
          <Tooltip formatter={(v: number) => formatNumber(v)} />
          <Legend />
          <Line type="monotone" dataKey="income" name="Pemasukan" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="expense" name="Pengeluaran" stroke="hsl(var(--destructive))" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="net" name="Bersih" stroke="hsl(var(--accent-foreground))" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
