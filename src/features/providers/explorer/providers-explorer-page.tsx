"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ProvidersTable } from "@/features/providers/explorer/providers-table";
import { ProviderMemorySheet } from "@/features/providers/explorer/provider-memory-sheet";
import { Filter } from "lucide-react";
import { useSearchProviders } from "@/hooks/use-providers";

const FLAG_OPTIONS = [
  { code: "ADDR_DRIFT", label: "Address drift" },
  { code: "NPI_CONFLICT", label: "NPI conflict" }
] as const;

export function ProvidersExplorerPage() {
  const [q, setQ] = React.useState("");
  const [page, setPage] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);
  const [sort, setSort] = React.useState("confidence_desc");
  const [flags, setFlags] = React.useState<string[]>([]);
  const [selectedProviderId, setSelectedProviderId] = React.useState<string | null>(null);

  const providersQuery = useSearchProviders({ query: q });

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="text-xl font-semibold tracking-tight">Providers Explorer</div>
          <div className="text-sm text-muted-foreground max-w-2xl">
            Search normalized provider records. Click a row to open the memory panel.
          </div>
        </div>
        <Badge variant="outline">GET /api/providers</Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Normalized providers</CardTitle>
          <CardDescription>Search, filter, sort, paginate.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="flex-1">
              <Input
                value={q}
                onChange={(e) => {
                  setPage(0);
                  setQ(e.target.value);
                }}
                placeholder="Search by name, NPI, specialty, address, source file…"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 rounded-lg border bg-card px-3 py-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                {FLAG_OPTIONS.map((opt) => {
                  const active = flags.includes(opt.code);
                  return (
                    <button
                      key={opt.code}
                      className={
                        "text-xs rounded-md px-2 py-1 border transition-colors " +
                        (active
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-background hover:bg-muted/50")
                      }
                      onClick={() => {
                        setPage(0);
                        setFlags((prev) =>
                          prev.includes(opt.code)
                            ? prev.filter((x) => x !== opt.code)
                            : [...prev, opt.code]
                        );
                      }}
                      type="button"
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>

              <select
                className="h-9 rounded-md border bg-background px-3 text-sm"
                value={pageSize}
                onChange={(e) => {
                  setPage(0);
                  setPageSize(Number(e.target.value));
                }}
              >
                {[10, 15, 25, 50].map((n) => (
                  <option key={n} value={n}>
                    {n}/page
                  </option>
                ))}
              </select>
            </div>
          </div>

          <ProvidersTable
            loading={providersQuery.isLoading}
            error={providersQuery.error ? "Failed to load providers." : null}
            data={providersQuery.data ?? []}
            total={providersQuery.data?.length ?? 0}
            page={page}
            pageSize={pageSize}
            onPageChange={setPage}
            onRowClick={(id) => setSelectedProviderId(id)}
          />
        </CardContent>
      </Card>

      <ProviderMemorySheet
        providerId={selectedProviderId}
        open={!!selectedProviderId}
        onOpenChange={(open) => {
          if (!open) setSelectedProviderId(null);
        }}
      />
    </div>
  );
}

