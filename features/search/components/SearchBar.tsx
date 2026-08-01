"use client";

import { useEffect, useState, useTransition } from "react";

import { Search } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";

export function SearchBar({ query }: { query: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [value, setValue] = useState(query);
  const debouncedValue = useDebounce(value, 250);

  useEffect(() => {
    setValue(query);
  }, [query]);

  useEffect(() => {
    const normalizedValue = debouncedValue.trim();
    const params = new URLSearchParams();

    if (normalizedValue) {
      params.set("q", normalizedValue);
    }

    const targetUrl = params.toString()
      ? `${pathname}?${params.toString()}`
      : pathname;

    startTransition(() => {
      router.replace(targetUrl, { scroll: false });
    });
  }, [debouncedValue, pathname, router, startTransition]);

  return (
    <form
      className="relative"
      onSubmit={(event) => {
        event.preventDefault();
        const normalizedValue = value.trim();
        const params = new URLSearchParams();

        if (normalizedValue) {
          params.set("q", normalizedValue);
        }

        const targetUrl = params.toString()
          ? `${pathname}?${params.toString()}`
          : pathname;

        router.replace(targetUrl, { scroll: false });
      }}
    >
      <label htmlFor="search" className="sr-only">
        Pesquisar produtos
      </label>
      <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        id="search"
        name="q"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Pesquisar por produto, loja ou categoria"
        className="h-12 rounded-2xl pl-11 pr-20"
        autoComplete="off"
        aria-busy={isPending}
      />
    </form>
  );
}
