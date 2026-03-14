import { NextResponse } from "next/server";
import { getMockProviders } from "@/lib/mock/providers";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = (url.searchParams.get("q") ?? "").toLowerCase();
  const page = Number(url.searchParams.get("page") ?? "0");
  const pageSize = Number(url.searchParams.get("pageSize") ?? "15");
  const sort = url.searchParams.get("sort") ?? "confidence_desc";
  const flags = (url.searchParams.get("flags") ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  let items = getMockProviders();
  if (q) {
    items = items.filter((p) => {
      const hay = `${p.name} ${p.npi} ${p.specialty} ${p.address} ${p.sourceFile}`.toLowerCase();
      return hay.includes(q);
    });
  }
  if (flags.length) {
    items = items.filter((p) => p.flags.some((f) => flags.includes(f.code)));
  }

  items = [...items].sort((a, b) => {
    if (sort === "confidence_desc") return b.confidence - a.confidence;
    if (sort === "confidence_asc") return a.confidence - b.confidence;
    if (sort === "name_asc") return a.name.localeCompare(b.name);
    if (sort === "name_desc") return b.name.localeCompare(a.name);
    return 0;
  });

  const total = items.length;
  const start = page * pageSize;
  const paged = items.slice(start, start + pageSize);

  return NextResponse.json({ items: paged, total, page, pageSize });
}

