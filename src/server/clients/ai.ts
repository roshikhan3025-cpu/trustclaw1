import { createOpenAI } from "@ai-sdk/openai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createAzure } from "@ai-sdk/azure";
import { createGroq } from "@ai-sdk/groq";

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

export function getAIModel({ provider, model, apiKey, baseUrl }: GetAIModelParams) {
  switch (provider as AIProvider) {
    case "openai": {
      const openai = createOpenAI({
        apiKey: apiKey ?? process.env.OPENAI_API_KEY,
        baseURL: baseUrl ?? undefined,
      });
      return openai(model);
    }
    case "gemini": {
      const google = createGoogleGenerativeAI({
        apiKey: apiKey ?? process.env.GOOGLE_GENERATIVE_AI_API_KEY,
      });
      return google(model);
    }
    case "azure": {
      const azure = createAzure({
        apiKey: apiKey ?? process.env.AZURE_RESOURCE_API_KEY,
        resourceName: process.env.AZURE_RESOURCE_NAME, // Usually global
      });
      return azure(model);
    }
    case "groq": {
      const groq = createGroq({
        apiKey: apiKey ?? process.env.GROQ_API_KEY,
      });
      return groq(model);
    }
    case "openrouter": {
      const openrouter = createOpenAI({
        apiKey: apiKey ?? process.env.OPENROUTER_API_KEY,
        baseURL: "https://openrouter.ai/api/v1",
      });
      return openrouter(model);
    }
    case "nvidia": {
      const nvidia = createOpenAI({
        apiKey: apiKey ?? process.env.NVIDIA_API_KEY,
        baseURL: "https://integrate.api.nvidia.com/v1",
      });
      return nvidia(model);
    }
    case "custom": {
      const custom = createOpenAI({
        apiKey: apiKey ?? undefined,
        baseURL: baseUrl ?? undefined,
      });
      return custom(model);
    }
    default:
      // Fallback to OpenAI if unknown
      const defaultOpenai = createOpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
      return defaultOpenai(model || "gpt-4o");
  }
}
