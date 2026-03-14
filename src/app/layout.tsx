import type { Metadata } from "next";
import "./globals.css";
import { AppProviders } from "@/components/app/app-providers";
import { AppShell } from "@/components/app/app-shell";

export const metadata: Metadata = {
  title: "RosterIQ",
  description: "Provider roster intelligence — upload, normalize, remember, and explore."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body className="bg-background text-foreground">
        <AppProviders>
          <AppShell>{children}</AppShell>
        </AppProviders>
      </body>
    </html>
  );
}

