import { ProviderMemoryPage } from "@/features/providers/memory/provider-memory-page";

export default function Page({ params }: { params: { providerId: string } }) {
  return <ProviderMemoryPage providerId={params.providerId} />;
}

