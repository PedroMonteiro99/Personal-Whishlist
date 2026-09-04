import type { CatalogProduct, CatalogProductStore } from "@/lib/catalog";

/**
 * Fábrica de produtos para testes.
 *
 * Os campos derivados (`storeSlugs`, `lowestPrice`, `hasMultiplePrices` e a
 * ordem de `storeEntries`) são sempre calculados aqui, da mesma forma que em
 * `lib/catalog.ts`. Não são aceites como `overrides` de propósito: um teste que
 * pudesse declarar `lowestPrice: 10` com lojas a 50 estaria a validar um estado
 * que o catálogo real nunca produz.
 */
type ProductOverrides = Omit<
  Partial<CatalogProduct>,
  "storeSlugs" | "lowestPrice" | "hasMultiplePrices" | "storeEntries"
> & {
  slug: string;
  storeEntries?: CatalogProductStore[];
};

function sortByPrice(entries: CatalogProductStore[]) {
  return [...entries].sort((left, right) => {
    if (typeof left.price !== "number") {
      return typeof right.price === "number" ? 1 : 0;
    }

    if (typeof right.price !== "number") {
      return -1;
    }

    return left.price - right.price;
  });
}

export function makeProduct({
  storeEntries = [],
  ...overrides
}: ProductOverrides): CatalogProduct {
  const sorted = sortByPrice(storeEntries);
  const prices = sorted
    .map((entry) => entry.price)
    .filter((price): price is number => typeof price === "number");

  return {
    name: overrides.slug,
    category: "setup",
    stores: [],
    currency: "EUR",
    priority: "medium",
    favorite: false,
    images: [],
    body: "",
    categoryName: "Setup",
    availableImages: [],
    ...overrides,
    storeEntries: sorted,
    storeSlugs: sorted.map((entry) => entry.slug),
    lowestPrice: prices[0],
    hasMultiplePrices: new Set(prices).size > 1,
  };
}

export function makeStore(
  slug: string,
  price?: number,
  name?: string,
): CatalogProductStore {
  return {
    slug,
    name: name ?? slug,
    productUrl: `https://exemplo.pt/${slug}`,
    storeUrl: "https://exemplo.pt",
    price,
  };
}
