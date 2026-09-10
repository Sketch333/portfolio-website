import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { SiteHeader } from "@/components/layout/site-header";

describe("SiteHeader", () => {
  afterEach(cleanup);

  it("exposes the required primary destinations and distinct contact action", () => {
    render(<SiteHeader />);

    const primary = screen.getByRole("navigation", { name: "Primary" });

    expect(primary).toContainElement(screen.getByRole("link", { name: "Work" }));
    expect(primary).toContainElement(
      screen.getByRole("link", { name: "Experience" }),
    );
    expect(primary).toContainElement(screen.getByRole("link", { name: "Writing" }));
    expect(primary).toContainElement(screen.getByRole("link", { name: "About" }));
    expect(primary).toContainElement(screen.getByRole("link", { name: "Ask AI" }));

    expect(primary).not.toContainElement(
      screen.getByRole("link", { name: "Contact" }),
    );
  });

  it("uses conventional links with the approved targets", () => {
    render(<SiteHeader />);

    expect(screen.getByRole("link", { name: "Work" })).toHaveAttribute(
      "href",
      "/#work",
    );
    expect(screen.getByRole("link", { name: "Experience" })).toHaveAttribute(
      "href",
      "/#experience",
    );
    expect(screen.getByRole("link", { name: "Writing" })).toHaveAttribute(
      "href",
      "/blog",
    );
    expect(screen.getByRole("link", { name: "About" })).toHaveAttribute(
      "href",
      "/about",
    );
    expect(screen.getByRole("link", { name: "Ask AI" })).toHaveAttribute(
      "href",
      "/#ask-ai",
    );
    expect(screen.getByRole("link", { name: "Contact" })).toHaveAttribute(
      "href",
      "/#contact",
    );
  });

  it("opens the mobile navigation and closes it after following a link", async () => {
    render(<SiteHeader />);

    const trigger = screen.getByRole("button", { name: "Open navigation menu" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");

    fireEvent.click(trigger);

    expect(trigger).toHaveAttribute("aria-expanded", "true");
    const mobileNavigation = await screen.findByRole("navigation", {
      name: "Mobile primary",
    });
    const workLink = mobileNavigation.querySelector<HTMLAnchorElement>(
      'a[href="/#work"]',
    );
    expect(workLink).not.toBeNull();

    fireEvent.click(workLink!);

    await waitFor(() => {
      expect(trigger).toHaveAttribute("aria-expanded", "false");
      expect(
        screen.queryByRole("navigation", { name: "Mobile primary" }),
      ).not.toBeInTheDocument();
    });
  });

  it("closes the mobile navigation with Escape and returns focus", async () => {
    render(<SiteHeader />);

    const trigger = screen.getByRole("button", { name: "Open navigation menu" });
    trigger.focus();
    fireEvent.click(trigger);
    await screen.findByRole("navigation", { name: "Mobile primary" });

    fireEvent.keyDown(document, { key: "Escape" });

    await waitFor(() => {
      expect(trigger).toHaveFocus();
      expect(trigger).toHaveAttribute("aria-expanded", "false");
    });
  });
});
