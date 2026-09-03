import type { Metadata } from "next";

import { Filters } from "@/features/filters/components/Filters";
import {
  applyProductFilters,
  countActiveFilters,
  firstParam,
  parseProductFilters,
  type SearchParamsInput,
} from "@/features/filters/lib/product-filters";
import { SearchBar } from "@/features/search/components/SearchBar";
import { SearchResults } from "@/features/search/components/SearchResults";
import { getSearchResults } from "@/features/search/lib/search-products";

type SearchPageProps = Readonly<{
  searchParams?: Promise<SearchParamsInput>;
}>;

export const metadata: Metadata = {
  title: "Pesquisar",
  description: "Procura produtos, categorias e lojas na wishlist.",
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await (searchParams ??
    Promise.resolve({} as SearchParamsInput));
  const query = firstParam(params?.q) ?? "";
  const filters = parseProductFilters(params);

  const { products, isBrowsingAll, stores, categories } =
    await getSearchResults(query);
  const visibleProducts = applyProductFilters(products, filters);

  const activeFilterCount = countActiveFilters(filters);
  const resetHref = query.trim()
    ? `/pesquisa?q=${encodeURIComponent(query.trim())}`
    : "/pesquisa";

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <div className="space-y-8">
        <div className="space-y-4">
          <h1 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Pesquisar
          </h1>
          <p className="max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
            Procura por nome, categoria, loja ou notas pessoais — ou filtra a
            lista completa por orçamento e loja.
          </p>
        </div>

        <div className="space-y-4">
          <SearchBar query={query} />
          {products.length > 0 || activeFilterCount > 0 ? (
            <Filters
              filters={filters}
              stores={stores}
              categories={categories}
            />
          ) : null}
        </div>

        <SearchResults
          query={query}
          products={visibleProducts}
          isBrowsingAll={isBrowsingAll}
          hasActiveFilters={activeFilterCount > 0}
          resetHref={resetHref}
        />
      </div>
    </section>
  );
}
