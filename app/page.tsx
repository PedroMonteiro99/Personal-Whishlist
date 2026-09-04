import Link from "next/link";

import { JsonLd } from "@/components/JsonLd";
import { ProductGrid } from "@/components/ProductGrid";
import { countByPriceBucket } from "@/features/filters/lib/product-filters";
import { CategoryGrid } from "@/features/wishlist/components/CategoryGrid";
import { getHomeData } from "@/features/wishlist/lib/get-home-data";
import { websiteJsonLd } from "@/lib/structured-data";

export default async function HomePage() {
  const { categories, products, featuredProducts } = await getHomeData();
  const highlighted = featuredProducts.slice(0, 6);
  const budgets = countByPriceBucket(products).filter(
    (entry) => entry.count > 0,
  );

  return (
    <>
      <JsonLd data={websiteJsonLd()} />
      <section className="mx-auto w-full max-w-6xl px-4 pb-16 pt-14 sm:px-6 lg:px-8 lg:pb-20 lg:pt-20">
        <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
          Ideias de presentes, num só sítio.
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
          Uma lista sempre atualizada do que me daria jeito — organizada por
          categoria, com preço e link para a loja. Sem contas, sem compras: é só
          para consultar.
        </p>

        {budgets.length > 0 ? (
          <div className="mt-9">
            <p className="text-sm text-muted-foreground">
              Se já sabes quanto queres gastar, começa por aqui:
            </p>
            <nav
              aria-label="Ideias por orçamento"
              className="mt-3 flex flex-wrap gap-2"
            >
              {budgets.map(({ bucket, count }) => (
                <Link
                  key={bucket.value}
                  href={`/pesquisa?preco=${bucket.value}`}
                  className="group inline-flex h-10 items-center gap-2 rounded-full border border-input bg-background px-4 text-sm font-medium transition-colors hover:border-primary/40 hover:bg-primary/10"
                >
                  {bucket.label}
                  <span className="tabular-nums text-xs text-muted-foreground transition-colors group-hover:text-primary">
                    {count}
                  </span>
                </Link>
              ))}
            </nav>
          </div>
        ) : null}
      </section>

      <section
        id="destaques"
        className="mx-auto w-full max-w-6xl scroll-mt-28 px-4 pb-16 sm:px-6 lg:px-8 lg:pb-20"
      >
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-2xl font-semibold tracking-tight">Destaques</h2>
          <Link
            href="/pesquisa"
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            Ver todos os produtos
          </Link>
        </div>
        <ProductGrid
          products={highlighted}
          priorityCount={3}
          emptyTitle="Ainda sem destaques"
          emptyDescription="Assim que houver favoritos ou prioridades altas, aparecem aqui."
        />
      </section>

      <section
        id="categorias"
        className="mx-auto w-full max-w-6xl scroll-mt-28 px-4 pb-20 sm:px-6 lg:px-8 lg:pb-24"
      >
        <h2 className="mb-8 text-2xl font-semibold tracking-tight">
          Categorias
        </h2>
        <CategoryGrid categories={categories} products={products} />
      </section>
    </>
  );
}
