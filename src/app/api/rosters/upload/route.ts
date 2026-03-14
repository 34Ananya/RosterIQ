import { NextResponse } from "next/server";
import { getMockProviders } from "@/lib/mock/providers";

export async function POST(req: Request) {
  const body = (await req.json()) as {
    filename?: string;
    rowsPreview?: Record<string, string>[];
  };

  const filename = body.filename ?? "uploaded_roster.csv";
  const parsedProviders = getMockProviders(24).map((p, i) => ({
    ...p,
    id: `upl_${i + 1}`,
    sourceFile: filename
  }));

  const validationErrors =
    (body.rowsPreview?.length ?? 0) > 0
      ? [
          { row: 2, field: "npi", message: "NPI is missing or invalid." },
          { row: 7, field: "address", message: "Address appears incomplete." }
        ]
      : [];

  return NextResponse.json({
    rosterId: `roster_${Date.now()}`,
    sourceFile: filename,
    parsedProviders,
    validationErrors
  });
}

