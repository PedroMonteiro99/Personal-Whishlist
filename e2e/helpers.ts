import type { Page, Route } from "@playwright/test";

/** As rotas públicas da V1 (`ROUTE-001`), tal como um visitante lhes chega. */
export const ROUTES = [
  { path: "/", name: "home" },
  { path: "/produto/benq-screenbar-pro", name: "produto" },
  { path: "/categoria/setup", name: "categoria" },
  { path: "/pesquisa?q=benq", name: "pesquisa" },
  { path: "/recebidos", name: "recebidos" },
] as const;

export const THEME_STORAGE_KEY = "wishlist-premium-theme";

export type Theme = "dark" | "light";

/**
 * Fixa o tema antes de a página abrir. Escrever no `localStorage` a meio da
 * navegação deixaria o primeiro render no tema errado e a captura do axe
 * mediria a combinação errada de cores.
 */
export async function usePreferredTheme(page: Page, theme: Theme) {
  await page.addInitScript(
    ([key, value]) => {
      window.localStorage.setItem(key, value);
    },
    [THEME_STORAGE_KEY, theme] as const,
  );
}

export type ReservationRow = {
  product_slug: string;
  reserver_name: string;
  created_at: string;
  is_mine: boolean;
};

type ReservationsStubOptions = {
  /** Estado inicial devolvido por `list_reservations`. */
  initial?: ReservationRow[];
  /** `false` simula alguém que se antecipou entre o carregamento e o clique. */
  reserveSucceeds?: boolean;
  releaseSucceeds?: boolean;
  /** Devolve 500 em tudo, para exercitar o caminho de erro. */
  fail?: boolean;
};

/**
 * Interceta as três RPC das reservas (`SEC-008`).
 *
 * O destino configurado no `playwright.config.ts` é falso, por isso nada sai da
 * máquina: sem esta interceção os pedidos não teriam resposta. Assim o fluxo
 * completo — reservar, ver reservado, desfazer — é determinista e não depende
 * de um Supabase real nem do estado que lá esteja.
 */
export async function stubReservations(
  page: Page,
  {
    initial = [],
    reserveSucceeds = true,
    releaseSucceeds = true,
    fail = false,
  }: ReservationsStubOptions = {},
) {
  let rows = [...initial];

  await page.route("**/rest/v1/rpc/*", async (route: Route) => {
    if (fail) {
      await route.fulfill({ status: 500, body: "stub failure" });
      return;
    }

    const url = route.request().url();
    const body = route.request().postDataJSON() ?? {};

    const json = (value: unknown) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(value),
      });

    if (url.endsWith("/list_reservations")) {
      await json(rows);
      return;
    }

    if (url.endsWith("/reserve_product")) {
      if (!reserveSucceeds) {
        await json(false);
        return;
      }

      rows = [
        ...rows,
        {
          product_slug: body.p_slug,
          reserver_name: body.p_name,
          created_at: new Date().toISOString(),
          is_mine: true,
        },
      ];
      await json(true);
      return;
    }

    if (url.endsWith("/release_product")) {
      if (!releaseSucceeds) {
        await json(false);
        return;
      }

      rows = rows.filter((row) => row.product_slug !== body.p_slug);
      await json(true);
      return;
    }

    await route.fallback();
  });
}
