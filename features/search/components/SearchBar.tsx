"use client";

import { useCallback, useEffect, useState, useTransition } from "react";

import { Loader2, Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";

export function SearchBar({
  query,
  autoFocus = false,
}: {
  query: string;
  autoFocus?: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [value, setValue] = useState(query);
  const [syncedQuery, setSyncedQuery] = useState(query);
  const debouncedValue = useDebounce(value, 250);

  // A URL é a fonte de verdade: quando muda por fora (botão de voltar, "Limpar
  // filtros"), o campo acompanha. Ajustar durante o render, em vez de num
  // efeito, evita o render em cascata que um `setState` em efeito provoca.
  if (query !== syncedQuery) {
    setSyncedQuery(query);
    setValue(query);
  }

  const commit = useCallback(
    (nextQuery: string) => {
      // Preservar todos os outros parâmetros: este campo só é dono do `q`.
      // Reconstruir a URL de raiz apagaria os filtros ativos.
      const params = new URLSearchParams(searchParams.toString());

      if (nextQuery) {
        params.set("q", nextQuery);
      } else {
        params.delete("q");
      }

      const search = params.toString();

      startTransition(() => {
        router.replace(search ? `${pathname}?${search}` : pathname, {
          scroll: false,
        });
      });
    },
    [pathname, router, searchParams],
  );

  useEffect(() => {
    const normalizedValue = debouncedValue.trim();

    // Sem alteração face à URL atual não há nada a navegar — sem esta guarda,
    // a montagem do componente reescrevia a URL e limpava os filtros ativos.
    if (normalizedValue === (searchParams.get("q") ?? "")) {
      return;
    }

    commit(normalizedValue);
  }, [commit, debouncedValue, searchParams]);

  return (
    <form
      className="relative"
      onSubmit={(event) => {
        event.preventDefault();
        commit(value.trim());
      }}
    >
      <label htmlFor="search" className="sr-only">
        Pesquisar produtos
      </label>
      <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        id="search"
        name="q"
        type="search"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Pesquisar por produto, loja ou categoria"
        className="h-12 rounded-2xl pl-11 pr-12"
        autoComplete="off"
        // Chegando pelo ícone do cabeçalho, o campo já está pronto a escrever.
        autoFocus={autoFocus}
        aria-busy={isPending}
      />
      {isPending ? (
        <Loader2
          aria-hidden
          className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 animate-spin text-muted-foreground"
        />
      ) : null}
    </form>
  );
}
