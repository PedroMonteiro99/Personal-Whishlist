/**
 * O URL público do site. É preciso em absoluto para partilha: sem ele, as
 * imagens e os links das metatags saem relativos e nenhuma app de mensagens os
 * consegue resolver.
 *
 * Ordem: variável explícita → URL de produção que a Vercel injeta → localhost.
 */
function resolveSiteUrl() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;

  if (explicit) {
    return explicit.replace(/\/+$/, "");
  }

  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;

  if (vercel) {
    return `https://${vercel}`;
  }

  return "http://localhost:3000";
}

export const SITE_URL = resolveSiteUrl();

export const SITE_NAME = "Wishlist do Pedro";

export const SITE_DESCRIPTION =
  "Ideias de presentes organizadas por categoria, com preço e link para a loja. Sempre atualizada.";

export function absoluteUrl(path = "/") {
  return new URL(path, SITE_URL).toString();
}

/**
 * O Next substitui o bloco `openGraph` do layout pelo da página, em vez de os
 * fundir. Sem isto, `og:site_name` e `og:locale` desapareciam em todas as
 * páginas que declaram metadata própria.
 */
export function openGraphDefaults() {
  return {
    type: "website" as const,
    locale: "pt_PT",
    siteName: SITE_NAME,
  };
}
