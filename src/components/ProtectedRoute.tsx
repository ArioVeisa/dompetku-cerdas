import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  useEffect(() => {
    const raw = localStorage.getItem("authUser");
    if (!raw) navigate("/login", { replace: true });
  }, [navigate]);
  return <>{children}</>;
}
