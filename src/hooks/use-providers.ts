import { useQuery } from "@tanstack/react-query";
import {
  getProviderMemory,
  searchProviders,
  type Provider,
  type ProviderMemory
} from "@/api/providers";
import { useToast } from "@/components/ui/toast";

export interface UseSearchProvidersOptions {
  query: string;
}

export function useSearchProviders({ query }: UseSearchProvidersOptions) {
  const { push } = useToast();

  return useQuery<Provider[], Error>({
    queryKey: ["providers-search", query],
    queryFn: async () => {
      try {
        return await searchProviders(query, {});
      } catch (err: any) {
        const msg = err?.message ?? "Failed to search providers.";
        push({ type: "error", message: msg, title: "Provider search failed" });
        throw err;
      }
    },
    staleTime: 30_000
  });
}

export function useProviderMemory(providerId: string | null) {
  const { push } = useToast();

  return useQuery<ProviderMemory, Error>({
    enabled: !!providerId,
    queryKey: ["provider-memory", providerId],
    queryFn: async () => {
      if (!providerId) throw new Error("No provider selected");
      try {
        return await getProviderMemory(providerId);
      } catch (err: any) {
        const msg = err?.message ?? "Failed to load provider memory.";
        push({ type: "error", message: msg, title: "Provider memory failed" });
        throw err;
      }
    }
  });
}

