import Link from "next/link";

import { ArrowRight, ExternalLink } from "lucide-react";

import { FavoriteIndicator } from "@/components/FavoriteIndicator";
import { PriorityBadge } from "@/components/PriorityBadge";
import { StoreLink } from "@/components/StoreLink";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice, resolvePurchaseLink } from "@/lib/format";

import { ProductGallery } from "./ProductGallery";

import type { CatalogProduct } from "@/lib/catalog";

function splitBody(body: string) {
  return body
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

export function ProductDetail({ product }: { product: CatalogProduct }) {
  const paragraphs = splitBody(product.body);
  const purchase = resolvePurchaseLink(product);
  const extraLinks = purchase?.isProductLink
    ? product.links.slice(1)
    : product.links;

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
              {" · "}
              {product.storeName}
            </p>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-border/70 bg-background/60 p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                  Preço
                </p>
                <p className="mt-2 text-lg font-semibold tabular-nums">
                  {formatPrice(product)}
                </p>
              </div>
              <div className="rounded-2xl border border-border/70 bg-background/60 p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                  Loja
                </p>
                <p className="mt-2 text-lg font-semibold">
                  {product.storeName}
                </p>
              </div>
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
              {purchase ? (
                <StoreLink
                  href={purchase.url}
                  label={
                    purchase.isProductLink
                      ? `Ver na ${product.storeName}`
                      : `Abrir ${product.storeName}`
                  }
                />
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

        {extraLinks.length > 0 ? (
          <Card className="border-border/70 bg-card/80">
            <CardHeader>
              <CardTitle>Outros links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {extraLinks.map((link) => (
                <a
                  key={`${link.label}-${link.url}`}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between rounded-2xl border border-border/70 bg-background/60 px-4 py-3 text-sm transition-colors hover:border-primary/40 hover:bg-background"
                >
                  <span>{link.label}</span>
                  <ExternalLink className="size-4 text-muted-foreground" />
                </a>
              ))}
            </CardContent>
          </Card>
        ) : null}
      </div>
    </div>
  );
}
