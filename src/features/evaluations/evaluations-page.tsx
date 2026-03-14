"use client";

import * as React from "react";
import { useMutation } from "@tanstack/react-query";
import { runEvaluation } from "@/api/evaluations";
import { MOCK_SCENARIOS } from "@/lib/mock/evaluations";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle2, XCircle, Play } from "lucide-react";
import type { EvaluationRunResponse } from "@/types/evaluations";

export function EvaluationsPage() {
  const [selectedScenarioId, setSelectedScenarioId] = React.useState(MOCK_SCENARIOS[0]!.id);
  const [lastResult, setLastResult] = React.useState<EvaluationRunResponse | null>(null);

  const mutation = useMutation({
    mutationFn: (scenarioId: string) => runEvaluation({ scenarioId }),
    onSuccess: (data) => setLastResult(data)
  });

  const selected = MOCK_SCENARIOS.find((s) => s.id === selectedScenarioId)!;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="text-xl font-semibold tracking-tight">Evaluation Harness</div>
          <div className="text-sm text-muted-foreground max-w-2xl">
            Run fixed scenarios to score agent behavior. This is designed for hackathon demos and
            regression checks.
          </div>
        </div>
        <Badge variant="outline">POST /api/evaluations/run</Badge>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1 border-white/5 bg-slate-950/70">
          <CardHeader>
            <CardTitle>Scenarios</CardTitle>
            <CardDescription>Select a test case.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {MOCK_SCENARIOS.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setSelectedScenarioId(s.id)}
                className={
                  "w-full rounded-xl border px-4 py-3 text-left transition-all duration-150 " +
                  (s.id === selectedScenarioId
                    ? "border-sky-500/60 bg-sky-500/10 shadow-md shadow-sky-500/40"
                    : "border-white/5 bg-slate-900/60 hover:bg-slate-900 hover:-translate-y-0.5")
                }
              >
                <div className="text-sm font-medium">{s.title}</div>
                <div className="text-sm text-muted-foreground mt-1">{s.description}</div>
              </button>
            ))}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-start justify-between gap-3">
              <div>
                <CardTitle>{selected.title}</CardTitle>
                <CardDescription className="mt-1">{selected.description}</CardDescription>
              </div>
              <Button
                onClick={() => mutation.mutate(selectedScenarioId)}
                disabled={mutation.isPending}
              >
                <Play className="h-4 w-4" />
                {mutation.isPending ? "Running…" : "Run"}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-xl border bg-muted/10 p-4">
              <div className="text-xs text-muted-foreground">Scenario prompt</div>
              <div className="text-sm mt-1 whitespace-pre-wrap">{selected.prompt}</div>
            </div>

            {!lastResult ? (
              <div className="rounded-xl border bg-muted/10 p-8 text-sm text-muted-foreground">
                Run a scenario to see results here.
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant={lastResult.passed ? "secondary" : "destructive"}>
                    {lastResult.passed ? (
                      <span className="inline-flex items-center gap-1">
                        <CheckCircle2 className="h-4 w-4" /> Pass
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1">
                        <XCircle className="h-4 w-4" /> Fail
                      </span>
                    )}
                  </Badge>
                  <Badge variant="outline">Score: {Math.round(lastResult.score * 100)}%</Badge>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <div className="rounded-xl border bg-card p-4">
                    <div className="text-xs text-muted-foreground">Expected</div>
                    <div className="text-sm mt-1">{lastResult.expected}</div>
                  </div>
                  <div className="rounded-xl border bg-card p-4">
                    <div className="text-xs text-muted-foreground">Actual</div>
                    <div className="text-sm mt-1">{lastResult.actual}</div>
                  </div>
                </div>

                {lastResult.notes.length > 0 && (
                  <div className="rounded-xl border bg-muted/10 p-4">
                    <div className="text-xs text-muted-foreground">Notes</div>
                    <div className="mt-2 rounded-xl border overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Observation</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {lastResult.notes.map((n, idx) => (
                            <TableRow key={idx}>
                              <TableCell className="text-sm text-muted-foreground">
                                {n}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

