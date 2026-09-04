import { z } from "zod";

import type { CatalogProduct } from "@/lib/catalog";
import type { Product } from "@/lib/content/schemas";

export const STORE_PARAM = "loja";
export const CATEGORY_PARAM = "categoria";
export const PRIORITY_PARAM = "prioridade";
export const PRICE_PARAM = "preco";
export const SORT_PARAM = "ordenar";

const priorityByParam: Record<string, Product["priority"]> = {
  alta: "high",
  media: "medium",
  baixa: "low",
};

export const priorityOptions = [
  { value: "alta", label: "Prioridade alta" },
  { value: "media", label: "Prioridade média" },
  { value: "baixa", label: "Prioridade baixa" },
];

export type PriceBucket = {
  value: string;
  label: string;
  min: number;
  max?: number;
};

/**
 * Faixas de orçamento pensadas para quem oferece um presente, não para retalho:
 * o visitante costuma decidir quanto quer gastar antes de decidir o quê.
 */
export const priceBuckets: PriceBucket[] = [
  { value: "ate-50", label: "Até 50 €", min: 0, max: 50 },
  { value: "50-150", label: "50 € – 150 €", min: 50, max: 150 },
  { value: "150-300", label: "150 € – 300 €", min: 150, max: 300 },
  { value: "mais-300", label: "Mais de 300 €", min: 300 },
];

export const sortOptions = [
  { value: "destaque", label: "Destaques primeiro" },
  { value: "preco-asc", label: "Preço: mais baixo primeiro" },
  { value: "preco-desc", label: "Preço: mais alto primeiro" },
];

/**
 * `searchParams` é dado externo e chega de um link partilhado: validado com Zod
 * e degradado para "sem filtro" em vez de rebentar a página (SEC-004).
 */
const filtersSchema = z.object({
  [STORE_PARAM]: z.string().min(1).optional().catch(undefined),
  [CATEGORY_PARAM]: z.string().min(1).optional().catch(undefined),
  [PRIORITY_PARAM]: z
    .enum(["alta", "media", "baixa"])
    .optional()
    .catch(undefined),
  [PRICE_PARAM]: z
    .enum(["ate-50", "50-150", "150-300", "mais-300"])
    .optional()
    .catch(undefined),
  [SORT_PARAM]: z
    .enum(["destaque", "preco-asc", "preco-desc"])
    .optional()
    .catch(undefined),
});

export type ProductFilters = {
  store?: string;
  category?: string;
  priority?: string;
  price?: string;
  sort: string;
};

export type SearchParamsInput = Record<string, string | string[] | undefined>;

export function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export function parseProductFilters(
  searchParams: SearchParamsInput = {},
): ProductFilters {
  const parsed = filtersSchema.parse({
    [STORE_PARAM]: firstParam(searchParams[STORE_PARAM]),
    [CATEGORY_PARAM]: firstParam(searchParams[CATEGORY_PARAM]),
    [PRIORITY_PARAM]: firstParam(searchParams[PRIORITY_PARAM]),
    [PRICE_PARAM]: firstParam(searchParams[PRICE_PARAM]),
    [SORT_PARAM]: firstParam(searchParams[SORT_PARAM]),
  });

  return {
    store: parsed[STORE_PARAM],
    category: parsed[CATEGORY_PARAM],
    priority: parsed[PRIORITY_PARAM],
    price: parsed[PRICE_PARAM],
    sort: parsed[SORT_PARAM] ?? "destaque",
  };
}

export function matchesPriceBucket(
  price: number | undefined,
  bucket: PriceBucket,
) {
  if (typeof price !== "number") {
    return false;
  }

  if (price < bucket.min) {
    return false;
  }

  return bucket.max === undefined || price < bucket.max;
}

export function applyProductFilters(
  products: CatalogProduct[],
  filters: ProductFilters,
) {
  const bucket = priceBuckets.find((entry) => entry.value === filters.price);
  const priority = filters.priority
    ? priorityByParam[filters.priority]
    : undefined;

  const filtered = products.filter((product) => {
    if (filters.store && !product.storeSlugs.includes(filters.store)) {
      return false;
    }

    if (filters.category && product.category !== filters.category) {
      return false;
    }

    if (priority && product.priority !== priority) {
      return false;
    }

    return bucket ? matchesPriceBucket(product.lowestPrice, bucket) : true;
  });

  if (filters.sort !== "preco-asc" && filters.sort !== "preco-desc") {
    return filtered;
  }

  const direction = filters.sort === "preco-asc" ? 1 : -1;

  return [...filtered].sort((left, right) => {
    // Produtos sem preço não têm posição na ordenação: ficam sempre no fim.
    if (typeof left.lowestPrice !== "number") {
      return 1;
    }

    if (typeof right.lowestPrice !== "number") {
      return -1;
    }

    return (left.lowestPrice - right.lowestPrice) * direction;
  });
}

export function countActiveFilters(filters: ProductFilters) {
  return [filters.store, filters.category, filters.priority, filters.price].filter(
    Boolean,
  ).length;
}

export function countByPriceBucket(products: CatalogProduct[]) {
  return priceBuckets.map((bucket) => ({
    bucket,
    count: products.filter((product) =>
      matchesPriceBucket(product.lowestPrice, bucket),
    ).length,
  }));
}
