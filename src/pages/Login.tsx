import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/services/api";

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
    try {
      const response = await api.login(values.email, values.name);
      
      if (response.success) {
        // Simpan data user dan session token
        localStorage.setItem("authUser", JSON.stringify({
          id: response.user.id,
          email: response.user.email,
          name: response.user.name,
          sessionToken: response.sessionToken,
        }));
        
        toast({ 
          title: "Berhasil masuk", 
          description: `Selamat datang, ${response.user.name}` 
        });
        navigate("/", { replace: true });
      } else {
        toast({ 
          title: "Gagal masuk", 
          description: "Terjadi kesalahan saat login",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({ 
        title: "Gagal masuk", 
        description: "Terjadi kesalahan saat login",
        variant: "destructive"
      });
    }
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
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Memproses..." : "Masuk"}
            </Button>
          </form>
          
          <div className="mt-6 p-4 bg-muted rounded-lg">
            <h4 className="font-medium mb-2">Akun Demo:</h4>
            <div className="space-y-1 text-sm">
              <p><strong>Demo User:</strong> demo@example.com</p>
              <p><strong>John Doe:</strong> john@example.com</p>
              <p><strong>Jane Smith:</strong> jane@example.com</p>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Masukkan nama apapun untuk login dengan akun tersebut
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
