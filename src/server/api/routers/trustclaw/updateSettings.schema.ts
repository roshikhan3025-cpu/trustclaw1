import { z } from "zod";
import { aiProviderSchema } from "./createInstance.schema";

const ianaTimezone = z
  .string()
  .refine(
    (tz) => {
      try {
        Intl.DateTimeFormat(undefined, { timeZone: tz });
        return true;
      } catch {
        return false;
      }
    },
    { message: "Invalid IANA timezone" },
  );

export const updateSettingsInput = z.object({
  aiProvider: aiProviderSchema.optional(),
  aiModel: z.string().optional(),
  aiApiKey: z.string().optional(),
  aiBaseUrl: z.string().optional(),
  timezone: ianaTimezone.optional(),
  soulPrompt: z.string().optional(),
  identityPrompt: z.string().optional(),
  userPrompt: z.string().optional(),
});

export type UpdateSettingsInput = z.infer<typeof updateSettingsInput>;
