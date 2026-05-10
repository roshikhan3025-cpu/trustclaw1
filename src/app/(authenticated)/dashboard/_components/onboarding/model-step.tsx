"use client";

import { motion } from "framer-motion";
import { cn } from "~/lib/utils";
import { PROVIDERS } from "./onboarding.consts";
import { StepLayout, itemVariants } from "./step-layout";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";

interface ModelStepProps {
  provider: string;
  model: string;
  onProviderChange: (provider: string) => void;
  onModelChange: (model: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export function ModelStep({
  provider,
  model,
  onProviderChange,
  onModelChange,
  onNext,
  onBack,
}: ModelStepProps) {
  return (
    <StepLayout
      title="Choose my brain!"
      subtitle="Which AI provider and model should power me?"
      onNext={onNext}
      onBack={onBack}
    >
      <motion.div variants={itemVariants} className="space-y-6">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {PROVIDERS.map((p) => (
            <button
              key={p.value}
              onClick={() => onProviderChange(p.value)}
              className={cn(
                "flex flex-col items-center justify-center rounded-lg border p-3 text-center transition-all",
                provider === p.value
                  ? "border-primary bg-primary/5 ring-primary ring-1"
                  : "border-border hover:border-primary/50",
              )}
            >
              <p className="text-xs font-semibold">{p.label}</p>
              <p className="text-[10px] text-muted-foreground leading-tight mt-1">
                {p.description}
              </p>
            </button>
          ))}
        </div>

        <div className="space-y-2">
          <Label className="text-xs">Model Name</Label>
          <Input 
            value={model}
            onChange={(e) => onModelChange(e.target.value)}
            placeholder="e.g. gpt-4o, gemini-1.5-pro, groq-llama3"
            className="h-9 text-sm"
          />
          <p className="text-[10px] text-muted-foreground text-center">
            You can configure API keys and custom endpoints in settings later.
          </p>
        </div>
      </motion.div>
    </StepLayout>
  );
}
