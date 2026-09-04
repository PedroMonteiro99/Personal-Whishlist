import { cache } from "react";

import { getCatalogData, searchProducts } from "@/lib/catalog";

export const getSearchResults = cache(async (query: string) => {
  const normalizedQuery = query.trim();
  const catalog = await getCatalogData();

  // Sem termo de pesquisa a página serve de vista "toda a wishlist",
  // que de outra forma não teria rota própria na V1.
  const products = normalizedQuery
    ? await searchProducts(normalizedQuery)
    : catalog.products;

  const storeSlugs = new Set(products.flatMap((product) => product.storeSlugs));
  const categorySlugs = new Set(products.map((product) => product.category));

  return {
    products,
    isBrowsingAll: !normalizedQuery,
    // Só ofereço filtros que ainda devolvem alguma coisa: um filtro que leva
    // sempre a zero resultados é um beco sem saída.
    stores: catalog.stores.filter((store) => storeSlugs.has(store.slug)),
    categories: catalog.categories.filter((category) =>
      categorySlugs.has(category.slug),
    ),
  };
});
