"use client";

import { useEffect, useState } from "react";

import { ArrowUpRight, Gift } from "lucide-react";
import Link from "next/link";

import { Card, CardContent } from "@/components/ui/card";
import { useReservations } from "@/features/reservations/components/ReservationsProvider";
import {
  fetchReservations,
  getReservationToken,
  type Reservation,
} from "@/features/reservations/lib/reservations-api";

export type ArchivedProduct = { slug: string; name: string };

/**
 * Os presentes recebidos numa ocasião já fechada.
 *
 * Os produtos vêm do MDX (estáticos); os nomes de quem ofereceu são carregados
 * à parte, e só quando o modo dono está ativo — as reservas de ocasiões
 * passadas não interessam a mais ninguém, e o provider global só conhece a
 * ocasião aberta.
 */
export function OccasionArchive({
  occasionSlug,
  products,
}: {
  occasionSlug: string;
  products: ArchivedProduct[];
}) {
  const { status, ownerMode } = useReservations();
  const [givers, setGivers] = useState<Map<string, Reservation>>(new Map());

  const showGivers = ownerMode && status !== "disabled" && status !== "error";

  useEffect(() => {
    if (!showGivers) {
      return;
    }

    let cancelled = false;

    fetchReservations(occasionSlug, getReservationToken())
      .then((rows) => {
        if (!cancelled) {
          setGivers(new Map(rows.map((row) => [row.productSlug, row])));
        }
      })
      .catch(() => {
        // Sem os nomes, a lista de presentes continua a fazer sentido.
      });

    return () => {
      cancelled = true;
    };
  }, [occasionSlug, showGivers]);

  return (
    <Card className="border-border/70 bg-card/80">
      <CardContent className="space-y-3 p-5">
        {products.map((product) => {
          const giver = showGivers ? givers.get(product.slug) : undefined;

          return (
            <Link
              key={product.slug}
              href={`/produto/${product.slug}`}
              className="flex items-center justify-between gap-4 rounded-2xl border border-border/70 bg-background/60 px-4 py-3 text-sm transition-colors hover:border-primary/40 hover:bg-background"
            >
              <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <Gift
                  aria-hidden
                  className="size-4 shrink-0 text-muted-foreground"
                />
                <span className="font-medium text-foreground">
                  {product.name}
                </span>
                {giver ? (
                  <span className="text-muted-foreground">
                    — oferecido por{" "}
                    <span className="text-foreground">
                      {giver.reserverName}
                    </span>
                  </span>
                ) : null}
              </span>
              <ArrowUpRight
                aria-hidden
                className="size-4 shrink-0 text-muted-foreground"
              />
            </Link>
          );
        })}
      </CardContent>
    </Card>
  );
}
