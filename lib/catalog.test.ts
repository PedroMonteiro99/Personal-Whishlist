import { describe, expect, it } from "vitest";

import { getCatalogData, getProductBySlug, searchProducts } from "@/lib/catalog";

/**
 * Testes contra o conteúdo real em `content/`. São a rede que apanha um MDX
 * partido antes do build, e verificam a resolução de lojas de ponta a ponta.
 */

describe("getCatalogData", () => {
  it("lê o conteúdo real sem violar nenhuma regra de integridade", async () => {
    const catalogo = await getCatalogData();

    expect(catalogo.products.length).toBeGreaterThan(0);
    expect(catalogo.categories.length).toBeGreaterThan(0);
    expect(catalogo.stores.length).toBeGreaterThan(0);
  });

  it("todos os produtos apontam para categorias e lojas que existem", async () => {
    const { products, categories, stores } = await getCatalogData();
    const categorySlugs = new Set(categories.map((c) => c.slug));
    const storeSlugs = new Set(stores.map((s) => s.slug));

    for (const product of products) {
      expect(categorySlugs).toContain(product.category);

      for (const slug of product.storeSlugs) {
        expect(storeSlugs).toContain(slug);
      }
    }
  });

  it("as lojas de cada produto vêm ordenadas da mais barata para a mais cara", async () => {
    const { products } = await getCatalogData();

    for (const product of products) {
      const precos = product.storeEntries
        .map((entry) => entry.price)
        .filter((price): price is number => typeof price === "number");

      expect(precos).toEqual([...precos].sort((a, b) => a - b));
    }
  });

  it("o preço mais baixo corresponde mesmo ao mínimo das lojas", async () => {
    const { products } = await getCatalogData();

    for (const product of products) {
      const precos = product.storeEntries
        .map((entry) => entry.price)
        .filter((price): price is number => typeof price === "number");

      if (precos.length === 0) {
        expect(product.lowestPrice).toBeUndefined();
        continue;
      }

      expect(product.lowestPrice).toBe(Math.min(...precos));
    }
  });

  it("os slugs de produto são únicos", async () => {
    const { products } = await getCatalogData();
    const slugs = products.map((p) => p.slug);

    expect(new Set(slugs).size).toBe(slugs.length);
  });
});

describe("getProductBySlug", () => {
  it("devolve null para um slug inexistente em vez de rebentar", async () => {
    expect(await getProductBySlug("nao-existe-de-certeza")).toBeNull();
  });
});

describe("searchProducts", () => {
  it("uma pesquisa vazia não devolve nada", async () => {
    expect(await searchProducts("   ")).toEqual([]);
  });

  it("encontra por nome, sem depender de maiúsculas", async () => {
    const { products } = await getCatalogData();
    const alvo = products[0];

    expect(alvo).toBeDefined();

    const resultados = await searchProducts(alvo!.name.toUpperCase());

    expect(resultados.map((p) => p.slug)).toContain(alvo!.slug);
  });

  it("encontra por nome de loja", async () => {
    const { products, stores } = await getCatalogData();
    const loja = stores.find((s) =>
      products.some((p) => p.storeSlugs.includes(s.slug)),
    );

    if (!loja) {
      return;
    }

    expect((await searchProducts(loja.name)).length).toBeGreaterThan(0);
  });
});
