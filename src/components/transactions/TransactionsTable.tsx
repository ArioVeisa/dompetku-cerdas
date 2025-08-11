import { Transaction, Category, Tag } from "@/types/finance";
import { formatCurrency } from "@/utils/format";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export function TransactionsTable({
  transactions,
  categories,
  tags,
}: {
  transactions: Transaction[];
  categories: Category[];
  tags: Tag[];
}) {
  const catMap = new Map(categories.map(c => [c.id, c.name] as const));
  const tagMap = new Map(tags.map(t => [t.id, t.name] as const));

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tanggal</TableHead>
            <TableHead>Jenis</TableHead>
            <TableHead>Kategori</TableHead>
            <TableHead>Nominal</TableHead>
            <TableHead>Tag</TableHead>
            <TableHead>Catatan</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((t) => (
            <TableRow key={t.id}>
              <TableCell>{new Date(t.occurredAt).toLocaleDateString('id-ID')}</TableCell>
              <TableCell>{t.type === 'INCOME' ? 'Pemasukan' : 'Pengeluaran'}</TableCell>
              <TableCell>{t.categoryId ? (catMap.get(t.categoryId) ?? '-') : '-'}</TableCell>
              <TableCell className={t.type === 'EXPENSE' ? 'text-destructive' : ''}>{formatCurrency(t.amount)}</TableCell>
              <TableCell>
                <div className="flex gap-1 flex-wrap">
                  {t.tagIds.map(id => (
                    <Badge key={id} variant="secondary">{tagMap.get(id)}</Badge>
                  ))}
                </div>
              </TableCell>
              <TableCell className="max-w-xs truncate" title={t.notes}>{t.notes}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
