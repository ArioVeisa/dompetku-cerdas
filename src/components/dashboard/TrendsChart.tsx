import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { SummaryResponse } from "@/types/finance";
import { formatNumber } from "@/utils/format";

export function TrendsChart({ summary }: { summary: SummaryResponse }) {
  // Gunakan data per hari untuk grafik yang lebih fluktuatif
  const chartData = summary.byDay || summary.byMonth;
  
  // Format data untuk menampilkan tanggal dengan lebih baik
  const formattedData = chartData.map(item => {
    const date = new Date(item.day + 'T00:00:00');
    return {
      ...item,
      day: date.toLocaleDateString('id-ID', { 
        day: '2-digit',
        month: 'short'
      }),
      fullDate: date.toLocaleDateString('id-ID', { 
        day: '2-digit',
        month: 'short',
        year: '2-digit'
      })
    };
  });

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={formattedData} margin={{ left: 8, right: 8 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="day" 
            tick={{ fontSize: 11 }} 
            interval="preserveStartEnd" // Tampilkan label di awal dan akhir
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis 
            tickFormatter={(v) => formatNumber(v)} 
            width={80}
            domain={[0, 'dataMax + 500000']} // Mulai dari 0, maksimal + 500k
          />
          <Tooltip 
            formatter={(v: number) => [formatNumber(v), '']}
            labelFormatter={(label, payload) => {
              if (payload && payload[0]) {
                const data = payload[0].payload;
                return `Tanggal: ${data.fullDate}`;
              }
              return `Tanggal: ${label}`;
            }}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="income" 
            name="Pemasukan" 
            stroke="hsl(var(--primary))" 
            strokeWidth={2} 
            dot={{ r: 3, fill: "hsl(var(--primary))" }}
            activeDot={{ r: 5 }}
          />
          <Line 
            type="monotone" 
            dataKey="expense" 
            name="Pengeluaran" 
            stroke="hsl(var(--destructive))" 
            strokeWidth={2} 
            dot={{ r: 3, fill: "hsl(var(--destructive))" }}
            activeDot={{ r: 5 }}
          />
          <Line 
            type="monotone" 
            dataKey="net" 
            name="Bersih" 
            stroke="hsl(var(--accent-foreground))" 
            strokeWidth={2} 
            dot={{ r: 2, fill: "hsl(var(--accent-foreground))" }}
            activeDot={{ r: 4 }}
            strokeDasharray="3 3" // Garis putus-putus untuk net
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
