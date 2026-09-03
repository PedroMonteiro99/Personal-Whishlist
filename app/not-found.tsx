import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col items-start gap-6 px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
      <h1 className="max-w-2xl text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
        Não encontrámos esta página.
      </h1>
      <p className="max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
        O link pode estar desatualizado ou o produto pode já ter saído da lista.
        Volta ao início ou procura pelo nome.
      </p>
      <div className="flex flex-wrap gap-3">
        <Button asChild>
          <Link href="/">Voltar ao início</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/pesquisa">Pesquisar</Link>
        </Button>
      </div>
    </section>
  );
}
