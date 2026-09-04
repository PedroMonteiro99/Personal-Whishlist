import { describe, expect, it } from "vitest";

import {
  collectContentProblems,
  type ContentEntry,
} from "@/lib/content/integrity";
import type { Category, Product, Store } from "@/lib/content/schemas";

function entry<T>(filePath: string, data: T): ContentEntry<T> {
  return { filePath, data, body: "" };
}

const categorias = [
  entry("content/categories/setup.mdx", {
    name: "Setup",
    slug: "setup",
    order: 0,
  } as Category),
];

const lojas = [
  entry("content/stores/amazon.mdx", {
    name: "Amazon",
    slug: "amazon",
    url: "https://amazon.es",
  } as Store),
];

function produto(overrides: Partial<Product> & { slug: string }) {
  return entry(`content/wishlist/setup/${overrides.slug}.mdx`, {
    name: overrides.slug,
    category: "setup",
    stores: [{ store: "amazon", url: "https://amazon.es/x" }],
    currency: "EUR",
    priority: "medium",
    favorite: false,
    images: [],
    ...overrides,
  } as Product);
}

describe("collectContentProblems", () => {
  it("conteúdo coerente não produz problemas", () => {
    expect(
      collectContentProblems([produto({ slug: "benq" })], categorias, lojas),
    ).toEqual([]);
  });

  it("apanha uma categoria inexistente e nomeia o ficheiro", () => {
    const problemas = collectContentProblems(
      [produto({ slug: "benq", category: "nao-existe" })],
      categorias,
      lojas,
    );

    expect(problemas).toHaveLength(1);
    expect(problemas[0]).toContain("content/wishlist/setup/benq.mdx");
    expect(problemas[0]).toContain("nao-existe");
  });

  it("apanha uma loja inexistente", () => {
    const problemas = collectContentProblems(
      [
        produto({
          slug: "benq",
          stores: [{ store: "fantasma", url: "https://x.pt/y" }],
        }),
      ],
      categorias,
      lojas,
    );

    expect(problemas).toHaveLength(1);
    expect(problemas[0]).toContain("fantasma");
  });

  it("apanha slugs de produto duplicados", () => {
    const problemas = collectContentProblems(
      [produto({ slug: "benq" }), produto({ slug: "benq" })],
      categorias,
      lojas,
    );

    expect(problemas).toHaveLength(1);
    expect(problemas[0]).toContain("já é usado por");
  });

  it("apanha a mesma loja repetida no mesmo produto", () => {
    const problemas = collectContentProblems(
      [
        produto({
          slug: "benq",
          stores: [
            { store: "amazon", url: "https://amazon.es/a" },
            { store: "amazon", url: "https://amazon.es/b" },
          ],
        }),
      ],
      categorias,
      lojas,
    );

    expect(problemas).toHaveLength(1);
    expect(problemas[0]).toContain("repetida");
  });

  it("uma loja inexistente e repetida só é reportada uma vez como repetida", () => {
    // Reportar duas vezes 'não existe' para a mesma loja era ruído.
    const problemas = collectContentProblems(
      [
        produto({
          slug: "benq",
          stores: [
            { store: "fantasma", url: "https://x.pt/a" },
            { store: "fantasma", url: "https://x.pt/b" },
          ],
        }),
      ],
      categorias,
      lojas,
    );

    expect(problemas.filter((p) => p.includes("não existe"))).toHaveLength(1);
    expect(problemas.filter((p) => p.includes("repetida"))).toHaveLength(1);
  });

  it("acumula vários problemas em vez de parar no primeiro", () => {
    const problemas = collectContentProblems(
      [
        produto({
          slug: "benq",
          category: "nao-existe",
          stores: [{ store: "fantasma", url: "https://x.pt/y" }],
        }),
      ],
      categorias,
      lojas,
    );

    expect(problemas).toHaveLength(2);
  });
});
