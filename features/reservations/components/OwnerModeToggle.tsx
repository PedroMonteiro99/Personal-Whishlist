"use client";

import { useReservations } from "@/features/reservations/components/ReservationsProvider";

/**
 * O interruptor que protege a surpresa. Não é uma barreira de segurança — é
 * uma cortesia, e o Pedro é a única pessoa interessada em não ver.
 *
 * Quando está ativo mantém-se visível: sem isso, a ausência de reservas
 * pareceria uma avaria.
 */
export function OwnerModeToggle() {
  const { status, ownerMode, toggleOwnerMode } = useReservations();

  if (status === "disabled" || status === "error") {
    return null;
  }

  return (
    <button
      type="button"
      onClick={toggleOwnerMode}
      aria-pressed={ownerMode}
      className="text-left text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
    >
      {ownerMode
        ? "Modo dono ativo — as reservas estão escondidas. Mostrar."
        : "Sou o Pedro — esconder as reservas."}
    </button>
  );
}
