"use client";

import Link from "next/link";
import { Sheet } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUpRight, Clock, GitCompare, Sparkles } from "lucide-react";
import { useProviderMemory } from "@/hooks/use-providers";

export function ProviderMemorySheet({
  providerId,
  open,
  onOpenChange
}: {
  providerId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const memory = useProviderMemory(providerId);

  return (
    <Sheet
      open={open}
      onOpenChange={onOpenChange}
      title={memory.data ? memory.data.provider.name : "Provider memory"}
      description={memory.data ? `${memory.data.provider.npi} • ${memory.data.provider.specialty}` : "Loading…"}
    >
      <div className="p-5 space-y-4">
        {!memory.data && (
          <div className="rounded-xl border bg-muted/20 p-6 text-sm text-muted-foreground">
            Loading memory…
          </div>
        )}

        {memory.data && (
          <>
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
              <div className="ml-auto">
                <Button variant="outline" asChild>
                  <Link href={`/providers/${memory.data.provider.id}`}>
                    Open full view <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>

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
                <div className="space-y-3">
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
                        <div className="mt-3 grid gap-2">
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
                <Card>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Field</TableHead>
                          <TableHead>From</TableHead>
                          <TableHead>To</TableHead>
                          <TableHead>When</TableHead>
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
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="summary">
                <div className="rounded-xl border bg-muted/20 p-4 text-sm leading-relaxed">
                  {memory.data.aiSummary}
                </div>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </Sheet>
  );
}

