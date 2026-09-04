import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { Filters } from "@/features/filters/components/Filters";
import type { ProductFilters } from "@/features/filters/lib/product-filters";
import {
  lastNavigation,
  lastNavigationParams,
  replace,
  resetNavigation,
  setLocation,
} from "@/lib/test-navigation";

vi.mock("next/navigation", async () => {
  const { navigationMock } = await import("@/lib/test-navigation");

  return navigationMock;
});

const stores = [
  { slug: "amazon", name: "Amazon" },
  { slug: "pc-diga", name: "PC Diga" },
];

const categories = [
  { slug: "setup", name: "Setup" },
  { slug: "gaming", name: "Gaming" },
];

function renderFilters(filters: Partial<ProductFilters> = {}) {
  return render(
    <Filters
      filters={{ sort: "destaque", ...filters }}
      stores={stores}
      categories={categories}
    />,
  );
}

beforeEach(() => {
  resetNavigation();
});

describe("Filters", () => {
  it("preserva os outros parâmetros ao mudar um filtro", async () => {
    // Cada filtro só é dono do seu parâmetro: reconstruir a URL de raiz
    // apagava a loja escolhida e a pesquisa ativa.
    setLocation("/", "loja=amazon&q=teclado");
    renderFilters({ store: "amazon" });

    await userEvent.selectOptions(
      screen.getByLabelText("Categoria"),
      "gaming",
    );

    expect(lastNavigationParams()).toEqual({
      loja: "amazon",
      q: "teclado",
      categoria: "gaming",
    });
  });

  it("remove o parâmetro quando o filtro volta ao valor vazio", async () => {
    setLocation("/", "loja=amazon&categoria=gaming");
    renderFilters({ store: "amazon", category: "gaming" });

    await userEvent.selectOptions(screen.getByLabelText("Loja"), "");

    expect(lastNavigationParams()).toEqual({ categoria: "gaming" });
  });

  it("não escreve `ordenar=destaque` na URL", async () => {
    // A ordenação por defeito não é um filtro: mantê-la fora da URL evita
    // links partilhados com ruído e duplicação de conteúdo para SEO.
    setLocation("/", "ordenar=preco-asc");
    renderFilters({ sort: "preco-asc" });

    await userEvent.selectOptions(
      screen.getByLabelText("Ordenar"),
      "destaque",
    );

    expect(lastNavigation()).toBe("/");
  });

  it("limpa os filtros mas mantém a pesquisa", async () => {
    // Limpar filtros na página de pesquisa não pode deitar fora o termo
    // pesquisado — só os filtros é que são limpos.
    setLocation("/pesquisa", "q=teclado&loja=amazon&preco=50-150&ordenar=preco-asc");
    renderFilters({ store: "amazon", price: "50-150", sort: "preco-asc" });

    await userEvent.click(screen.getByRole("button", { name: "Limpar filtros" }));

    expect(lastNavigation()).toBe("/pesquisa?q=teclado");
  });

  it("esconde o botão de limpar quando não há nada ativo", () => {
    renderFilters();

    expect(
      screen.queryByRole("button", { name: "Limpar filtros" }),
    ).not.toBeInTheDocument();
  });

  it("mostra o botão de limpar quando só a ordenação mudou", () => {
    // A ordenação não conta para `countActiveFilters`, mas é estado que o
    // visitante tem de conseguir desfazer.
    renderFilters({ sort: "preco-desc" });

    expect(
      screen.getByRole("button", { name: "Limpar filtros" }),
    ).toBeInTheDocument();
  });

  it("reflete o filtro ativo no valor do campo", () => {
    renderFilters({ store: "pc-diga", price: "mais-300" });

    expect(screen.getByLabelText("Loja")).toHaveValue("pc-diga");
    expect(screen.getByLabelText("Orçamento")).toHaveValue("mais-300");
    expect(screen.getByLabelText("Prioridade")).toHaveValue("");
  });

  it("não navega enquanto o visitante não mexe em nada", () => {
    setLocation("/categoria/setup", "loja=amazon");
    renderFilters({ store: "amazon" });

    expect(replace).not.toHaveBeenCalled();
  });
});
