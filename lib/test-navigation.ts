import { vi } from "vitest";

/**
 * Duplo de `next/navigation` para os testes de componentes.
 *
 * A URL é a fonte de verdade dos filtros e da pesquisa (`ROUTE-005`), por isso
 * o que interessa testar é exatamente o que cada componente navega. As
 * instâncias de `router` e de `searchParams` são estáveis entre renders de
 * propósito: devolver objetos novos a cada render invalidaria os `useCallback`
 * dos componentes e criaria efeitos em cadeia que o Next real não provoca.
 */
const state = {
  pathname: "/",
  searchParams: new URLSearchParams(),
};

export const replace = vi.fn<(href: string, options?: unknown) => void>();
export const push = vi.fn<(href: string, options?: unknown) => void>();

const router = {
  replace,
  push,
  back: vi.fn(),
  forward: vi.fn(),
  refresh: vi.fn(),
  prefetch: vi.fn(),
};

export const navigationMock = {
  useRouter: () => router,
  usePathname: () => state.pathname,
  useSearchParams: () => state.searchParams,
};

/** Simula a URL onde o componente está montado. */
export function setLocation(pathname: string, search = "") {
  state.pathname = pathname;
  state.searchParams = new URLSearchParams(search);
}

export function resetNavigation() {
  setLocation("/");
  replace.mockClear();
  push.mockClear();
}

/** A última URL navegada, ou `undefined` se o componente não navegou. */
export function lastNavigation() {
  return replace.mock.calls.at(-1)?.[0];
}

/** Os parâmetros da última URL navegada, prontos a comparar sem depender da ordem. */
export function lastNavigationParams() {
  const href = lastNavigation();

  if (href === undefined) {
    throw new Error("Nenhuma navegação registada.");
  }

  const [, search = ""] = href.split("?");

  return Object.fromEntries(new URLSearchParams(search));
}
