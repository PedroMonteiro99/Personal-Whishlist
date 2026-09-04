import { absoluteUrl, SITE_NAME } from "@/lib/site";

import type { CatalogProduct } from "@/lib/catalog";
import type { Category } from "@/lib/content/schemas";

/**
 * Dados estruturados schema.org (SEO-004).
 *
 * Nota deliberada: nenhum `availability` é declarado. Não sabemos o stock das
 * lojas e o PRODUCT.md proíbe inventá-lo — um `InStock` falso é pior do que a
 * ausência do campo.
 */
export function productJsonLd(product: CatalogProduct) {
  const priced = product.storeEntries.filter(
    (entry) => typeof entry.price === "number",
  );

  const offers = priced.map((entry) => ({
    "@type": "Offer",
    url: entry.productUrl,
    price: entry.price,
    priceCurrency: product.currency,
    seller: { "@type": "Organization", name: entry.name },
  }));

  const prices = priced.map((entry) => entry.price as number);

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.seo?.description ?? (product.body || undefined),
    image: product.availableImages.length > 0 ? product.availableImages : undefined,
    category: product.categoryName,
    url: absoluteUrl(`/produto/${product.slug}`),
    offers:
      offers.length === 0
        ? undefined
        : offers.length === 1
          ? offers[0]
          : {
              "@type": "AggregateOffer",
              priceCurrency: product.currency,
              lowPrice: Math.min(...prices),
              highPrice: Math.max(...prices),
              offerCount: offers.length,
              offers,
            },
  };
}

export function breadcrumbJsonLd(
  trail: Array<{ name: string; path: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function collectionJsonLd(
  category: Category,
  products: CatalogProduct[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: category.name,
    description: category.description,
    url: absoluteUrl(`/categoria/${category.slug}`),
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: absoluteUrl("/") },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: products.length,
      itemListElement: products.map((product, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: product.name,
        url: absoluteUrl(`/produto/${product.slug}`),
      })),
    },
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: absoluteUrl("/"),
    inLanguage: "pt-PT",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: absoluteUrl("/pesquisa?q={search_term_string}"),
      },
      "query-input": "required name=search_term_string",
    },
  };
}
