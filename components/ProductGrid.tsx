import { EmptyState } from "@/components/EmptyState";
import { ProductCard } from "@/components/ProductCard";

import type { CatalogProduct } from "@/lib/catalog";

export function ProductGrid({
  products,
  emptyTitle = "Sem produtos",
  emptyDescription = "Ainda não há produtos para apresentar nesta vista.",
}: {
  products: CatalogProduct[];
  emptyTitle?: string;
  emptyDescription?: string;
}) {
  if (products.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.slug} product={product} />
      ))}
    </div>
  );
}
