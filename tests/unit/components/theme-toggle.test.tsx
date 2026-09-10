import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ThemeToggle } from "@/components/theme/theme-toggle";

const setTheme = vi.fn();
const themeState: { theme: string; resolvedTheme: string } = {
  theme: "light",
  resolvedTheme: "light",
};

vi.mock("next-themes", () => ({
  useTheme: () => ({ ...themeState, setTheme }),
}));

describe("ThemeToggle", () => {
  beforeEach(() => {
    setTheme.mockClear();
    themeState.theme = "light";
    themeState.resolvedTheme = "light";
  });

  afterEach(cleanup);

  it("switches from light to dark", async () => {
    render(<ThemeToggle />);

    fireEvent.click(
      await screen.findByRole("button", { name: "Switch to dark theme" }),
    );

    expect(setTheme).toHaveBeenCalledWith("dark");
  });

  it("switches from dark to light", async () => {
    themeState.theme = "dark";
    themeState.resolvedTheme = "dark";
    render(<ThemeToggle />);

    fireEvent.click(
      await screen.findByRole("button", { name: "Switch to light theme" }),
    );

    expect(setTheme).toHaveBeenCalledWith("light");
  });

  it("switches a system-dark theme to an explicit light override", async () => {
    themeState.theme = "system";
    themeState.resolvedTheme = "dark";
    render(<ThemeToggle />);

    fireEvent.click(
      await screen.findByRole("button", { name: "Switch to light theme" }),
    );

    expect(setTheme).toHaveBeenCalledWith("light");
  });
});
