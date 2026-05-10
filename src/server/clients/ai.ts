import { createOpenAI } from "@ai-sdk/openai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createAzure } from "@ai-sdk/azure";
import { createGroq } from "@ai-sdk/groq";

import type { LanguageModel } from "ai";

export type AIProvider = 
  | "openai" 
  | "gemini" 
  | "azure" 
  | "groq" 
  | "openrouter" 
  | "nvidia" 
  | "custom";

interface GetAIModelParams {
  provider: string;
  model: string;
  apiKey?: string | null;
  baseUrl?: string | null;
}

export function getAIModel({ provider, model, apiKey, baseUrl }: GetAIModelParams): LanguageModel {
  let aiModel: unknown;

  switch (provider as AIProvider) {
    case "openai": {
      const openai = createOpenAI({
        apiKey: apiKey ?? process.env.OPENAI_API_KEY,
        baseURL: baseUrl ?? undefined,
      });
      aiModel = openai(model);
      break;
    }
    case "gemini": {
      const google = createGoogleGenerativeAI({
        apiKey: apiKey ?? process.env.GOOGLE_GENERATIVE_AI_API_KEY,
      });
      aiModel = google(model);
      break;
    }
    case "azure": {
      const azure = createAzure({
        apiKey: apiKey ?? process.env.AZURE_RESOURCE_API_KEY,
        resourceName: process.env.AZURE_RESOURCE_NAME, // Usually global
      });
      aiModel = azure(model);
      break;
    }
    case "groq": {
      const groq = createGroq({
        apiKey: apiKey ?? process.env.GROQ_API_KEY,
      });
      aiModel = groq(model);
      break;
    }
    case "openrouter": {
      const openrouter = createOpenAI({
        apiKey: apiKey ?? process.env.OPENROUTER_API_KEY,
        baseURL: "https://openrouter.ai/api/v1",
      });
      aiModel = openrouter(model);
      break;
    }
    case "nvidia": {
      const nvidia = createOpenAI({
        apiKey: apiKey ?? process.env.NVIDIA_API_KEY,
        baseURL: "https://integrate.api.nvidia.com/v1",
      });
      aiModel = nvidia(model);
      break;
    }
    case "custom": {
      const custom = createOpenAI({
        apiKey: apiKey ?? undefined,
        baseURL: baseUrl ?? undefined,
      });
      aiModel = custom(model);
      break;
    }
    default: {
      // Fallback to OpenAI if unknown
      const defaultOpenai = createOpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
      aiModel = defaultOpenai(model || "gpt-4o");
      break;
    }
  }

  return aiModel as LanguageModel;
}
