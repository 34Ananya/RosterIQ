import { useMutation } from "@tanstack/react-query";
import { uploadRoster, type UploadRosterResponse } from "@/api/roster";
import { useToast } from "@/components/ui/toast";

export function useUploadRoster() {
  const { push } = useToast();

  return useMutation<UploadRosterResponse, Error, File>({
    mutationFn: async (file: File) => {
      try {
        return await uploadRoster(file);
      } catch (err: any) {
        const msg = err?.message ?? "Failed to upload roster.";
        push({ type: "error", message: msg, title: "Upload failed" });
        throw err;
      }
    },
    onSuccess: (data) => {
      push({
        type: "success",
        title: "Roster uploaded",
        message: `Found ${data.providersFound} providers across ${data.locationsFound} locations.`
      });
    }
  });
}

