import { ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip } from "recharts";
import { SummaryResponse } from "@/types/finance";
import { formatNumber } from "@/utils/format";

const COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--accent))",
  "hsl(var(--secondary))",
  "hsl(var(--muted))",
  "hsl(var(--ring))",
  "hsl(var(--border))",
];

export function CategoryBreakdown({ summary }: { summary: SummaryResponse }) {
  const data = summary.byCategory.map((c, i) => ({ name: c.categoryName, value: c.total, fill: COLORS[i % COLORS.length] }));
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" outerRadius={90} innerRadius={40} />
          <Legend />
          <Tooltip formatter={(v: number) => formatNumber(v)} />
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
