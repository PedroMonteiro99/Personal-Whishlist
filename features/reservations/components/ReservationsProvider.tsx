"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";

import {
  areReservationsEnabled,
  fetchReservations,
  getReservationToken,
  isOwnerMode,
  releaseProduct,
  reserveProduct,
  setOwnerMode,
  type Reservation,
} from "@/features/reservations/lib/reservations-api";

type Status = "disabled" | "loading" | "ready" | "error";

type ReservationsContextValue = {
  status: Status;
  /** `undefined` enquanto carrega, ou quando o modo dono está ativo. */
  getReservation: (productSlug: string) => Reservation | undefined;
  ownerMode: boolean;
  toggleOwnerMode: () => void;
  reserve: (productSlug: string, name: string) => Promise<ReserveResult>;
  release: (productSlug: string) => Promise<ReserveResult>;
};

export type ReserveResult =
  | { ok: true }
  | { ok: false; reason: "taken" | "failed" | "no-token" };

const ReservationsContext = createContext<ReservationsContextValue | undefined>(
  undefined,
);

// O modo dono é estado externo ao React (localStorage), partilhado por toda a
// árvore: lido com `useSyncExternalStore` para não haver render em cascata.
const ownerListeners = new Set<() => void>();

function subscribeOwnerMode(onStoreChange: () => void) {
  ownerListeners.add(onStoreChange);
  return () => ownerListeners.delete(onStoreChange);
}

function getOwnerServerSnapshot() {
  return false;
}

export function ReservationsProvider({
  occasion,
  children,
}: {
  /** A ocasião aberta, vinda do MDX pelo layout. */
  occasion: string;
  children: React.ReactNode;
}) {
  const enabled = areReservationsEnabled();
  const [status, setStatus] = useState<Status>(
    enabled ? "loading" : "disabled",
  );
  const [reservations, setReservations] = useState<Map<string, Reservation>>(
    new Map(),
  );

  const ownerMode = useSyncExternalStore(
    subscribeOwnerMode,
    isOwnerMode,
    getOwnerServerSnapshot,
  );

  const applyRows = useCallback((rows: Reservation[]) => {
    setReservations(new Map(rows.map((row) => [row.productSlug, row])));
    setStatus("ready");
  }, []);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    let cancelled = false;

    fetchReservations(occasion, getReservationToken())
      .then((rows) => {
        if (!cancelled) {
          applyRows(rows);
        }
      })
      .catch(() => {
        // As reservas são um extra: se o serviço falhar, o catálogo continua a
        // funcionar e a interface esconde a funcionalidade em vez de gritar.
        if (!cancelled) {
          setStatus("error");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [applyRows, enabled, occasion]);

  const refresh = useCallback(async () => {
    try {
      applyRows(await fetchReservations(occasion, getReservationToken()));
    } catch {
      setStatus("error");
    }
  }, [applyRows, occasion]);

  const reserve = useCallback(
    async (productSlug: string, name: string): Promise<ReserveResult> => {
      const token = getReservationToken();

      if (!token) {
        return { ok: false, reason: "no-token" };
      }

      try {
        const created = await reserveProduct(
          productSlug,
          name,
          token,
          occasion,
        );
        await refresh();

        return created ? { ok: true } : { ok: false, reason: "taken" };
      } catch {
        return { ok: false, reason: "failed" };
      }
    },
    [occasion, refresh],
  );

  const release = useCallback(
    async (productSlug: string): Promise<ReserveResult> => {
      const token = getReservationToken();

      if (!token) {
        return { ok: false, reason: "no-token" };
      }

      try {
        const removed = await releaseProduct(productSlug, token, occasion);
        await refresh();

        return removed ? { ok: true } : { ok: false, reason: "failed" };
      } catch {
        return { ok: false, reason: "failed" };
      }
    },
    [occasion, refresh],
  );

  const value = useMemo<ReservationsContextValue>(
    () => ({
      status,
      ownerMode,
      getReservation: (productSlug) =>
        ownerMode ? undefined : reservations.get(productSlug),
      toggleOwnerMode: () => {
        setOwnerMode(!isOwnerMode());

        for (const listener of ownerListeners) {
          listener();
        }
      },
      reserve,
      release,
    }),
    [ownerMode, release, reservations, reserve, status],
  );

  return (
    <ReservationsContext.Provider value={value}>
      {children}
    </ReservationsContext.Provider>
  );
}

export function useReservations() {
  const context = useContext(ReservationsContext);

  if (!context) {
    throw new Error(
      "useReservations tem de ser usado dentro de ReservationsProvider",
    );
  }

  return context;
}
