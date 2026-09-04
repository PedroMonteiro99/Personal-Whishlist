import { z } from "zod";

/**
 * Acesso às reservas por `fetch` direto ao PostgREST, sem o SDK do Supabase.
 *
 * São três chamadas RPC: trazer o SDK inteiro para isto custaria mais do que a
 * funcionalidade pesa, num site cujo valor é ser estático e rápido.
 *
 * A chave anónima é pública por desenho — a tabela tem RLS sem políticas, e as
 * funções `security definer` são a única superfície exposta (ver a migração
 * `0004_reservations.sql`).
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const TOKEN_KEY = "wishlist-reservation-token";
const OWNER_MODE_KEY = "wishlist-owner-mode";

export const MAX_NAME_LENGTH = 40;

/**
 * Sem configuração, a funcionalidade simplesmente não existe: a interface não
 * a mostra e o resto do site continua a funcionar.
 */
export function areReservationsEnabled() {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
}

const reservationSchema = z.object({
  product_slug: z.string(),
  reserver_name: z.string(),
  created_at: z.string(),
  is_mine: z.boolean(),
});

const reservationListSchema = z.array(reservationSchema);

export type Reservation = {
  productSlug: string;
  reserverName: string;
  isMine: boolean;
};

/**
 * O token identifica o browser, não a pessoa. Fica só aqui; ao servidor vai
 * apenas para ser comparado com o hash guardado.
 */
export function getReservationToken() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const existing = window.localStorage.getItem(TOKEN_KEY);

    if (existing) {
      return existing;
    }

    const token = `${crypto.randomUUID()}${crypto.randomUUID()}`;
    window.localStorage.setItem(TOKEN_KEY, token);

    return token;
  } catch {
    // Sem storage não há reservas persistentes, mas o site não parte.
    return null;
  }
}

export function isOwnerMode() {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    return window.localStorage.getItem(OWNER_MODE_KEY) === "on";
  } catch {
    return false;
  }
}

export function setOwnerMode(enabled: boolean) {
  try {
    window.localStorage.setItem(OWNER_MODE_KEY, enabled ? "on" : "off");
  } catch {
    // Sem storage o modo não persiste; não há mais nada a fazer.
  }
}

async function callRpc(fn: string, body: Record<string, unknown>) {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error("Reservas não configuradas.");
  }

  const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${fn}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Pedido falhou (${response.status})`);
  }

  return response.json();
}

export async function fetchReservations(
  occasion: string,
  token: string | null,
): Promise<Reservation[]> {
  const data = await callRpc("list_reservations", {
    p_occasion: occasion,
    p_token: token,
  });
  const parsed = reservationListSchema.safeParse(data);

  if (!parsed.success) {
    throw new Error("Resposta inesperada do servidor.");
  }

  return parsed.data.map((row) => ({
    productSlug: row.product_slug,
    reserverName: row.reserver_name,
    isMine: row.is_mine,
  }));
}

/** `false` significa que alguém se antecipou entre o carregamento e o clique. */
export async function reserveProduct(
  productSlug: string,
  name: string,
  token: string,
  occasion: string,
): Promise<boolean> {
  const data = await callRpc("reserve_product", {
    p_slug: productSlug,
    p_name: name,
    p_token: token,
    p_occasion: occasion,
  });

  return data === true;
}

export async function releaseProduct(
  productSlug: string,
  token: string,
  occasion: string,
): Promise<boolean> {
  const data = await callRpc("release_product", {
    p_slug: productSlug,
    p_token: token,
    p_occasion: occasion,
  });

  return data === true;
}
