import type { Provider, ProviderMemoryResponse } from "@/types/provider";
import { DEMO_SOURCE_FILES, SPECIALTIES, pick, pseudoRandom } from "./seed";

function makeNpi(rand: () => number) {
  let s = "1";
  for (let i = 0; i < 9; i++) s += Math.floor(rand() * 10).toString();
  return s;
}

const NAMES = [
  "Avery Patel",
  "Jordan Kim",
  "Taylor Nguyen",
  "Casey Williams",
  "Riley Johnson",
  "Morgan Chen",
  "Sydney Garcia",
  "Quinn Shah",
  "Cameron Lee",
  "Reese Brown",
  "Parker Singh",
  "Rowan Martin"
] as const;

const ADDRESSES = [
  "1200 Market St, San Francisco, CA",
  "44 W 28th St, New York, NY",
  "300 Congress Ave, Austin, TX",
  "800 Boylston St, Boston, MA",
  "1800 W Loop S, Houston, TX",
  "600 N Michigan Ave, Chicago, IL"
] as const;

export function getMockProviders(count = 48): Provider[] {
  const rand = pseudoRandom(42);
  const providers: Provider[] = [];

  for (let i = 0; i < count; i++) {
    const name = pick(rand, NAMES);
    const specialty = pick(rand, SPECIALTIES);
    const address = pick(rand, ADDRESSES);
    const sourceFile = pick(rand, DEMO_SOURCE_FILES);
    const confidence = Math.max(0.62, Math.min(0.98, 0.65 + rand() * 0.35));

    const flags =
      rand() > 0.78
        ? [
            {
              code: rand() > 0.5 ? "ADDR_DRIFT" : "NPI_CONFLICT",
              label: rand() > 0.5 ? "Address drift detected" : "Conflicting NPI",
              severity: rand() > 0.6 ? "high" : "medium"
            }
          ]
        : [];

    providers.push({
      id: `prov_${i + 1}`,
      name,
      npi: makeNpi(rand),
      specialty,
      address,
      sourceFile,
      confidence,
      flags
    });
  }

  return providers;
}

export function getMockProviderById(id: string): Provider | undefined {
  const all = getMockProviders();
  return all.find((p) => p.id === id);
}

export function getMockProviderMemory(providerId: string): ProviderMemoryResponse {
  const rand = pseudoRandom(
    providerId.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0)
  );
  const provider =
    getMockProviderById(providerId) ??
    getMockProviders(1)[0]!;

  const timeline = [
    {
      id: `evt_${providerId}_1`,
      at: "2026-01-09T18:20:00.000Z",
      sourceFile: "roster_jan_2026.csv",
      kind: "created" as const,
      summary: "First seen in January roster.",
      changes: [
        { field: "name", from: null, to: provider.name },
        { field: "npi", from: null, to: provider.npi },
        { field: "address", from: null, to: provider.address }
      ]
    },
    {
      id: `evt_${providerId}_2`,
      at: "2026-02-10T18:20:00.000Z",
      sourceFile: "roster_feb_2026.xlsx",
      kind: "updated" as const,
      summary: "Normalized specialty updated; confidence improved.",
      changes: [
        {
          field: "specialty",
          from: provider.specialty,
          to: pick(rand, SPECIALTIES)
        },
        {
          field: "confidence",
          from: (provider.confidence - 0.08).toFixed(2),
          to: provider.confidence.toFixed(2)
        }
      ]
    },
    {
      id: `evt_${providerId}_3`,
      at: "2026-03-02T18:20:00.000Z",
      sourceFile: "roster_mar_2026.csv",
      kind: rand() > 0.55 ? ("flagged" as const) : ("updated" as const),
      summary:
        rand() > 0.55
          ? "Potential inconsistency detected across rosters."
          : "Address formatting normalized.",
      changes:
        rand() > 0.55
          ? [
              {
                field: "npi",
                from: provider.npi,
                to: provider.npi.slice(0, 9) + Math.floor(rand() * 10).toString()
              }
            ]
          : [
              {
                field: "address",
                from: provider.address,
                to: provider.address.replace("St,", "Street,")
              }
            ]
    }
  ];

  const aiSummary =
    "This provider appears consistently across the last three uploads. Specialty normalization stabilized in February. March introduced a potential inconsistency signal; review NPI/address drift and validate against source.";

  return { provider, timeline, aiSummary };
}

