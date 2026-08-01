import { cache } from "react";

import { getProductBySlug } from "@/lib/catalog";

export const getProductPageData = cache(async (slug: string) => {
  const product = await getProductBySlug(slug);

  return { product };
});
