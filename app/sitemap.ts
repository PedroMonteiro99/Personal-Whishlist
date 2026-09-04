import type { MetadataRoute } from "next";

import { getCatalogData } from "@/lib/catalog";
import { absoluteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { categories, products, receivedProducts } = await getCatalogData();

  const productCountByCategory = new Map<string, number>();

  for (const product of products) {
    productCountByCategory.set(
      product.category,
      (productCountByCategory.get(product.category) ?? 0) + 1,
    );
  }

  const lastModified = new Date();

  return [
    {
      url: absoluteUrl("/"),
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    // `/pesquisa` fica de fora: está proibida no robots.txt e listá-la aqui
    // seria dar instruções contraditórias ao motor de busca.
    // Categorias vazias também não entram: seriam páginas sem nada para indexar.
    ...(receivedProducts.length > 0
      ? [
          {
            url: absoluteUrl("/recebidos"),
            lastModified,
            changeFrequency: "monthly" as const,
            priority: 0.3,
          },
        ]
      : []),
    ...categories
      .filter(
        (category) => (productCountByCategory.get(category.slug) ?? 0) > 0,
      )
      .map((category) => ({
        url: absoluteUrl(`/categoria/${category.slug}`),
        lastModified,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      })),
    ...products.map((product) => ({
      url: absoluteUrl(`/produto/${product.slug}`),
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
