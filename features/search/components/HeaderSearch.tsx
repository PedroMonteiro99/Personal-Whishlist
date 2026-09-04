"use client";

import { useState } from "react";

import { Search } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

/**
 * Pesquisa do cabeçalho. No desktop é um campo a sério: clica-se e escreve-se,
 * sem salto de página. No telemóvel não há largura para o campo, por isso o
 * ícone leva a `/pesquisa`, onde o campo já abre em foco.
 */
export function HeaderSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const [value, setValue] = useState("");

  // A página de pesquisa tem o seu próprio campo; dois seria redundante.
  if (pathname === "/pesquisa") {
    return null;
  }

  return (
    <>
      <Button asChild variant="outline" size="icon" className="sm:hidden">
        <Link href="/pesquisa" aria-label="Pesquisar">
          <Search className="size-4" />
        </Link>
      </Button>

      <form
        role="search"
        className="relative hidden sm:block"
        onSubmit={(event) => {
          event.preventDefault();
          const query = value.trim();

          router.push(
            query ? `/pesquisa?q=${encodeURIComponent(query)}` : "/pesquisa",
          );
        }}
      >
        <label htmlFor="header-search" className="sr-only">
          Pesquisar produtos
        </label>
        <Search
          aria-hidden
          className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
        />
        <input
          id="header-search"
          type="search"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Pesquisar"
          autoComplete="off"
          className="h-10 w-40 rounded-full border border-input bg-background pl-10 pr-4 text-sm transition-[width] duration-300 placeholder:text-muted-foreground focus:w-56 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background lg:w-52 lg:focus:w-72"
        />
      </form>
    </>
  );
}
