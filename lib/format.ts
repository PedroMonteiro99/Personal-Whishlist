import type { CatalogProduct } from "@/lib/catalog";

const PRICE_LOCALE = "pt-PT";

export function formatAmount(value: number, currency: string) {
  return new Intl.NumberFormat(PRICE_LOCALE, {
    style: "currency",
    currency,
  }).format(value);
}

/**
 * Contagem de produtos com plural correto em português.
 */
export function formatProductCount(count: number) {
  return count === 1 ? "1 produto" : `${count} produtos`;
}

export function formatStoreCount(count: number) {
  return count === 1 ? "1 loja" : `${count} lojas`;
}

/**
 * O preço que o visitante vê primeiro: o mais baixo entre as lojas. Quando as
 * lojas pedem valores diferentes, é anunciado como "desde", para não prometer
 * um preço que só existe num sítio.
 */
export function formatPrice(product: CatalogProduct) {
  if (typeof product.lowestPrice !== "number") {
    return "Preço sob consulta";
  }

  const amount = formatAmount(product.lowestPrice, product.currency);

  return product.hasMultiplePrices ? `desde ${amount}` : amount;
}
