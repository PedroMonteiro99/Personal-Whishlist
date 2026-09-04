import { describe, expect, it } from "vitest";

import {
  formatAmount,
  formatPrice,
  formatProductCount,
  formatStoreCount,
} from "@/lib/format";
import { makeProduct, makeStore } from "@/lib/test-factories";

// O separador de milhares e o espaço antes do símbolo em pt-PT são caracteres
// não-quebráveis: normalizar evita falsos negativos difíceis de ver.
const normalizar = (valor: string) => valor.replace(/\u00a0|\u202f/g, " ");

describe("formatPrice", () => {
  it("mostra o valor exato quando só há um preço", () => {
    const produto = makeProduct({
      slug: "x",
      storeEntries: [makeStore("amazon", 129.99)],
    });

    expect(normalizar(formatPrice(produto))).toBe("129,99 €");
  });

  it("anuncia 'desde' quando as lojas pedem valores diferentes", () => {
    const produto = makeProduct({
      slug: "x",
      storeEntries: [makeStore("amazon", 160.11), makeStore("pc-diga", 139.99)],
    });

    // Sempre o mais baixo: prometer o mais alto seria mentir por defeito.
    expect(normalizar(formatPrice(produto))).toBe("desde 139,99 €");
  });

  it("não diz 'desde' quando as lojas pedem o mesmo valor", () => {
    const produto = makeProduct({
      slug: "x",
      storeEntries: [makeStore("amazon", 50), makeStore("pc-diga", 50)],
    });

    expect(normalizar(formatPrice(produto))).toBe("50,00 €");
  });

  it("sem preço nenhum, diz que é sob consulta em vez de inventar", () => {
    const produto = makeProduct({
      slug: "x",
      storeEntries: [makeStore("worten")],
    });

    expect(formatPrice(produto)).toBe("Preço sob consulta");
  });

  it("uma loja com preço e outra sem: usa a que tem", () => {
    const produto = makeProduct({
      slug: "x",
      storeEntries: [makeStore("worten"), makeStore("amazon", 99.9)],
    });

    expect(normalizar(formatPrice(produto))).toBe("99,90 €");
  });

  it("respeita a moeda do produto", () => {
    const produto = makeProduct({
      slug: "x",
      currency: "USD",
      storeEntries: [makeStore("amazon", 10)],
    });

    expect(normalizar(formatPrice(produto))).toContain("10,00");
  });
});

describe("formatAmount", () => {
  it("formata em português europeu", () => {
    expect(normalizar(formatAmount(1234.5, "EUR"))).toBe("1234,50 €");
  });
});

describe("plurais", () => {
  it("produtos", () => {
    expect(formatProductCount(0)).toBe("0 produtos");
    expect(formatProductCount(1)).toBe("1 produto");
    expect(formatProductCount(2)).toBe("2 produtos");
  });

  it("lojas", () => {
    expect(formatStoreCount(1)).toBe("1 loja");
    expect(formatStoreCount(3)).toBe("3 lojas");
  });
});
