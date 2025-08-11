import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const schema = z.object({
  name: z.string().min(2, "Nama terlalu pendek"),
  email: z.string().email("Email tidak valid"),
});

type FormValues = z.infer<typeof schema>;

export default function Login() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({ resolver: zodResolver(schema) });
  const navigate = useNavigate();
  const { toast } = useToast();

  const onSubmit = async (values: FormValues) => {
    localStorage.setItem("authUser", JSON.stringify({ id: "u1", ...values }));
    toast({ title: "Berhasil masuk", description: `Selamat datang, ${values.name}` });
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Masuk</CardTitle>
          <CardDescription>Masukkan data Anda untuk melanjutkan</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Nama</label>
              <Input placeholder="Nama lengkap" {...register("name")} />
              {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <label className="block text-sm mb-1">Email</label>
              <Input type="email" placeholder="nama@contoh.com" {...register("email")} />
              {errors.email && <p className="text-sm text-destructive mt-1">{errors.email.message}</p>}
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>Masuk</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
