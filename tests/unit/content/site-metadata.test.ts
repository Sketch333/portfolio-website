import { describe, expect, it } from "vitest";

import { siteConfig } from "@/lib/metadata/site";

describe("siteConfig", () => {
  it("uses the approved positioning", () => {
    expect(siteConfig.title).toContain("Syed Aon Muhammad Kazmi");
    expect(siteConfig.description).toContain("AI-driven systems");
  });
});
