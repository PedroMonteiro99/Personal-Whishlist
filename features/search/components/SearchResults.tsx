import Link from "next/link";

import { EmptyState } from "@/components/EmptyState";
import { ProductGrid } from "@/components/ProductGrid";
import { Button } from "@/components/ui/button";
import { formatProductCount } from "@/lib/format";

import type { CatalogProduct } from "@/lib/catalog";

export function SearchResults({
  query,
  products,
  isBrowsingAll,
  hasActiveFilters,
  resetHref,
}: {
  query: string;
  products: CatalogProduct[];
  isBrowsingAll: boolean;
  hasActiveFilters: boolean;
  resetHref: string;
}) {
  const normalizedQuery = query.trim();

  if (products.length === 0) {
    if (hasActiveFilters) {
      return (
        <EmptyState
          title="Nada com estes filtros"
          description="Experimenta alargar o orçamento ou remover um dos filtros."
          action={
            <Button asChild variant="outline">
              <Link href={resetHref}>Limpar filtros</Link>
            </Button>
          }
        />
      );
    }

    if (isBrowsingAll) {
      return (
        <EmptyState
          title="A wishlist ainda está vazia"
          description="Ainda não há produtos publicados. Volta mais tarde."
        />
      );
    }

    return (
      <EmptyState
        title="Sem resultados"
        description={`Não encontrámos nada para "${normalizedQuery}". Tenta outro termo ou percorre as categorias.`}
        action={
          <Button asChild variant="outline">
            <Link href="/#categorias">Ver categorias</Link>
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-5">
      <p
        role="status"
        aria-live="polite"
        className="text-sm tabular-nums text-muted-foreground"
      >
        {isBrowsingAll
          ? `${formatProductCount(products.length)}${
              hasActiveFilters ? " com estes filtros." : " na wishlist."
            }`
          : `${formatProductCount(products.length)} para "${normalizedQuery}".`}
      </p>
      <ProductGrid products={products} />
    </div>
  );
}
