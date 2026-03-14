import api, { USE_MOCK } from "@/api/client";
import { getMockProviders } from "@/lib/mock/providers";

export interface UploadRosterIssue {
  type: string;
  message: string;
}

export interface UploadRosterResponse {
  rosterId: string;
  filename: string;
  providersFound: number;
  locationsFound: number;
  issues: UploadRosterIssue[];
}

export async function uploadRoster(file: File): Promise<UploadRosterResponse> {
  if (USE_MOCK) {
    const providers = getMockProviders(24);
    const uniqueLocations = new Set(providers.map((p) => p.address));

    return Promise.resolve({
      rosterId: `mock_${Date.now()}`,
      filename: file.name,
      providersFound: providers.length,
      locationsFound: uniqueLocations.size,
      issues: [
        {
          type: "validation",
          message: "2 rows with missing NPIs (simulated)."
        },
        {
          type: "anomaly",
          message: "Detected potential duplicate provider entries (simulated)."
        }
      ]
    });
  }

  const formData = new FormData();
  formData.append("file", file);

  const res = await api.post<UploadRosterResponse>("/api/rosters/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });

  return res.data;
}

