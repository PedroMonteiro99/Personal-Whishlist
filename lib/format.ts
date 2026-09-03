import type { CatalogProduct } from "@/lib/catalog";

const PRICE_LOCALE = "pt-PT";

/**
 * Formatação de preço partilhada pela grelha e pela página de detalhe.
 * Um produto pode não ter preço definido no frontmatter (ver `productSchema`).
 */
export function formatPrice(product: CatalogProduct) {
  if (typeof product.price !== "number") {
    return "Preço sob consulta";
  }

  return new Intl.NumberFormat(PRICE_LOCALE, {
    style: "currency",
    currency: product.currency,
  }).format(product.price);
}

/**
 * Contagem de produtos com plural correto em português.
 */
export function formatProductCount(count: number) {
  return count === 1 ? "1 produto" : `${count} produtos`;
}

/**
 * O link que o visitante deve seguir para comprar: o primeiro link explícito do
 * produto quando existe, caso contrário a página da loja.
 */
export function resolvePurchaseLink(product: CatalogProduct) {
  const [primaryLink] = product.links;

  if (primaryLink) {
    return { url: primaryLink.url, isProductLink: true };
  }

  if (product.storeUrl) {
    return { url: product.storeUrl, isProductLink: false };
  }

  return null;
}
