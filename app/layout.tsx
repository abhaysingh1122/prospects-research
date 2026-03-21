import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/app/ThemeProvider";
import { NavBar } from "@/components/app/NavBar";

export const metadata: Metadata = {
  title: "Prospect AI — Outreach Intelligence",
  description: "End-to-end AI-powered company research and personalized outreach, fully automated.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full antialiased">
      <head>
        {/* Prevent flash of wrong theme */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('pr-theme')||'dark';document.documentElement.setAttribute('data-theme',t)}catch(e){}})()`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <NavBar />
          <main className="flex-1">
            {children}
          </main>
          <Toaster
            theme="system"
            toastOptions={{
              style: {
                background: "var(--panel)",
                border: "1px solid var(--glass-border)",
                color: "var(--ink)",
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.75rem",
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
