import type { Metadata } from "next";

import { SearchBar } from "@/features/search/components/SearchBar";
import { SearchResults } from "@/features/search/components/SearchResults";
import { getSearchResults } from "@/features/search/lib/search-products";

type SearchPageProps = Readonly<{
  searchParams?: Promise<{ q?: string | string[] }>;
}>;

export const metadata: Metadata = {
  title: "Pesquisa | Wishlist Premium",
  description: "Pesquisa de produtos, categorias e lojas na wishlist.",
};

function normalizeQuery(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }

  return value ?? "";
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await (searchParams ??
    Promise.resolve({} as { q?: string | string[] }));
  const query = normalizeQuery(params?.q);
  const { products } = await getSearchResults(query);

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <div className="space-y-8">
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
            Pesquisa
          </p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Encontrar rapidamente um produto
          </h1>
          <p className="max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
            Procura por nome, categoria, loja ou notas pessoais.
          </p>
        </div>

        <SearchBar query={query} />
        <SearchResults query={query} products={products} />
      </div>
    </section>
  );
}
