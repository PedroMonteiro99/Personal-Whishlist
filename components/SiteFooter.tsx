import Link from "next/link";

import { OwnerModeToggle } from "@/features/reservations/components/OwnerModeToggle";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/70 bg-background/80">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p>
          Wishlist do Pedro ·{" "}
          <Link href="/recebidos" className="hover:text-foreground">
            já recebidos
          </Link>
        </p>
        <OwnerModeToggle />
      </div>
    </footer>
  );
}
