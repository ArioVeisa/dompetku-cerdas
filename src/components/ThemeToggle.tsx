import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const toggle = () => setTheme(theme === "dark" ? "light" : "dark");
  return (
    <Button variant="outline" onClick={toggle} aria-label="Toggle tema" className="hover-scale">
      {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      <span className="ml-2 hidden sm:inline">Tema</span>
    </Button>
  );
}
