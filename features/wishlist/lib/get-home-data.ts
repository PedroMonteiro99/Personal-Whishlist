import { cache } from "react";

import { getCatalogData, getFeaturedProducts } from "@/lib/catalog";

export const getHomeData = cache(async () => {
  const [catalog, featuredProducts] = await Promise.all([
    getCatalogData(),
    getFeaturedProducts(),
  ]);

  return {
    ...catalog,
    featuredProducts,
  };
});
