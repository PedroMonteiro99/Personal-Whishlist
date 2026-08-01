import { cache } from "react";

import { getCategoryBySlug, getProductsByCategorySlug } from "@/lib/catalog";

export const getCategoryPageData = cache(async (slug: string) => {
  const [category, products] = await Promise.all([
    getCategoryBySlug(slug),
    getProductsByCategorySlug(slug),
  ]);

  return { category, products };
});
