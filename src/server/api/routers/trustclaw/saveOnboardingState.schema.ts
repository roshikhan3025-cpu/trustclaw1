import { z } from "zod";
import { aiProviderSchema } from "./createInstance.schema";

export const onboardingStepSchema = z.enum([
  "name",
  "writing-style",
  "personality",
  "emoji",
  "lore",
  "model",
  "integrations",
  "telegram",
]);

export type OnboardingStep = z.infer<typeof onboardingStepSchema>;

export const saveOnboardingStateInput = z.object({
  currentStep: onboardingStepSchema,
  name: z.string().default(""),
  writingStyle: z.string().nullable().default(null),
  personality: z.string().nullable().default(null),
  emoji: z.string().nullable().default(null),
  lore: z.string().default(""),
  aiProvider: aiProviderSchema.default("openai"),
  aiModel: z.string().default("gpt-4o"),
});

export type SaveOnboardingStateInput = z.infer<typeof saveOnboardingStateInput>;
