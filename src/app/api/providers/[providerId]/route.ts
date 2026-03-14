import { NextResponse } from "next/server";
import { getMockProviderById } from "@/lib/mock/providers";

export async function GET(
  _req: Request,
  { params }: { params: { providerId: string } }
) {
  const provider = getMockProviderById(params.providerId);
  if (!provider) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }
  return NextResponse.json(provider);
}

