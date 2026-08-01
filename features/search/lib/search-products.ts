import { cache } from "react";

import { searchProducts } from "@/lib/catalog";

export const getSearchResults = cache(async (query: string) => {
  const products = await searchProducts(query);

  return { products };
});
