"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col items-start gap-6 px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
      <h1 className="max-w-2xl text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
        Alguma coisa correu mal ao carregar esta página.
      </h1>
      <p className="max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
        Foi um erro do nosso lado, não teu. Tenta novamente — se continuar,
        volta ao início.
      </p>
      <Button type="button" onClick={reset}>
        Tentar novamente
      </Button>
    </section>
  );
}
