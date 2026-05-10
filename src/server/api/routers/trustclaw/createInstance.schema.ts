import { z } from "zod";

export const AI_PROVIDERS = [
  "openai",
  "gemini",
  "azure",
  "groq",
  "openrouter",
  "nvidia",
  "custom",
] as const;

export const aiProviderSchema = z.enum(AI_PROVIDERS);

export const createInstanceInput = z.object({
  aiProvider: aiProviderSchema.default("openai"),
  aiModel: z.string().default("gpt-4o"),
  aiApiKey: z.string().optional(),
  aiBaseUrl: z.string().optional(),
});

export type CreateInstanceInput = z.infer<typeof createInstanceInput>;
