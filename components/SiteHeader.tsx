import Link from "next/link";

import { BrandMark } from "@/components/BrandMark";
import { MainNav } from "@/components/MainNav";
import { OwnerModeToggle } from "@/features/reservations/components/OwnerModeToggle";
import { HeaderSearch } from "@/features/search/components/HeaderSearch";
import { ThemeToggle } from "@/features/theme/components/ThemeToggle";

export function SiteHeader({ occasionName }: { occasionName: string }) {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur-xl">
      {/*
        No telemóvel a marca e os três controlos deixam 32px livres — não cabe
        lá uma ligação de texto. A navegação passa para a sua própria linha
        abaixo (`order-last` + `w-full`) e volta a ficar em linha a partir de
        `sm`, onde a coluna tem largura de sobra.
      */}
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-x-4 gap-y-2 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-center gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl border border-border/70 bg-card text-primary shadow-sm transition-transform group-hover:-translate-y-0.5">
            <BrandMark className="size-6" />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-base font-semibold text-foreground">
              Wishlist do Pedro
            </span>
            {/* A ocasião aberta dá contexto a quem chega — e denuncia uma
                ocasião que ficou por fechar. */}
            <span className="text-xs text-muted-foreground">
              {occasionName}
            </span>
          </span>
        </Link>

        <MainNav className="order-last w-full sm:order-none sm:ml-1 sm:w-auto" />

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <HeaderSearch />
          <OwnerModeToggle />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
