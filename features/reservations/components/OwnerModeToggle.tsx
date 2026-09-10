"use client";

import { Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useReservations } from "@/features/reservations/components/ReservationsProvider";
import { cn } from "@/lib/utils";

/**
 * O interruptor que protege a surpresa. Não é uma barreira de segurança
 * (`SEC-016`) — é uma cortesia, e o Pedro é a única pessoa interessada em não
 * ver.
 *
 * Vive no cabeçalho, ao lado do tema, porque é a mesma categoria de coisa: uma
 * preferência de como *este* aparelho mostra o site, não conteúdo. Em rodapé
 * era uma frase pública dirigida a uma pessoa pelo nome, o que não dizia nada
 * a quem visita.
 *
 * Quando está ativo fica visivelmente ligado: sem isso, a ausência de reservas
 * pareceria uma avaria.
 */
export function OwnerModeToggle() {
  const { status, ownerMode, toggleOwnerMode } = useReservations();

  if (status === "disabled" || status === "error") {
    return null;
  }

  const label = ownerMode
    ? "Mostrar as reservas"
    : "Esconder as reservas (sou o Pedro)";

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      onClick={toggleOwnerMode}
      aria-pressed={ownerMode}
      aria-label={label}
      title={label}
      className={cn(
        "shrink-0",
        ownerMode && "border-primary/40 bg-primary/10 text-primary",
      )}
    >
      {ownerMode ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
    </Button>
  );
}
