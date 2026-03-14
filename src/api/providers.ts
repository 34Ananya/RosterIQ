import api, { USE_MOCK } from "@/api/client";
import {
  type Provider as ProviderType,
  type ProviderMemoryEvent,
  type ProviderMemoryResponse
} from "@/types/provider";
import {
  getMockProviders,
  getMockProviderMemory
} from "@/lib/mock/providers";

export type Provider = ProviderType;

export interface ProviderMemoryEntry extends ProviderMemoryEvent {}

export interface ProviderMemory extends ProviderMemoryResponse {}

export interface SearchProvidersParams {
  query?: string;
  page?: number;
  pageSize?: number;
  sort?: string;
  flags?: string[];
}

export async function searchProviders(
  query: string,
  params: Omit<SearchProvidersParams, "query"> = {}
): Promise<Provider[]> {
  if (USE_MOCK) {
    const all = getMockProviders();
    const q = query.toLowerCase();
    if (!q) return all;
    return all.filter((p) =>
      `${p.name} ${p.npi} ${p.specialty} ${p.address} ${p.sourceFile}`
        .toLowerCase()
        .includes(q)
    );
  }

  const res = await api.get<{ items: Provider[] }>("/api/providers", {
    params: {
      q: query || undefined,
      page: params.page,
      pageSize: params.pageSize,
      sort: params.sort,
      flags: params.flags?.join(",")
    }
  });
  return res.data.items;
}

export async function getProviderMemory(
  providerId: string
): Promise<ProviderMemory> {
  if (USE_MOCK) {
    return Promise.resolve(getMockProviderMemory(providerId));
  }

  const res = await api.get<ProviderMemory>(
    `/api/providers/${encodeURIComponent(providerId)}/memory`
  );
  return res.data;
}

