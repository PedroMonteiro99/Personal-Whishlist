import Link from "next/link";

import { BrandMark } from "@/components/BrandMark";
import { HeaderSearch } from "@/features/search/components/HeaderSearch";
import { ThemeToggle } from "@/features/theme/components/ThemeToggle";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-center gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl border border-border/70 bg-card text-primary shadow-sm transition-transform group-hover:-translate-y-0.5">
            <BrandMark className="size-6" />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-base font-semibold text-foreground">
              Wishlist do Pedro
            </span>
            <span className="text-xs text-muted-foreground">
              Ideias de presentes
            </span>
          </span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          <HeaderSearch />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
