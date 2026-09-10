import Link from "next/link";

import { MobileNav, type NavigationItem } from "@/components/layout/mobile-nav";
import { ThemeToggle } from "@/components/theme/theme-toggle";

const navigationItems: readonly NavigationItem[] = [
  { href: "/#work", label: "Work" },
  { href: "/#experience", label: "Experience" },
  { href: "/blog", label: "Writing" },
  { href: "/about", label: "About" },
  { href: "/#ask-ai", label: "Ask AI" },
];

const contactHref = "/#contact";
const navigationLinkClassName =
  "inline-flex min-h-11 items-center rounded-md px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex min-h-16 w-full max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          aria-label="Aon Kazmi, home"
          className="inline-flex min-h-11 shrink-0 items-center rounded-md font-semibold tracking-tight focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          Aon Kazmi
        </Link>

        <nav
          aria-label="Primary"
          className="ml-auto hidden items-center gap-1 md:flex"
        >
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={navigationLinkClassName}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 md:ml-2">
          <div className="flex min-h-11 min-w-20 items-center justify-end">
            <ThemeToggle />
          </div>
          <Link
            href={contactHref}
            className="hidden min-h-11 items-center justify-center rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring md:inline-flex"
          >
            Contact
          </Link>
          <MobileNav items={navigationItems} contactHref={contactHref} />
        </div>
      </div>

      <noscript>
        <nav
          aria-label="Primary navigation without JavaScript"
          className="flex flex-wrap gap-1 border-t px-4 py-2 md:hidden"
        >
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={navigationLinkClassName}
            >
              {item.label}
            </Link>
          ))}
          <Link href={contactHref} className={navigationLinkClassName}>
            Contact
          </Link>
        </nav>
      </noscript>
    </header>
  );
}
