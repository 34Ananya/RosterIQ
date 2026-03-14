"use client";

import * as React from "react";
import { searchProviders, getProviderMemory, type Provider, type ProviderMemory } from "@/api/providers";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function ProvidersPage() {
  const [query, setQuery] = React.useState("");
  const [providers, setProviders] = React.useState<Provider[]>([]);
  const [selectedProvider, setSelectedProvider] = React.useState<Provider | null>(null);
  const [memory, setMemory] = React.useState<ProviderMemory | null>(null);
  const [searchLoading, setSearchLoading] = React.useState(false);
  const [memoryLoading, setMemoryLoading] = React.useState(false);

  const handleSearch = async () => {
    setSearchLoading(true);
    try {
      const results = await searchProviders(query);
      setProviders(results);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleProviderClick = async (provider: Provider) => {
    setSelectedProvider(provider);
    setMemoryLoading(true);
    try {
      const mem = await getProviderMemory(provider.id);
      setMemory(mem);
    } catch (error) {
      console.error("Memory fetch failed:", error);
    } finally {
      setMemoryLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-[2fr,3fr] gap-4">
      {/* Left Panel */}
      <div className="space-y-4">
        <div className="flex gap-2">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search providers..."
          />
          <Button onClick={handleSearch} disabled={searchLoading}>
            {searchLoading ? "Searching..." : "Search"}
          </Button>
        </div>
        <div className="border border-slate-800 rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>NPI</TableHead>
                <TableHead>Specialty</TableHead>
                <TableHead>Last roster</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {providers.map((provider) => (
                <TableRow
                  key={provider.id}
                  onClick={() => handleProviderClick(provider)}
                  className="cursor-pointer hover:bg-slate-800"
                >
                  <TableCell>{provider.name}</TableCell>
                  <TableCell>{provider.npi}</TableCell>
                  <TableCell>{provider.specialty}</TableCell>
                  <TableCell>{provider.sourceFile}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Right Panel */}
      <div className="space-y-4">
        {selectedProvider && (
          <div className="border border-slate-800 rounded-md p-4">
            <h3 className="text-lg font-semibold">{selectedProvider.name}</h3>
            <p>NPI: {selectedProvider.npi}</p>
            <p>Specialty: {selectedProvider.specialty}</p>
          </div>
        )}
        {memoryLoading && <p>Loading memory...</p>}
        {memory && (
          <div className="space-y-2">
            {memory.timeline.map((entry) => (
              <div key={entry.id} className="border border-slate-800 rounded-md p-3">
                <p><strong>Roster ID:</strong> {entry.sourceFile}</p>
                <p className="text-sky-300"><strong>Changes:</strong> {entry.summary}</p>
                <p className="text-orange-300"><strong>Issues:</strong> {entry.kind}</p>
                <p className="text-emerald-300"><strong>Agent Notes:</strong> {entry.changes.map(c => `${c.field}: ${c.from} -> ${c.to}`).join(', ')}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}