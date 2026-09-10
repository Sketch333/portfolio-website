"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Dialog } from "radix-ui";

export type NavigationItem = {
  href: string;
  label: string;
};

type MobileNavProps = {
  contactHref: string;
  items: readonly NavigationItem[];
};

const menuLinkClassName =
  "flex min-h-11 items-center rounded-md px-3 text-lg font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

export function MobileNav({ contactHref, items }: MobileNavProps) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button
          type="button"
          aria-label="Open navigation menu"
          className="inline-flex size-11 items-center justify-center rounded-md border bg-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring md:hidden"
        >
          <Menu aria-hidden="true" className="size-5" />
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-foreground/25 backdrop-blur-sm" />
        <Dialog.Content className="fixed inset-y-0 right-0 z-50 flex w-[min(22rem,88vw)] flex-col border-l bg-background p-6 shadow-xl focus:outline-none">
          <div className="flex min-h-11 items-center justify-between gap-4">
            <Dialog.Title className="text-base font-semibold">
              Navigation menu
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                type="button"
                aria-label="Close navigation menu"
                className="inline-flex size-11 items-center justify-center rounded-md transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                <X aria-hidden="true" className="size-5" />
              </button>
            </Dialog.Close>
          </div>
          <Dialog.Description className="sr-only">
            Navigate to the main areas of Aon Kazmi&apos;s portfolio.
          </Dialog.Description>

          <nav aria-label="Mobile primary" className="mt-8 flex flex-col gap-2">
            {items.map((item) => (
              <Dialog.Close asChild key={item.href}>
                <Link href={item.href} className={menuLinkClassName}>
                  {item.label}
                </Link>
              </Dialog.Close>
            ))}
          </nav>

          <Dialog.Close asChild>
            <Link
              href={contactHref}
              className="mt-auto inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-4 font-semibold text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              Contact
            </Link>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
