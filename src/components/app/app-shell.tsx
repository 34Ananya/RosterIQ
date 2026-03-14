"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";
import { NAV_ITEMS } from "@/components/app/nav-items";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Command, Search } from "lucide-react";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <div className="min-h-dvh bg-gradient-to-br from-slate-950 via-slate-950 to-slate-900 text-foreground">
      <div className="mx-auto flex min-h-dvh w-full">
        <aside
          className={cn(
            "sticky top-0 h-dvh border-r border-white/5 bg-slate-950/70 backdrop-blur-xl supports-[backdrop-filter]:bg-slate-950/60",
            collapsed ? "w-[72px]" : "w-[264px]"
          )}
        >
          <div className="flex h-14 items-center gap-2 px-4 border-b border-white/5">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-indigo-500 via-sky-500 to-emerald-400 text-primary-foreground grid place-items-center text-xs font-semibold shadow-lg shadow-sky-500/40">
              RQ
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <div className="text-sm font-semibold leading-none">RosterIQ</div>
                <div className="text-xs text-muted-foreground mt-1 leading-none">
                  Provider roster intelligence
                </div>
              </div>
            )}
          </div>

          <nav className="px-2 py-3">
            {NAV_ITEMS.map((item) => {
              const active =
                pathname === item.href || pathname?.startsWith(item.href + "/");
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-150",
                    active
                      ? "bg-slate-800 text-foreground shadow-sm shadow-sky-500/30"
                      : "text-muted-foreground hover:bg-slate-800/70 hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0 text-slate-300 group-hover:text-sky-300" />
                  {!collapsed && (
                    <div className="min-w-0">
                      <div className="truncate font-medium tracking-tight">
                        {item.title}
                      </div>
                      {item.description && (
                        <div className="truncate text-xs text-muted-foreground">
                          {item.description}
                        </div>
                      )}
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="absolute bottom-0 left-0 right-0 border-t border-white/5 p-3">
            <Button
              variant="outline"
              className={cn("w-full justify-start", collapsed && "justify-center")}
              onClick={() => setCollapsed((v) => !v)}
            >
              <Command className="h-4 w-4" />
              {!collapsed && <span className="ml-2">Collapse</span>}
            </Button>
          </div>
        </aside>

        <main className="flex-1">
          <header className="sticky top-0 z-10 h-14 border-b border-white/5 bg-slate-950/70 backdrop-blur-xl supports-[backdrop-filter]:bg-slate-950/60">
            <div className="flex h-14 items-center gap-3 px-6">
              <div className="relative max-w-xl w-full">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search providers, rosters, anomalies…"
                  className="pl-9"
                />
              </div>
              <div className="ml-auto flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="hidden md:inline-flex border-sky-500/50 bg-sky-500/10 hover:bg-sky-500/20"
                >
                  <Search className="h-3 w-3" />
                  Command Palette
                </Button>
                <div className="hidden sm:block text-xs text-muted-foreground">
                  Workspace: Demo Ops
                </div>
                <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-500 grid place-items-center text-[10px] font-semibold text-white shadow-md shadow-sky-500/40">
                  SO
                </div>
              </div>
            </div>
          </header>
          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}

