import { describe, expect, it } from "vitest";

import { makeProduct, makeStore } from "@/lib/test-factories";
import { breadcrumbJsonLd, productJsonLd } from "@/lib/structured-data";

describe("productJsonLd", () => {
  it("uma loja com preço vira uma Offer simples", () => {
    const dados = productJsonLd(
      makeProduct({
        slug: "benq",
        name: "BenQ ScreenBar Pro",
        storeEntries: [makeStore("amazon", 129.99, "Amazon")],
      }),
    );

    expect(dados["@type"]).toBe("Product");
    expect(dados.offers).toMatchObject({
      "@type": "Offer",
      price: 129.99,
      priceCurrency: "EUR",
      seller: { "@type": "Organization", name: "Amazon" },
    });
  });

  it("várias lojas viram um AggregateOffer com mínimo e máximo", () => {
    const dados = productJsonLd(
      makeProduct({
        slug: "benq",
        storeEntries: [
          makeStore("amazon", 160.11, "Amazon"),
          makeStore("pc-diga", 139.99, "PC Diga"),
        ],
      }),
    );

    expect(dados.offers).toMatchObject({
      "@type": "AggregateOffer",
      lowPrice: 139.99,
      highPrice: 160.11,
      offerCount: 2,
    });
  });

  it("nunca declara disponibilidade de stock", () => {
    // Não sabemos o stock das lojas e o PRODUCT.md proíbe inventá-lo: um
    // 'InStock' falso é pior do que a ausência do campo.
    const serializado = JSON.stringify(
      productJsonLd(
        makeProduct({
          slug: "benq",
          storeEntries: [
            makeStore("amazon", 160.11),
            makeStore("pc-diga", 139.99),
          ],
        }),
      ),
    );

    expect(serializado).not.toContain("availability");
    expect(serializado).not.toContain("InStock");
  });

  it("lojas sem preço ficam fora das ofertas", () => {
    const dados = productJsonLd(
      makeProduct({
        slug: "benq",
        storeEntries: [makeStore("amazon", 129.99), makeStore("worten")],
      }),
    );

    expect(dados.offers).toMatchObject({ "@type": "Offer", price: 129.99 });
  });

  it("sem preço nenhum, omite as ofertas em vez de as inventar", () => {
    const dados = productJsonLd(
      makeProduct({ slug: "benq", storeEntries: [makeStore("worten")] }),
    );

    expect(dados.offers).toBeUndefined();
  });

  it("sem imagens, omite o campo em vez de mandar um array vazio", () => {
    const dados = productJsonLd(makeProduct({ slug: "benq" }));

    expect(dados.image).toBeUndefined();
  });
});

describe("breadcrumbJsonLd", () => {
  it("numera as posições a partir de 1 e resolve URLs absolutos", () => {
    const dados = breadcrumbJsonLd([
      { name: "Início", path: "/" },
      { name: "Setup", path: "/categoria/setup" },
    ]);

    expect(dados.itemListElement).toHaveLength(2);
    expect(dados.itemListElement[0]).toMatchObject({
      position: 1,
      name: "Início",
    });
    expect(dados.itemListElement[1]).toMatchObject({
      position: 2,
      name: "Setup",
    });
    expect(dados.itemListElement[1]?.item).toMatch(
      /^https?:\/\/.+\/categoria\/setup$/,
    );
  });
});
