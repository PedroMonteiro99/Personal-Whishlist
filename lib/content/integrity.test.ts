import { describe, expect, it } from "vitest";

import {
  collectContentProblems,
  collectOccasionProblems,
  type ContentEntry,
} from "@/lib/content/integrity";
import type {
  Category,
  Occasion,
  Product,
  Store,
} from "@/lib/content/schemas";

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

const ocasioes = [
  entry("content/occasions/natal-2026.mdx", {
    name: "Natal 2026",
    slug: "natal-2026",
    date: "2026-12-25",
    status: "aberta",
  } as Occasion),
];

function ocasiao(slug: string, status: Occasion["status"], date = "2026-12-25") {
  return entry(`content/occasions/${slug}.mdx`, {
    name: slug,
    slug,
    date,
    status,
  } as Occasion);
}

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
      collectContentProblems([produto({ slug: "benq" })], categorias, lojas, ocasioes),
    ).toEqual([]);
  });

  it("apanha uma categoria inexistente e nomeia o ficheiro", () => {
    const problemas = collectContentProblems([produto({ slug: "benq", category: "nao-existe" })], categorias, lojas, ocasioes);

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
      ocasioes,
    );

    expect(problemas).toHaveLength(1);
    expect(problemas[0]).toContain("fantasma");
  });

  it("apanha slugs de produto duplicados", () => {
    const problemas = collectContentProblems([produto({ slug: "benq" }), produto({ slug: "benq" })], categorias, lojas, ocasioes);

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
      ocasioes,
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
      ocasioes,
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
      ocasioes,
    );

    expect(problemas).toHaveLength(2);
  });

  it("apanha uma ocasião de recebimento inexistente", () => {
    const problemas = collectContentProblems(
      [produto({ slug: "benq", received: "pascoa-1999" })],
      categorias,
      lojas,
      ocasioes,
    );

    expect(problemas).toHaveLength(1);
    expect(problemas[0]).toContain("pascoa-1999");
  });

  it("aceita um produto recebido numa ocasião que existe", () => {
    expect(
      collectContentProblems(
        [produto({ slug: "benq", received: "natal-2026" })],
        categorias,
        lojas,
        ocasioes,
      ),
    ).toEqual([]);
  });
});

describe("collectOccasionProblems", () => {
  it("exatamente uma ocasião aberta é o estado válido", () => {
    expect(collectOccasionProblems(ocasioes)).toEqual([]);
  });

  it("sem ocasiões nenhumas, avisa", () => {
    // As reservas não teriam onde aterrar.
    expect(collectOccasionProblems([])).toHaveLength(1);
  });

  it("nenhuma aberta é um erro", () => {
    const problemas = collectOccasionProblems([
      ocasiao("natal-2025", "fechada"),
    ]);

    expect(problemas).toHaveLength(1);
    expect(problemas[0]).toContain("nenhuma ocasião está aberta");
  });

  it("duas abertas é um erro, e nomeia-as", () => {
    const problemas = collectOccasionProblems([
      ocasiao("natal-2026", "aberta"),
      ocasiao("aniversario-2026", "aberta"),
    ]);

    expect(problemas).toHaveLength(1);
    expect(problemas[0]).toContain("natal-2026");
    expect(problemas[0]).toContain("aniversario-2026");
  });

  it("uma aberta com várias fechadas é válido", () => {
    expect(
      collectOccasionProblems([
        ocasiao("natal-2025", "fechada", "2025-12-25"),
        ocasiao("natal-2026", "aberta"),
        ocasiao("aniversario-2026", "fechada", "2026-06-01"),
      ]),
    ).toEqual([]);
  });
});
