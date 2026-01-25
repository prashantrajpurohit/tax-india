import { ThemeProvider } from "@/components/providers/theme-provider";
import { ActiveThemeProvider } from "@/components/active-theme";
import { cn } from "@/config/utils/utils";
import ClientLayoutSwitcher from "@/components/client-layout-switcher";
import Providers from "./providers";
import { ErrorBoundary } from "@/components/error-boundary";
import { useEffect } from "react";


const META_THEME_COLORS = {
  light: "#fffff",
  dark: "#09090b",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    try {
      const themeColorMeta = document.querySelector(
        'meta[name="theme-color"]',
      );
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      const theme =
        localStorage.theme === "dark" ||
        ((!("theme" in localStorage) || localStorage.theme === "system") &&
          prefersDark)
          ? "dark"
          : "light";
      if (themeColorMeta) {
        themeColorMeta.setAttribute(
          "content",
          theme === "dark" ? META_THEME_COLORS.dark : META_THEME_COLORS.light,
        );
      }
      if (localStorage.layout) {
        document.documentElement.classList.add(
          `layout-${localStorage.layout}`,
        );
      }
      document.body.className = cn(
        "text-foreground group/body overscroll-none font-sans antialiased [--footer-height:calc(var(--spacing)*14)] [--header-height:calc(var(--spacing)*14)] xl:[--footer-height:calc(var(--spacing)*24)]",
      );
    } catch (error) {
      void error;
    }
  }, []);

  return (
    <ErrorBoundary>
      <Providers>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <ActiveThemeProvider>
            <ClientLayoutSwitcher>{children}</ClientLayoutSwitcher>
          </ActiveThemeProvider>
        </ThemeProvider>
      </Providers>
    </ErrorBoundary>
  );
}

// import { Geist, Geist_Mono } from "next/font/google";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });
