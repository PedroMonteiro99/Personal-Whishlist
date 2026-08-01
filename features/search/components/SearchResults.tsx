import { EmptyState } from "@/components/EmptyState";
import { ProductGrid } from "@/components/ProductGrid";

import type { CatalogProduct } from "@/lib/catalog";

export function SearchResults({
  query,
  products,
}: {
  query: string;
  products: CatalogProduct[];
}) {
  if (!query.trim()) {
    return (
      <EmptyState
        title="Começa a pesquisar"
        description="Escreve um termo para encontrar produtos, lojas ou categorias."
      />
    );
  }

  if (products.length === 0) {
    return (
      <EmptyState
        title="Sem resultados"
        description="Não encontrámos correspondências para esta pesquisa."
      />
    );
  }

  return <ProductGrid products={products} />;
}
