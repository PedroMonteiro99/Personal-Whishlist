import Link from "next/link";

import { ProductGrid } from "@/components/ProductGrid";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CategoryGrid } from "@/features/wishlist/components/CategoryGrid";
import { getHomeData } from "@/features/wishlist/lib/get-home-data";

export default async function HomePage() {
  const { categories, products, featuredProducts } = await getHomeData();
  const heroProducts = featuredProducts.slice(0, 6);

  return (
    <div className="relative overflow-hidden">
      <section className="mx-auto w-full max-w-6xl px-4 pb-20 pt-14 sm:px-6 lg:px-8 lg:pb-24 lg:pt-20">
        <div className="grid items-start gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge
                variant="secondary"
                className="px-3 py-1 text-xs uppercase tracking-[0.25em]"
              >
                Wishlist Premium V1
              </Badge>
              <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
                Uma wishlist pública com aspeto de produto premium.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                Construída para começar simples, manter o conteúdo no Git e
                crescer sem refazer a base. A experiência é pensada para quem
                consulta e para quem mantém.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <Link href="#destaques">Ver destaques</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="#categorias">Ver categorias</Link>
              </Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <Card className="border-border/70 bg-card/80 backdrop-blur">
                <CardContent className="p-5">
                  <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                    Produtos
                  </p>
                  <p className="mt-2 text-2xl font-semibold">
                    {products.length.toString().padStart(2, "0")}
                  </p>
                </CardContent>
              </Card>
              <Card className="border-border/70 bg-card/80 backdrop-blur">
                <CardContent className="p-5">
                  <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                    Categorias
                  </p>
                  <p className="mt-2 text-2xl font-semibold">
                    {categories.length.toString().padStart(2, "0")}
                  </p>
                </CardContent>
              </Card>
              <Card className="border-border/70 bg-card/80 backdrop-blur">
                <CardContent className="p-5">
                  <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                    Destaques
                  </p>
                  <p className="mt-2 text-2xl font-semibold">
                    {heroProducts.length.toString().padStart(2, "0")}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          <Card className="relative overflow-hidden border-border/70 bg-card/90 shadow-xl shadow-primary/5">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.16),transparent_42%),radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.12),transparent_36%)]" />
            <CardHeader className="relative">
              <CardTitle>Destaques da wishlist</CardTitle>
              <CardDescription>
                Favoritos e prioridades altas preparados para entrar no fluxo
                público da V1.
              </CardDescription>
            </CardHeader>
            <CardContent className="relative">
              <ProductGrid products={heroProducts} />
            </CardContent>
          </Card>
        </div>
      </section>

      <section
        id="categorias"
        className="mx-auto w-full max-w-6xl px-4 pb-20 sm:px-6 lg:px-8"
      >
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
              Categorias
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight">
              Organização por tema
            </h2>
          </div>
          <Button asChild variant="outline" className="hidden sm:inline-flex">
            <Link href="/pesquisa">Pesquisar</Link>
          </Button>
        </div>

        <CategoryGrid categories={categories} products={products} />
      </section>
    </div>
  );
}
