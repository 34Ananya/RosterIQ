"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Upload, Users, BrainCircuit, FlaskConical } from "lucide-react";

export function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div className="text-xl font-semibold tracking-tight bg-gradient-to-r from-sky-400 via-cyan-300 to-emerald-300 bg-clip-text text-transparent">
            Dashboard
          </div>
          <Badge variant="outline">Demo-ready</Badge>
        </div>
        <div className="text-sm text-muted-foreground max-w-2xl">
          Upload rosters, inspect normalized providers, and review memory-driven changes over time.
          This frontend uses mock APIs so the UI works immediately.
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Link href="/rosters/upload" className="group">
          <Card className="relative overflow-hidden border-white/5 bg-slate-900/70 transition-all duration-150 group-hover:-translate-y-0.5 group-hover:border-sky-500/60 group-hover:shadow-lg group-hover:shadow-sky-500/30">
            <div className="pointer-events-none absolute inset-x-6 -top-16 h-32 bg-gradient-to-b from-sky-500/40 via-sky-500/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardHeader>
            <CardTitle>Latest Upload</CardTitle>
            <CardDescription>March roster processed</CardDescription>
          </CardHeader>
          <CardContent className="flex items-end justify-between">
            <div>
              <div className="text-2xl font-semibold">24</div>
              <div className="text-sm text-muted-foreground">providers parsed</div>
            </div>
            <Upload className="h-5 w-5 text-muted-foreground" />
          </CardContent>
          </Card>
        </Link>

        <Link href="/providers" className="group">
          <Card className="relative overflow-hidden border-white/5 bg-slate-900/70 transition-all duration-150 group-hover:-translate-y-0.5 group-hover:border-emerald-500/60 group-hover:shadow-lg group-hover:shadow-emerald-500/30">
            <div className="pointer-events-none absolute inset-x-6 -top-16 h-32 bg-gradient-to-b from-emerald-500/40 via-emerald-500/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardHeader>
            <CardTitle>Normalized Providers</CardTitle>
            <CardDescription>Searchable index</CardDescription>
          </CardHeader>
          <CardContent className="flex items-end justify-between">
            <div>
              <div className="text-2xl font-semibold">48</div>
              <div className="text-sm text-muted-foreground">in explorer</div>
            </div>
            <Users className="h-5 w-5 text-muted-foreground" />
          </CardContent>
          </Card>
        </Link>

        <Link href="/providers" className="group">
          <Card className="relative overflow-hidden border-white/5 bg-slate-900/70 transition-all duration-150 group-hover:-translate-y-0.5 group-hover:border-amber-500/60 group-hover:shadow-lg group-hover:shadow-amber-500/30">
            <div className="pointer-events-none absolute inset-x-6 -top-16 h-32 bg-gradient-to-b from-amber-500/40 via-amber-500/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardHeader>
            <CardTitle>Memory Signals</CardTitle>
            <CardDescription>Changes + anomalies</CardDescription>
          </CardHeader>
          <CardContent className="flex items-end justify-between">
            <div>
              <div className="text-2xl font-semibold">7</div>
              <div className="text-sm text-muted-foreground">flagged items</div>
            </div>
            <BrainCircuit className="h-5 w-5 text-muted-foreground" />
          </CardContent>
          </Card>
        </Link>

        <Link href="/evaluations" className="group">
          <Card className="relative overflow-hidden border-white/5 bg-slate-900/70 transition-all duration-150 group-hover:-translate-y-0.5 group-hover:border-purple-500/60 group-hover:shadow-lg group-hover:shadow-purple-500/30">
            <div className="pointer-events-none absolute inset-x-6 -top-16 h-32 bg-gradient-to-b from-purple-500/40 via-purple-500/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardHeader>
            <CardTitle>Evaluations</CardTitle>
            <CardDescription>Hackathon harness</CardDescription>
          </CardHeader>
          <CardContent className="flex items-end justify-between">
            <div>
              <div className="text-2xl font-semibold">3</div>
              <div className="text-sm text-muted-foreground">scenarios</div>
            </div>
            <FlaskConical className="h-5 w-5 text-muted-foreground" />
          </CardContent>
          </Card>
        </Link>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Start here</CardTitle>
            <CardDescription>Core flows for ops teams</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            <QuickLink
              href="/rosters/upload"
              title="Upload a roster"
              description="Preview rows, validate fields, and ingest."
            />
            <QuickLink
              href="/providers"
              title="Explore providers"
              description="Search, filter, and open provider memory."
            />
            <QuickLink
              href="/agent"
              title="Ask the agent"
              description="Get structured answers with tables/charts."
            />
            <QuickLink
              href="/evaluations"
              title="Run evaluations"
              description="Execute scenarios and score outcomes."
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Design principles</CardTitle>
            <CardDescription>AI-native + ops-friendly</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <div>
              <span className="text-foreground font-medium">Memory-first</span>{" "}
              views show what changed and why it matters.
            </div>
            <div>
              <span className="text-foreground font-medium">Structured outputs</span>{" "}
              are first-class UI blocks.
            </div>
            <div>
              <span className="text-foreground font-medium">Modular architecture</span>{" "}
              keeps UI and API wiring clean.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function QuickLink({
  href,
  title,
  description
}: {
  href: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-xl border border-white/5 bg-slate-900/60 px-4 py-3 hover:border-sky-500/60 hover:bg-slate-900/80 transition-all duration-150 hover:-translate-y-0.5"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="font-medium text-sm text-foreground">{title}</div>
          <div className="text-sm text-muted-foreground mt-1">{description}</div>
        </div>
        <ArrowRight className="h-4 w-4 mt-0.5 text-muted-foreground group-hover:text-foreground transition-colors" />
      </div>
      <div className="mt-3">
        <Button variant="ghost" size="sm" className="px-0">
          Open
        </Button>
      </div>
    </Link>
  );
}

