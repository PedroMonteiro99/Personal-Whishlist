import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // A pesquisa gera combinações infinitas de filtros; não há nada
      // para indexar aí que as páginas de categoria não cubram melhor.
      disallow: "/pesquisa",
    },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
