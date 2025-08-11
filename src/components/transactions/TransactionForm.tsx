import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Category, Tag, TxType } from "@/types/finance";

const schema = z.object({
  amount: z.number().positive("Nominal harus lebih dari 0"),
  type: z.enum(["INCOME", "EXPENSE"]),
  occurredAt: z.string(),
  categoryId: z.string().optional(),
  notes: z.string().optional(),
  tagIds: z.array(z.string()).optional(),
});

type FormValues = z.infer<typeof schema>;

export function TransactionForm({
  categories,
  tags,
  onSubmit,
  defaultType = "EXPENSE",
}: {
  categories: Category[];
  tags: Tag[];
  defaultType?: TxType;
  onSubmit: (values: FormValues) => Promise<void> | void;
}) {
  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { type: defaultType, occurredAt: new Date().toISOString().slice(0,10), tagIds: [] }
  });

  const handleType = (v: TxType) => setValue("type", v);
  const handleCategory = (v: string) => setValue("categoryId", v);

  return (
    <form onSubmit={handleSubmit(async (vals) => {
      await onSubmit({ ...vals, amount: Number(vals.amount) });
    })} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm mb-1">Jenis</label>
          <Select defaultValue={watch("type")} onValueChange={(v) => handleType(v as TxType)}>
            <SelectTrigger>
              <SelectValue placeholder="Pilih jenis" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="INCOME">Pemasukan</SelectItem>
              <SelectItem value="EXPENSE">Pengeluaran</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm mb-1">Tanggal</label>
          <Input type="date" {...register("occurredAt")} />
        </div>
      </div>
      <div>
        <label className="block text-sm mb-1">Nominal</label>
        <Input type="number" step="100" placeholder="0" {...register("amount", { valueAsNumber: true })} />
        {errors.amount && <p className="text-sm text-destructive mt-1">{errors.amount.message}</p>}
      </div>
      <div>
        <label className="block text-sm mb-1">Kategori</label>
        <Select onValueChange={handleCategory}>
          <SelectTrigger>
            <SelectValue placeholder="Pilih kategori (opsional)" />
          </SelectTrigger>
          <SelectContent>
            {categories.map(c => (
              <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="block text-sm mb-1">Tag</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {tags.map(t => (
            <label key={t.id} className="flex items-center gap-2 text-sm">
              <input type="checkbox" onChange={(e) => {
                const curr = new Set(watch("tagIds") ?? []);
                if (e.target.checked) curr.add(t.id); else curr.delete(t.id);
                setValue("tagIds", Array.from(curr));
              }} />
              {t.name}
            </label>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-sm mb-1">Catatan</label>
        <Textarea rows={3} placeholder="Opsional" {...register("notes")} />
      </div>
      <Button type="submit" disabled={isSubmitting}>Simpan</Button>
    </form>
  );
}
