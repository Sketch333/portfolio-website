// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const keys = [
  "MONGODB_URI", "MONGODB_DB", "AI_GATEWAY_API_KEY",
  "AI_CHAT_MODEL", "AI_EMBEDDING_MODEL",
] as const;

beforeEach(() => {
  vi.resetModules();
  for (const key of keys) vi.stubEnv(key, undefined);
});

afterEach(() => vi.unstubAllEnvs());

describe("lazy AI configuration", () => {
  it("can be imported without credentials for static rendering", async () => {
    await expect(import("@/lib/ai/env")).resolves.toHaveProperty("getMongoEnv");
  }, 15_000);

  it("requires Mongo configuration only when database functionality is invoked", async () => {
    const { getMongoEnv } = await import("@/lib/ai/env");
    expect(() => getMongoEnv()).toThrow(/MONGODB_URI/);
  });

  it("reads database configuration independently of AI credentials", async () => {
    vi.stubEnv("MONGODB_URI", "mongodb://localhost:27017");
    vi.stubEnv("MONGODB_DB", "portfolio-test");
    const { getMongoEnv } = await import("@/lib/ai/env");
    expect(getMongoEnv()).toEqual({
      MONGODB_URI: "mongodb://localhost:27017", MONGODB_DB: "portfolio-test",
    });
  });

  it("reads configurable Gateway models without requiring Mongo credentials", async () => {
    vi.stubEnv("AI_GATEWAY_API_KEY", "test-key");
    vi.stubEnv("AI_CHAT_MODEL", "provider/configured-chat");
    vi.stubEnv("AI_EMBEDDING_MODEL", "provider/configured-embedding");
    const { getAiEnv } = await import("@/lib/ai/env");
    expect(getAiEnv()).toEqual({
      AI_GATEWAY_API_KEY: "test-key", AI_CHAT_MODEL: "provider/configured-chat",
      AI_EMBEDDING_MODEL: "provider/configured-embedding",
    });
  });

  it.each(keys)("rejects blank %s at invocation", async (key) => {
    for (const name of keys) vi.stubEnv(name, "configured-value");
    vi.stubEnv(key, "   ");
    const { getMongoEnv, getAiEnv } = await import("@/lib/ai/env");
    expect(() => key.startsWith("MONGODB") ? getMongoEnv() : getAiEnv()).toThrow(key);
  });

  it("reads current environment on each invocation instead of caching credentials", async () => {
    vi.stubEnv("MONGODB_URI", "mongodb://localhost:27017");
    vi.stubEnv("MONGODB_DB", "first");
    const { getMongoEnv } = await import("@/lib/ai/env");
    expect(getMongoEnv().MONGODB_DB).toBe("first");
    vi.stubEnv("MONGODB_DB", "second");
    expect(getMongoEnv().MONGODB_DB).toBe("second");
  });
});
