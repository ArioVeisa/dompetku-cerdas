import { ThemeProvider as NextThemeProvider } from "next-themes";
import { PropsWithChildren } from "react";

export function ThemeProvider({ children }: PropsWithChildren) {
  return (
    <NextThemeProvider attribute="class" defaultTheme="light" enableSystem storageKey="pf_theme">
      {children}
    </NextThemeProvider>
  );
}
