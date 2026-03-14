"use client";

import * as React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileDropzone } from "@/features/rosters/upload/file-dropzone";
import { readCsvPreview, type CsvPreview } from "@/features/rosters/upload/csv";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertTriangle, CheckCircle2, FileSpreadsheet, MapPin } from "lucide-react";
import { useUploadRoster } from "@/hooks/use-roster";
import type { UploadRosterResponse } from "@/api/roster";

const FormSchema = z.object({
  file: z.instanceof(File, { message: "Please select a roster file." })
});
type FormValues = z.infer<typeof FormSchema>;

export function RosterUploadPage() {
  const [preview, setPreview] = React.useState<CsvPreview | null>(null);
  const [localErrors, setLocalErrors] = React.useState<string[]>([]);
  const [progress, setProgress] = React.useState(0);
  const [lastResult, setLastResult] = React.useState<UploadRosterResponse | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: undefined
  });

  const mutation = useUploadRoster();

  async function onPickFile(file: File) {
    form.setValue("file", file, { shouldValidate: true });
    setLocalErrors([]);
    setPreview(null);

    const isCsv = file.name.toLowerCase().endsWith(".csv");
    const isXlsx =
      file.name.toLowerCase().endsWith(".xlsx") || file.name.toLowerCase().endsWith(".xls");

    if (!isCsv && !isXlsx) {
      setLocalErrors(["Unsupported file type. Please upload .csv or .xlsx/.xls."]);
      return;
    }

    if (isCsv) {
      try {
        const p = await readCsvPreview(file, 20);
        setPreview(p);
        if (p.headers.length < 3) {
          setLocalErrors((e) => [...e, "This CSV has very few columns; check delimiter/format."]);
        }
      } catch {
        setLocalErrors(["Failed to read CSV preview."]);
      }
    } else {
      setLocalErrors([
        "Excel preview is stubbed in demo mode. Upload will still work via mock API."
      ]);
      setPreview({
        headers: ["Provider Name", "NPI", "Specialty", "Address"],
        rows: [
          {
            "Provider Name": "Avery Patel",
            NPI: "1234567890",
            Specialty: "Family Medicine",
            Address: "1200 Market St, San Francisco, CA"
          }
        ]
      });
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="text-xl font-semibold tracking-tight">Roster Upload</div>
          <div className="text-sm text-muted-foreground max-w-2xl">
            Upload provider rosters, preview parsing, validate fields, and ingest into normalized
            provider memory.
          </div>
        </div>
        <Badge variant="outline">POST /api/rosters/upload</Badge>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Upload file</CardTitle>
            <CardDescription>CSV/XLSX supported. Preview before processing.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FileDropzone accept=".csv,.xlsx,.xls" onFile={onPickFile} />

            {localErrors.length > 0 && (
              <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm">
                <div className="flex items-center gap-2 font-medium text-destructive">
                  <AlertTriangle className="h-4 w-4" />
                  Upload notes
                </div>
                <ul className="mt-2 space-y-1 text-muted-foreground">
                  {localErrors.map((e) => (
                    <li key={e}>- {e}</li>
                  ))}
                </ul>
              </div>
            )}

            {progress > 0 && <Progress value={progress} />}

            <div className="flex items-center justify-between gap-2">
              <div className="text-xs text-muted-foreground">
                {form.watch("file") ? (
                  <span className="inline-flex items-center gap-2">
                    <FileSpreadsheet className="h-4 w-4" />
                    {form.watch("file")!.name}
                  </span>
                ) : (
                  "No file selected"
                )}
              </div>
              <Button
                disabled={!form.watch("file") || mutation.isPending}
                onClick={form.handleSubmit((values) => {
                  const f = values.file;
                  setLastResult(null);
                  setProgress(8);
                  const timer = window.setInterval(() => {
                    setProgress((p) =>
                      Math.min(96, p + Math.max(1, Math.round((100 - p) * 0.1)))
                    );
                  }, 160);
                  mutation.mutate(f, {
                    onSuccess: (data) => {
                      setLastResult(data);
                      setProgress(100);
                      window.clearInterval(timer);
                      window.setTimeout(() => setProgress(0), 800);
                    },
                    onError: () => {
                      window.clearInterval(timer);
                      setProgress(0);
                    }
                  });
                })}
              >
                {mutation.isPending ? "Uploading…" : "Upload & normalize"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
            <CardDescription>Spot-check headers and a few rows.</CardDescription>
          </CardHeader>
          <CardContent>
            {!preview ? (
              <div className="rounded-xl border bg-muted/20 p-8 text-sm text-muted-foreground">
                Select a file to see a preview here.
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                  {preview.rows.length} row(s) previewed
                </div>
                <Table className="border rounded-xl overflow-hidden">
                  <TableHeader>
                    <TableRow>
                      {preview.headers.slice(0, 6).map((h) => (
                        <TableHead key={h}>{h}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {preview.rows.slice(0, 8).map((row, idx) => (
                      <TableRow key={idx}>
                        {preview.headers.slice(0, 6).map((h) => (
                          <TableCell key={h} className="text-muted-foreground">
                            {row[h] || "—"}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {lastResult && (
        <Card>
          <CardHeader>
            <CardTitle>Upload results</CardTitle>
            <CardDescription>
              Parsed providers and validation feedback from the backend.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <Badge variant="secondary">Roster ID: {lastResult.rosterId}</Badge>
              <Badge variant="outline">
                Providers found: {lastResult.providersFound}
              </Badge>
              <Badge variant="outline" className="inline-flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                Locations: {lastResult.locationsFound}
              </Badge>
            </div>

            {lastResult.issues.length > 0 && (
              <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm">
                <div className="font-medium text-destructive">Detected issues</div>
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  {lastResult.issues.map((e, i) => (
                    <div key={i} className="rounded-lg border bg-background p-3">
                      <div className="text-xs text-muted-foreground">
                        {e.type.toUpperCase()}
                      </div>
                      <div className="text-sm">{e.message}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

