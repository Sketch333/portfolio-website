import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ThemeProvider } from "@/components/providers/theme-provider";
import { ThemeToggle } from "@/components/theme/theme-toggle";

function setSystemTheme(dark: boolean) {
  vi.stubGlobal(
    "matchMedia",
    vi.fn().mockImplementation((query: string) => ({
      matches: dark,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  );
}

function renderTheme() {
  return render(
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <ThemeToggle />
    </ThemeProvider>,
  );
}

describe("ThemeProvider with ThemeToggle", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute("class");
    setSystemTheme(false);
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
    localStorage.clear();
    document.documentElement.removeAttribute("class");
  });

  it("keeps the toggle out of server markup until its theme is resolved", () => {
    const html = renderToString(
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <ThemeToggle />
      </ThemeProvider>,
    );

    expect(html).not.toContain("<button");
  });

  it("resolves a system-light preference and persists a dark override", async () => {
    renderTheme();

    fireEvent.click(
      await screen.findByRole("button", { name: "Switch to dark theme" }),
    );

    await waitFor(() => {
      expect(localStorage.getItem("theme")).toBe("dark");
      expect(document.documentElement).toHaveClass("dark");
    });
  });

  it("resolves a system-dark preference and persists a light override", async () => {
    setSystemTheme(true);
    renderTheme();

    fireEvent.click(
      await screen.findByRole("button", { name: "Switch to light theme" }),
    );

    await waitFor(() => {
      expect(localStorage.getItem("theme")).toBe("light");
      expect(document.documentElement).toHaveClass("light");
    });
  });

  it("restores a persisted manual override before using system preference", async () => {
    localStorage.setItem("theme", "dark");
    renderTheme();

    expect(
      await screen.findByRole("button", { name: "Switch to light theme" }),
    ).toBeInTheDocument();
    expect(document.documentElement).toHaveClass("dark");
  });
});
