import { describe, expect, it } from "vitest";

import {
  applyProductFilters,
  countActiveFilters,
  countByPriceBucket,
  matchesPriceBucket,
  parseProductFilters,
  priceBuckets,
} from "@/features/filters/lib/product-filters";
import { makeProduct, makeStore } from "@/lib/test-factories";

const benq = makeProduct({
  slug: "benq",
  category: "setup",
  priority: "high",
  storeEntries: [makeStore("amazon", 160.11), makeStore("pc-diga", 139.99)],
});

const cpu = makeProduct({
  slug: "cpu",
  category: "gaming",
  priority: "high",
  storeEntries: [makeStore("amazon", 531.5)],
});

const semPreco = makeProduct({
  slug: "sem-preco",
  category: "gaming",
  priority: "low",
  storeEntries: [makeStore("worten")],
});

const catalogo = [benq, cpu, semPreco];

describe("parseProductFilters", () => {
  it("aceita filtros válidos", () => {
    expect(
      parseProductFilters({ loja: "amazon", preco: "50-150", ordenar: "preco-asc" }),
    ).toMatchObject({ store: "amazon", price: "50-150", sort: "preco-asc" });
  });

  it("ignora valores inválidos em vez de rebentar", () => {
    // Vem de um link partilhado: nunca pode derrubar a página (SEC-004).
    const filtros = parseProductFilters({
      preco: "lixo-invalido",
      prioridade: "urgentissima",
      ordenar: "por-cor",
    });

    expect(filtros.price).toBeUndefined();
    expect(filtros.priority).toBeUndefined();
    expect(filtros.sort).toBe("destaque");
  });

  it("usa o primeiro valor quando o parâmetro vem repetido", () => {
    expect(parseProductFilters({ loja: ["amazon", "fnac"] }).store).toBe("amazon");
  });

  it("sem parâmetros, ordena por destaque e não filtra nada", () => {
    const filtros = parseProductFilters({});

    expect(filtros.sort).toBe("destaque");
    expect(countActiveFilters(filtros)).toBe(0);
  });
});

describe("applyProductFilters — loja", () => {
  it("encontra um produto por qualquer uma das suas lojas", () => {
    // A regressão original: o filtro comparava com uma única loja e um produto
    // multi-loja só era encontrado pela primeira.
    const porAmazon = applyProductFilters(catalogo, {
      store: "amazon",
      sort: "destaque",
    });
    const porPcDiga = applyProductFilters(catalogo, {
      store: "pc-diga",
      sort: "destaque",
    });

    expect(porAmazon.map((p) => p.slug)).toEqual(["benq", "cpu"]);
    expect(porPcDiga.map((p) => p.slug)).toEqual(["benq"]);
  });

  it("uma loja sem produtos devolve vazio", () => {
    expect(
      applyProductFilters(catalogo, { store: "fnac", sort: "destaque" }),
    ).toEqual([]);
  });
});

describe("applyProductFilters — orçamento", () => {
  it("usa o preço mais baixo do produto, não o mais alto", () => {
    // O BenQ está a 160,11 na Amazon e 139,99 na PC Diga: pertence ao escalão
    // 50–150, não ao 150–300.
    const escalao = applyProductFilters(catalogo, {
      price: "50-150",
      sort: "destaque",
    });

    expect(escalao.map((p) => p.slug)).toEqual(["benq"]);
  });

  it("produtos sem preço não entram em nenhum escalão", () => {
    const todos = priceBuckets.flatMap((bucket) =>
      applyProductFilters(catalogo, { price: bucket.value, sort: "destaque" }),
    );

    expect(todos.map((p) => p.slug)).not.toContain("sem-preco");
  });

  it("os limites do escalão são inclusivos em baixo e exclusivos em cima", () => {
    const bucket = priceBuckets.find((b) => b.value === "50-150")!;

    expect(matchesPriceBucket(50, bucket)).toBe(true);
    expect(matchesPriceBucket(149.99, bucket)).toBe(true);
    expect(matchesPriceBucket(150, bucket)).toBe(false);
    expect(matchesPriceBucket(49.99, bucket)).toBe(false);
    expect(matchesPriceBucket(undefined, bucket)).toBe(false);
  });
});

describe("applyProductFilters — ordenação", () => {
  it("ordena por preço mais baixo primeiro", () => {
    const ordenado = applyProductFilters(catalogo, { sort: "preco-asc" });

    expect(ordenado.map((p) => p.slug)).toEqual(["benq", "cpu", "sem-preco"]);
  });

  it("ordena por preço mais alto primeiro", () => {
    const ordenado = applyProductFilters(catalogo, { sort: "preco-desc" });

    expect(ordenado.map((p) => p.slug)).toEqual(["cpu", "benq", "sem-preco"]);
  });

  it("produtos sem preço ficam no fim nas duas direções", () => {
    for (const sort of ["preco-asc", "preco-desc"]) {
      const ordenado = applyProductFilters(catalogo, { sort });

      expect(ordenado.at(-1)?.slug).toBe("sem-preco");
    }
  });

  it("'destaque' preserva a ordem que vem do catálogo", () => {
    expect(
      applyProductFilters(catalogo, { sort: "destaque" }).map((p) => p.slug),
    ).toEqual(["benq", "cpu", "sem-preco"]);
  });

  it("não altera o array recebido", () => {
    const original = [...catalogo];
    applyProductFilters(catalogo, { sort: "preco-desc" });

    expect(catalogo).toEqual(original);
  });
});

describe("applyProductFilters — combinações", () => {
  it("acumula filtros em vez de os substituir", () => {
    const resultado = applyProductFilters(catalogo, {
      store: "amazon",
      category: "gaming",
      priority: "alta",
      sort: "destaque",
    });

    expect(resultado.map((p) => p.slug)).toEqual(["cpu"]);
  });

  it("conta apenas os filtros, nunca a ordenação", () => {
    expect(
      countActiveFilters({ store: "amazon", price: "50-150", sort: "preco-asc" }),
    ).toBe(2);
  });
});

describe("countByPriceBucket", () => {
  it("conta produtos por escalão usando o preço mais baixo", () => {
    const contagens = Object.fromEntries(
      countByPriceBucket(catalogo).map(({ bucket, count }) => [
        bucket.value,
        count,
      ]),
    );

    expect(contagens).toEqual({
      "ate-50": 0,
      "50-150": 1,
      "150-300": 0,
      "mais-300": 1,
    });
  });
});
