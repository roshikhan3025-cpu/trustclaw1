"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { trpc } from "~/clients/trpc";
import { AI_PROVIDERS } from "~/server/api/routers/trustclaw/createInstance.schema";
import { Button } from "~/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import {
  showSuccessToast,
  trpcToastOnError,
} from "~/components/core/toast-notifications";

interface ModelSettingsProps {
  currentProvider: string;
  currentModel: string;
  currentApiKey?: string | null;
  currentBaseUrl?: string | null;
}

export function ModelSettings({ 
  currentProvider, 
  currentModel, 
  currentApiKey, 
  currentBaseUrl 
}: ModelSettingsProps) {
  const [provider, setProvider] = useState(currentProvider);
  const [model, setModel] = useState(currentModel);
  const [apiKey, setApiKey] = useState(currentApiKey ?? "");
  const [baseUrl, setBaseUrl] = useState(currentBaseUrl ?? "");
  
  const utils = trpc.useUtils();

  const updateSettings = trpc.trustclaw.updateSettings.useMutation({
    onSuccess: () => {
      showSuccessToast("AI settings updated");
      void utils.trustclaw.getInstance.invalidate();
    },
    onError: trpcToastOnError,
  });

  const hasChanges = 
    provider !== currentProvider || 
    model !== currentModel || 
    apiKey !== (currentApiKey ?? "") || 
    baseUrl !== (currentBaseUrl ?? "");

  const handleSave = () => {
    void updateSettings.mutateAsync({
      aiProvider: provider as "openai",
      aiModel: model,
      aiApiKey: apiKey || undefined,
      aiBaseUrl: baseUrl || undefined,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Layer Configuration</CardTitle>
        <CardDescription>
          Configure the AI provider and model that powers your assistant.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Provider</Label>
            <Select
              value={provider}
              onValueChange={setProvider}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {AI_PROVIDERS.map((p) => (
                  <SelectItem key={p} value={p}>
                    <span className="capitalize">{p}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Model Name</Label>
            <Input 
              value={model} 
              onChange={(e) => setModel(e.target.value)} 
              placeholder="e.g. gpt-4o, claude-3-5-sonnet-20240620"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>API Key (Optional if set in environment)</Label>
          <Input 
            type="password"
            value={apiKey} 
            onChange={(e) => setApiKey(e.target.value)} 
            placeholder="sk-..."
          />
        </div>

        {(provider === "custom" || provider === "openrouter" || provider === "nvidia" || provider === "openai") && (
          <div className="space-y-2">
            <Label>Base URL (Optional)</Label>
            <Input 
              value={baseUrl} 
              onChange={(e) => setBaseUrl(e.target.value)} 
              placeholder={provider === "openrouter" ? "https://openrouter.ai/api/v1" : "https://api.openai.com/v1"}
            />
          </div>
        )}

        <Button
          className="w-full sm:w-auto"
          disabled={!hasChanges || updateSettings.isPending}
          onClick={handleSave}
        >
          {updateSettings.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
