import { describe, expect, it } from "vitest";

import { productStoreSchema, storeSchema } from "@/lib/content/schemas";

describe("URLs externas do frontmatter", () => {
  it("aceita http e https", () => {
    expect(
      productStoreSchema.parse({ store: "amazon", url: "https://amazon.es/x" })
        .url,
    ).toBe("https://amazon.es/x");

    expect(
      storeSchema.parse({
        name: "Amazon",
        slug: "amazon",
        url: "http://amazon.es",
      }).url,
    ).toBe("http://amazon.es");
  });

  it.each(["javascript:alert(1)", "data:text/html,<script>alert(1)</script>"])(
    "rejeita o esquema perigoso %s",
    (url) => {
      // `.url()` do Zod aceita qualquer esquema, e este valor vai direto para
      // um `href` em StoreLink/ProductDetail (SEC-012).
      expect(productStoreSchema.safeParse({ store: "amazon", url }).success).toBe(
        false,
      );
      expect(
        storeSchema.safeParse({ name: "A", slug: "a", url }).success,
      ).toBe(false);
    },
  );

  it("continua a rejeitar o que não é um URL", () => {
    expect(
      productStoreSchema.safeParse({ store: "amazon", url: "amazon.es" })
        .success,
    ).toBe(false);
  });
});
