import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/features/theme/components/ThemeToggle";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-2xl border border-border/70 bg-card text-sm font-semibold tracking-[0.2em] text-foreground shadow-sm transition-transform group-hover:-translate-y-0.5">
            WP
          </span>
          <span className="flex flex-col">
            <span className="text-sm font-semibold uppercase tracking-[0.32em] text-muted-foreground">
              Wishlist
            </span>
            <span className="text-base font-semibold text-foreground">
              Premium
            </span>
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="hidden sm:inline-flex">
            Dark Mode First
          </Badge>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
