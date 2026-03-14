import { z } from "zod";
import { ProviderSchema } from "@/types/provider";

export const RosterUploadResponseSchema = z.object({
  rosterId: z.string(),
  sourceFile: z.string(),
  parsedProviders: z.array(ProviderSchema),
  validationErrors: z.array(
    z.object({
      row: z.number().int().nonnegative(),
      field: z.string(),
      message: z.string()
    })
  )
});

export type RosterUploadResponse = z.infer<typeof RosterUploadResponseSchema>;

