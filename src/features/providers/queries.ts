"use client";

import { useQuery } from "@tanstack/react-query";
import { getProviderMemory, listProviders } from "@/api/providers";

export function useProvidersQuery(params: {
  q: string;
  page: number;
  pageSize: number;
  sort: string;
  flags: string[];
}) {
  return useQuery({
    queryKey: ["providers", params],
    queryFn: () => listProviders(params)
  });
}

export function useProviderMemoryQuery(providerId: string | null) {
  return useQuery({
    enabled: !!providerId,
    queryKey: ["provider-memory", providerId],
    queryFn: () => getProviderMemory(providerId!)
  });
}

