"use client";

import * as React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const SettingsSchema = z.object({
  workspaceName: z.string().min(2),
  defaultConfidenceThreshold: z.coerce.number().min(0).max(1)
});
type SettingsValues = z.infer<typeof SettingsSchema>;

export function SettingsPage() {
  const [saved, setSaved] = React.useState(false);

  const form = useForm<SettingsValues>({
    resolver: zodResolver(SettingsSchema),
    defaultValues: { workspaceName: "Demo Ops", defaultConfidenceThreshold: 0.78 }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="text-xl font-semibold tracking-tight">Settings</div>
          <div className="text-sm text-muted-foreground max-w-2xl">
            Workspace preferences and UI defaults (mock-only for now).
          </div>
        </div>
        {saved && <Badge variant="secondary">Saved</Badge>}
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Workspace</CardTitle>
          <CardDescription>Defaults used across the app.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <div className="text-sm font-medium">Workspace name</div>
            <Input {...form.register("workspaceName")} />
            {form.formState.errors.workspaceName && (
              <div className="text-xs text-destructive">
                {form.formState.errors.workspaceName.message}
              </div>
            )}
          </div>

          <div className="grid gap-2">
            <div className="text-sm font-medium">Default confidence threshold</div>
            <Input
              type="number"
              step="0.01"
              min="0"
              max="1"
              {...form.register("defaultConfidenceThreshold")}
            />
            <div className="text-xs text-muted-foreground">
              Providers below this threshold can be highlighted in downstream views.
            </div>
            {form.formState.errors.defaultConfidenceThreshold && (
              <div className="text-xs text-destructive">
                {form.formState.errors.defaultConfidenceThreshold.message}
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                form.reset();
                setSaved(false);
              }}
              type="button"
            >
              Reset
            </Button>
            <Button
              onClick={form.handleSubmit(() => {
                setSaved(true);
                window.setTimeout(() => setSaved(false), 1200);
              })}
              type="button"
            >
              Save
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

