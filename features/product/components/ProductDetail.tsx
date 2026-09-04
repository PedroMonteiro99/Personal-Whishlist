import Link from "next/link";

import { ArrowRight, ArrowUpRight } from "lucide-react";

import { FavoriteIndicator } from "@/components/FavoriteIndicator";
import { PriorityBadge } from "@/components/PriorityBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { GiftAction } from "@/features/reservations/components/GiftAction";
import { formatAmount, formatPrice, formatStoreCount } from "@/lib/format";
import { cn } from "@/lib/utils";

import { ProductGallery } from "./ProductGallery";
import { ReceivedNotice } from "./ReceivedNotice";

import type { CatalogProduct } from "@/lib/catalog";

function splitBody(body: string) {
  return body
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

export function ProductDetail({ product }: { product: CatalogProduct }) {
  const paragraphs = splitBody(product.body);
  const [bestStore] = product.storeEntries;
  const showsCheapestBadge = product.hasMultiplePrices;

  return (
    <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
      <Card className="overflow-hidden border-border/70 bg-card/80 lg:sticky lg:top-24 lg:self-start">
        <ProductGallery
          images={product.availableImages}
          productName={product.name}
          fallbackLabel={product.categoryName}
        />
      </Card>

      <div className="space-y-6">
        <Card className="border-border/70 bg-card/80">
          <CardHeader className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <PriorityBadge priority={product.priority} />
              <FavoriteIndicator favorite={product.favorite} />
            </div>
            <h1 className="text-3xl font-semibold leading-tight tracking-tight text-balance text-card-foreground">
              {product.name}
            </h1>
            <p className="text-sm text-muted-foreground">
              <Link
                href={`/categoria/${product.category}`}
                className="hover:text-foreground"
              >
                {product.categoryName}
              </Link>
              {product.storeEntries.length > 0
                ? ` · ${formatStoreCount(product.storeEntries.length)}`
                : null}
            </p>
          </CardHeader>

          <CardContent className="space-y-5">
            <div className="rounded-2xl border border-border/70 bg-background/60 p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                Preço
              </p>
              <p className="mt-2 text-2xl font-semibold tabular-nums">
                {formatPrice(product)}
              </p>
            </div>

            {paragraphs.length > 0 ? (
              <div className="space-y-3 rounded-2xl border border-border/70 bg-background/60 p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                  Notas
                </p>
                <div className="space-y-4 text-sm leading-7 text-foreground/90">
                  {paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="flex flex-wrap gap-3">
              {bestStore ? (
                <Button asChild>
                  <Link
                    href={bestStore.productUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Ver na {bestStore.name}
                    <ArrowUpRight className="size-4" />
                    <span className="sr-only">(abre num separador novo)</span>
                  </Link>
                </Button>
              ) : null}
              <Button asChild variant="outline">
                <Link href={`/categoria/${product.category}`}>
                  Mais em {product.categoryName}
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {product.received ? (
          <ReceivedNotice
            occasionName={product.receivedOccasionName ?? product.received}
          />
        ) : (
          <GiftAction productSlug={product.slug} productName={product.name} />
        )}

        {product.storeEntries.length > 0 ? (
          <Card className="border-border/70 bg-card/80">
            <CardHeader>
              <h2 className="text-lg font-semibold leading-none tracking-tight">
                Onde comprar
              </h2>
            </CardHeader>
            <CardContent className="space-y-3">
              {product.storeEntries.map((store, index) => {
                const extra =
                  typeof store.price === "number" &&
                  typeof product.lowestPrice === "number"
                    ? store.price - product.lowestPrice
                    : 0;

                return (
                  <a
                    key={store.slug}
                    href={store.productUrl}
                    target="_blank"
                    rel="noreferrer"
                    className={cn(
                      "flex items-center justify-between gap-4 rounded-2xl border bg-background/60 px-4 py-3 text-sm transition-colors hover:bg-background",
                      index === 0 && showsCheapestBadge
                        ? "border-primary/40"
                        : "border-border/70 hover:border-primary/40",
                    )}
                  >
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="font-medium text-foreground">
                        {store.name}
                      </span>
                      {index === 0 && showsCheapestBadge ? (
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                          Mais barato
                        </span>
                      ) : null}
                    </span>
                    <span className="flex shrink-0 items-center gap-2 text-muted-foreground">
                      <span className="text-right">
                        <span className="block tabular-nums">
                          {typeof store.price === "number"
                            ? formatAmount(store.price, product.currency)
                            : "Sob consulta"}
                        </span>
                        {extra > 0 ? (
                          <span className="block text-xs tabular-nums">
                            +{formatAmount(extra, product.currency)}
                          </span>
                        ) : null}
                      </span>
                      <ArrowUpRight className="size-4" />
                    </span>
                    <span className="sr-only">(abre num separador novo)</span>
                  </a>
                );
              })}
            </CardContent>
          </Card>
        ) : null}
      </div>
    </div>
  );
}
