import { apiRequest } from "@/api/http";
import { RosterUploadResponseSchema } from "@/types/rosters";

export async function uploadRoster(payload: {
  filename: string;
  rowsPreview: Record<string, string>[];
}) {
  return apiRequest("/api/rosters/upload", RosterUploadResponseSchema, {
    method: "POST",
    body: payload
  });
}

