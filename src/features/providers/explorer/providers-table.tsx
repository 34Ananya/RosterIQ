"use client";

import * as React from "react";
import type { Provider } from "@/types/provider";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

export function ProvidersTable({
  data,
  total,
  page,
  pageSize,
  onPageChange,
  onRowClick,
  loading,
  error
}: {
  data: Provider[];
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onRowClick: (providerId: string) => void;
  loading: boolean;
  error: string | null;
}) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const start = page * pageSize + 1;
  const end = Math.min(total, page * pageSize + data.length);

  return (
    <div className="space-y-3">
      <div className="rounded-xl border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Provider</TableHead>
              <TableHead>NPI</TableHead>
              <TableHead>Specialty</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Source</TableHead>
              <TableHead className="text-right">Confidence</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-sm text-muted-foreground">
                  Loading providers…
                </TableCell>
              </TableRow>
            )}
            {error && (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-sm text-destructive">
                  {error}
                </TableCell>
              </TableRow>
            )}
            {!loading && !error && data.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-sm text-muted-foreground">
                  No results.
                </TableCell>
              </TableRow>
            )}
            {!loading &&
              !error &&
              data.map((p) => (
                <TableRow
                  key={p.id}
                  className="cursor-pointer"
                  onClick={() => onRowClick(p.id)}
                >
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="font-medium">{p.name}</div>
                      {p.flags.length > 0 && (
                        <div className="flex items-center gap-1">
                          {p.flags.slice(0, 2).map((f) => (
                            <Badge
                              key={f.code}
                              variant={f.severity === "high" ? "destructive" : "secondary"}
                              className="hidden xl:inline-flex"
                            >
                              {f.label}
                            </Badge>
                          ))}
                          {p.flags.length > 2 && (
                            <Badge variant="outline" className="hidden xl:inline-flex">
                              +{p.flags.length - 2}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{p.npi}</TableCell>
                  <TableCell className="text-muted-foreground">{p.specialty}</TableCell>
                  <TableCell className="text-muted-foreground max-w-[360px] truncate">
                    {p.address}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{p.sourceFile}</TableCell>
                  <TableCell className="text-right">
                    <Confidence value={p.confidence} />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-xs text-muted-foreground">
          {total === 0 ? "0 results" : `${start}-${end} of ${total}`}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled={page <= 0} onClick={() => onPageChange(page - 1)}>
            Prev
          </Button>
          <div className="text-xs text-muted-foreground">
            Page {page + 1} / {pages}
          </div>
          <Button
            variant="outline"
            size="sm"
            disabled={page + 1 >= pages}
            onClick={() => onPageChange(page + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

function Confidence({ value }: { value: number }) {
  const pct = Math.round(value * 100);
  const tone =
    pct >= 90 ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300" : pct >= 75
      ? "bg-amber-500/15 text-amber-700 dark:text-amber-300"
      : "bg-rose-500/15 text-rose-700 dark:text-rose-300";

  return (
    <span className={cn("inline-flex items-center justify-end rounded-md px-2 py-1 text-xs font-medium", tone)}>
      {pct}%
    </span>
  );
}

