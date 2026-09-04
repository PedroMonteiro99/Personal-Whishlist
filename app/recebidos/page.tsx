import type { Metadata } from "next";
import Link from "next/link";

import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { OccasionArchive } from "@/features/reservations/components/OccasionArchive";
import { getCatalogData } from "@/lib/catalog";
import { openGraphDefaults } from "@/lib/site";

export const metadata: Metadata = {
  title: "Já recebidos",
  description: "Presentes já recebidos, por ocasião.",
  alternates: { canonical: "/recebidos" },
  openGraph: {
    ...openGraphDefaults(),
    title: "Já recebidos",
    description: "Presentes já recebidos, por ocasião.",
    url: "/recebidos",
  },
};

export default async function ReceivedPage() {
  const { occasions, receivedProducts } = await getCatalogData();

  // Só ocasiões com presentes: uma ocasião vazia não tem nada para mostrar.
  const archives = occasions
    .map((occasion) => ({
      occasion,
      products: receivedProducts.filter(
        (product) => product.received === occasion.slug,
      ),
    }))
    .filter(({ products }) => products.length > 0);

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <div className="space-y-8">
        <div className="space-y-4">
          <h1 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Já recebidos
          </h1>
          <p className="max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
            O que já foi oferecido, por ocasião. Estes continuam a ter página,
            mas saíram da lista.
          </p>
        </div>

        {archives.length === 0 ? (
          <EmptyState
            title="Ainda nada recebido"
            description="Quando um presente for oferecido e marcado como recebido, aparece aqui."
            action={
              <Button asChild variant="outline">
                <Link href="/">Voltar à wishlist</Link>
              </Button>
            }
          />
        ) : (
          <div className="space-y-10">
            {archives.map(({ occasion, products }) => (
              <div key={occasion.slug} className="space-y-4">
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <h2 className="text-2xl font-semibold tracking-tight">
                    {occasion.name}
                  </h2>
                  <p className="text-sm tabular-nums text-muted-foreground">
                    {products.length === 1
                      ? "1 presente"
                      : `${products.length} presentes`}
                  </p>
                </div>
                <OccasionArchive
                  occasionSlug={occasion.slug}
                  products={products.map((product) => ({
                    slug: product.slug,
                    name: product.name,
                  }))}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
