import { EmptyState } from "@/components/EmptyState";
import { ProductCard } from "@/components/ProductCard";

import type { CatalogProduct } from "@/lib/catalog";

export function ProductGrid({ products }: { products: CatalogProduct[] }) {
  if (products.length === 0) {
    return (
      <EmptyState
        title="Sem produtos"
        description="Ainda não há produtos para apresentar nesta vista."
      />
    );
  }

  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.slug} product={product} />
      ))}
    </div>
  );
}
