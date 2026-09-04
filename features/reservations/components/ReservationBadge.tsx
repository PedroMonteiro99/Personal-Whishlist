"use client";

import { Check } from "lucide-react";

import { useReservations } from "@/features/reservations/components/ReservationsProvider";
import { cn } from "@/lib/utils";

/**
 * Marcador discreto na grelha: evita que alguém abra um produto que já está
 * tratado. Não aparece enquanto carrega, para não fazer piscar a grelha.
 */
export function ReservationBadge({
  productSlug,
  className,
}: {
  productSlug: string;
  className?: string;
}) {
  const { status, getReservation } = useReservations();

  if (status !== "ready") {
    return null;
  }

  const reservation = getReservation(productSlug);

  if (!reservation) {
    return null;
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-border/70 bg-background/80 px-2.5 py-0.5 text-xs font-medium text-muted-foreground backdrop-blur",
        className,
      )}
    >
      <Check aria-hidden className="size-3.5" />
      {reservation.isMine ? "Vais oferecer" : "Já tratado"}
    </span>
  );
}
