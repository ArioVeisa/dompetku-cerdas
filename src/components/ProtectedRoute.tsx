import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  
  useEffect(() => {
    const raw = localStorage.getItem("authUser");
    if (!raw) {
      navigate("/login", { replace: true });
      return;
    }

    try {
      const userData = JSON.parse(raw);
      // Cek apakah ada session token
      if (!userData.sessionToken) {
        localStorage.removeItem("authUser");
        navigate("/login", { replace: true });
        return;
      }

      // Cek apakah token masih valid (untuk demo, kita skip validasi server)
      // Nanti bisa ditambahkan validasi token dengan server
      
    } catch (error) {
      console.error("Error parsing user data:", error);
      localStorage.removeItem("authUser");
      navigate("/login", { replace: true });
    }
  }, [navigate]);
  
  return <>{children}</>;
}
