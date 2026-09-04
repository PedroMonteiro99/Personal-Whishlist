"use client";

import { useState } from "react";

import { Check, Gift, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useReservations } from "@/features/reservations/components/ReservationsProvider";
import { MAX_NAME_LENGTH } from "@/features/reservations/lib/reservations-api";

export function GiftAction({
  productSlug,
  productName,
}: {
  productSlug: string;
  productName: string;
}) {
  const { status, getReservation, reserve, release } = useReservations();
  const [name, setName] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sem serviço configurado, ou com ele em baixo, a funcionalidade não aparece
  // — o catálogo é que é o produto.
  if (status === "disabled" || status === "error") {
    return null;
  }

  if (status === "loading") {
    return (
      <Card className="border-border/70 bg-card/80">
        <CardContent className="flex items-center gap-3 p-5 text-sm text-muted-foreground">
          <Loader2 aria-hidden className="size-4 animate-spin" />
          <span role="status">A ver se já está tratado…</span>
        </CardContent>
      </Card>
    );
  }

  const reservation = getReservation(productSlug);

  const handleReserve = async () => {
    const trimmed = name.trim();

    if (!trimmed) {
      setError("Escreve o teu nome para os outros saberem que já está tratado.");
      return;
    }

    setIsPending(true);
    setError(null);

    const result = await reserve(productSlug, trimmed);

    setIsPending(false);

    if (result.ok) {
      setName("");
      return;
    }

    setError(
      result.reason === "taken"
        ? "Alguém se antecipou — este já vai ser oferecido."
        : result.reason === "no-token"
          ? "O teu browser está a bloquear o armazenamento local, e sem ele não conseguimos guardar isto."
          : "Não foi possível guardar. Tenta outra vez.",
    );
  };

  const handleRelease = async () => {
    setIsPending(true);
    setError(null);

    const result = await release(productSlug);

    setIsPending(false);

    if (!result.ok) {
      setError("Não foi possível desfazer. Tenta outra vez.");
    }
  };

  if (reservation?.isMine) {
    return (
      <Card className="border-primary/40 bg-primary/5">
        <CardContent className="flex flex-wrap items-center justify-between gap-4 p-5">
          <p className="flex items-center gap-2.5 text-sm font-medium">
            <Check aria-hidden className="size-4 text-primary" />
            Vais oferecer este.
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleRelease}
            disabled={isPending}
          >
            {isPending ? (
              <Loader2 aria-hidden className="size-4 animate-spin" />
            ) : null}
            Afinal já não vou
          </Button>
          {error ? (
            <p role="alert" className="w-full text-sm text-muted-foreground">
              {error}
            </p>
          ) : null}
        </CardContent>
      </Card>
    );
  }

  if (reservation) {
    return (
      <Card className="border-border/70 bg-card/60">
        <CardContent className="flex items-center gap-2.5 p-5 text-sm text-muted-foreground">
          <Check aria-hidden className="size-4" />
          <span>
            <span className="font-medium text-foreground">
              {reservation.reserverName}
            </span>{" "}
            já vai oferecer este. Escolhe outro para não se repetirem.
          </span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/70 bg-card/80">
      <CardContent className="space-y-4 p-5">
        <div className="space-y-1">
          <p className="text-sm font-medium">Vais oferecer este?</p>
          <p className="text-sm text-muted-foreground">
            Deixa o teu nome para ninguém repetir o presente. O Pedro não vê
            isto.
          </p>
        </div>

        <form
          className="flex flex-wrap gap-3"
          onSubmit={(event) => {
            event.preventDefault();
            void handleReserve();
          }}
        >
          <label htmlFor={`gift-name-${productSlug}`} className="sr-only">
            O teu nome
          </label>
          <Input
            id={`gift-name-${productSlug}`}
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="O teu nome"
            maxLength={MAX_NAME_LENGTH}
            autoComplete="given-name"
            className="h-10 w-full flex-1 sm:w-auto sm:min-w-48"
            aria-invalid={Boolean(error)}
          />
          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <Loader2 aria-hidden className="size-4 animate-spin" />
            ) : (
              <Gift aria-hidden className="size-4" />
            )}
            Vou oferecer
            <span className="sr-only"> {productName}</span>
          </Button>
        </form>

        {error ? (
          <p role="alert" className="text-sm text-muted-foreground">
            {error}
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}
