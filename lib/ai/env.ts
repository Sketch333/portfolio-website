import { z } from "zod";

const requiredValue = z.string().trim().min(1);

const mongoSchema = z.object({
  MONGODB_URI: requiredValue,
  MONGODB_DB: requiredValue,
});

const aiSchema = z.object({
  AI_GATEWAY_API_KEY: requiredValue,
  AI_CHAT_MODEL: requiredValue,
  AI_EMBEDDING_MODEL: requiredValue,
});

// Read only at the server functionality boundary; static content needs no credentials.
export function getMongoEnv() {
  return mongoSchema.parse({
    MONGODB_URI: process.env.MONGODB_URI,
    MONGODB_DB: process.env.MONGODB_DB,
  });
}

export function getAiEnv() {
  return aiSchema.parse({
    AI_GATEWAY_API_KEY: process.env.AI_GATEWAY_API_KEY,
    AI_CHAT_MODEL: process.env.AI_CHAT_MODEL,
    AI_EMBEDDING_MODEL: process.env.AI_EMBEDDING_MODEL,
  });
}
