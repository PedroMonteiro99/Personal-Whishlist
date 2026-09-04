import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { SearchBar } from "@/features/search/components/SearchBar";
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

/** O campo é debounced a 250ms: uma navegação nunca é imediata ao escrever. */
const DEBOUNCE_MARGIN = 400;

beforeEach(() => {
  resetNavigation();
});

describe("SearchBar", () => {
  it("não navega ao montar com uma pesquisa já na URL", async () => {
    // Sem a guarda contra o valor atual, a montagem reescrevia a URL e
    // limpava os filtros ativos de um link partilhado.
    setLocation("/pesquisa", "q=teclado&loja=amazon");
    render(<SearchBar query="teclado" />);

    await new Promise((resolve) => setTimeout(resolve, DEBOUNCE_MARGIN));

    expect(replace).not.toHaveBeenCalled();
  });

  it("não navega ao montar sem pesquisa nenhuma", async () => {
    setLocation("/", "loja=amazon");
    render(<SearchBar query="" />);

    await new Promise((resolve) => setTimeout(resolve, DEBOUNCE_MARGIN));

    expect(replace).not.toHaveBeenCalled();
  });

  it("escreve o termo na URL sem tocar nos filtros ativos", async () => {
    setLocation("/pesquisa", "loja=amazon&preco=50-150");
    render(<SearchBar query="" />);

    await userEvent.type(
      screen.getByLabelText("Pesquisar produtos"),
      "teclado",
    );

    await waitFor(() =>
      expect(lastNavigationParams()).toEqual({
        loja: "amazon",
        preco: "50-150",
        q: "teclado",
      }),
    );
  });

  it("remove o parâmetro quando o campo fica vazio", async () => {
    setLocation("/pesquisa", "q=teclado&loja=amazon");
    render(<SearchBar query="teclado" />);

    await userEvent.clear(screen.getByLabelText("Pesquisar produtos"));

    await waitFor(() =>
      expect(lastNavigation()).toBe("/pesquisa?loja=amazon"),
    );
  });

  it("ignora espaços à volta do termo", async () => {
    setLocation("/pesquisa");
    render(<SearchBar query="" />);

    await userEvent.type(
      screen.getByLabelText("Pesquisar produtos"),
      "  lego  ",
    );

    await waitFor(() => expect(lastNavigation()).toBe("/pesquisa?q=lego"));
  });

  it("navega logo ao submeter, sem esperar pelo debounce", async () => {
    setLocation("/pesquisa");
    render(<SearchBar query="" />);

    const input = screen.getByLabelText("Pesquisar produtos");

    await userEvent.type(input, "lego{Enter}");

    expect(lastNavigation()).toBe("/pesquisa?q=lego");
  });

  it("acompanha a URL quando a pesquisa muda por fora", async () => {
    // Botão de voltar ou "Limpar filtros": a URL é a fonte de verdade e o
    // campo tem de refletir o que lá está.
    setLocation("/pesquisa", "q=teclado");
    const { rerender } = render(<SearchBar query="teclado" />);

    expect(screen.getByLabelText("Pesquisar produtos")).toHaveValue("teclado");

    setLocation("/pesquisa");
    rerender(<SearchBar query="" />);

    expect(screen.getByLabelText("Pesquisar produtos")).toHaveValue("");

    await new Promise((resolve) => setTimeout(resolve, DEBOUNCE_MARGIN));

    // Acompanhar a URL não é navegar: o campo não pode responder com uma
    // navegação ao que já veio de fora.
    expect(replace).not.toHaveBeenCalled();
  });
});
