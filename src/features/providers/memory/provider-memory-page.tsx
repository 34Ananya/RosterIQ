"use client";

import { useProviderMemory } from "@/hooks/use-providers";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Clock, GitCompare, Sparkles } from "lucide-react";

export function ProviderMemoryPage({ providerId }: { providerId: string }) {
  const memory = useProviderMemory(providerId);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="text-xl font-semibold tracking-tight">Provider Memory</div>
        <div className="text-sm text-muted-foreground max-w-2xl">
          Historical entries, diffs, and intelligence signals for one provider.
        </div>
      </div>

      {!memory.data && (
        <Card>
          <CardHeader>
            <CardTitle>Loading…</CardTitle>
            <CardDescription>Fetching provider memory</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">Please wait.</CardContent>
        </Card>
      )}

      {memory.data && (
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <CardTitle>{memory.data.provider.name}</CardTitle>
                <CardDescription>
                  {memory.data.provider.npi} • {memory.data.provider.specialty} •{" "}
                  {memory.data.provider.address}
                </CardDescription>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline">Source: {memory.data.provider.sourceFile}</Badge>
                <Badge variant="secondary">
                  Confidence: {Math.round(memory.data.provider.confidence * 100)}%
                </Badge>
                {memory.data.provider.flags.map((f) => (
                  <Badge key={f.code} variant={f.severity === "high" ? "destructive" : "secondary"}>
                    {f.label}
                  </Badge>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="timeline">
              <TabsList>
                <TabsTrigger value="timeline">
                  <Clock className="h-4 w-4" /> Timeline
                </TabsTrigger>
                <TabsTrigger value="diffs">
                  <GitCompare className="h-4 w-4" /> Diffs
                </TabsTrigger>
                <TabsTrigger value="summary">
                  <Sparkles className="h-4 w-4" /> Summary
                </TabsTrigger>
              </TabsList>

              <TabsContent value="timeline">
                <div className="grid gap-3">
                  {memory.data.timeline.map((evt) => (
                    <div key={evt.id} className="rounded-xl border bg-card p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-sm font-medium">{evt.summary}</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {new Date(evt.at).toLocaleString()} • {evt.sourceFile}
                          </div>
                        </div>
                        <Badge variant="outline">{evt.kind}</Badge>
                      </div>
                      {evt.changes.length > 0 && (
                        <div className="mt-3 grid gap-2 sm:grid-cols-2">
                          {evt.changes.map((c, idx) => (
                            <div key={idx} className="rounded-lg border bg-muted/20 p-3">
                              <div className="text-xs text-muted-foreground">{c.field}</div>
                              <div className="mt-1 text-sm">
                                <span className="text-muted-foreground">{c.from ?? "—"}</span>{" "}
                                → <span className="font-medium">{c.to ?? "—"}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="diffs">
                <div className="rounded-xl border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Field</TableHead>
                        <TableHead>From</TableHead>
                        <TableHead>To</TableHead>
                        <TableHead>When</TableHead>
                        <TableHead>Source</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {memory.data.timeline.flatMap((evt) =>
                        evt.changes.map((c, idx) => (
                          <TableRow key={`${evt.id}_${idx}`}>
                            <TableCell className="font-medium">{c.field}</TableCell>
                            <TableCell className="text-muted-foreground">{c.from ?? "—"}</TableCell>
                            <TableCell>{c.to ?? "—"}</TableCell>
                            <TableCell className="text-muted-foreground">
                              {new Date(evt.at).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="text-muted-foreground">{evt.sourceFile}</TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="summary">
                <div className="rounded-xl border bg-muted/20 p-4 text-sm leading-relaxed">
                  {memory.data.aiSummary}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

