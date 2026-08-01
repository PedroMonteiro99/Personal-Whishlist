import Image from "next/image";

import { Link as LinkIcon } from "lucide-react";

import { FavoriteIndicator } from "@/components/FavoriteIndicator";
import { PriorityBadge } from "@/components/PriorityBadge";
import { StoreLink } from "@/components/StoreLink";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import type { CatalogProduct } from "@/lib/catalog";

function formatPrice(product: CatalogProduct) {
  if (typeof product.price !== "number") {
    return "Preço sob consulta";
  }

  return new Intl.NumberFormat("pt-PT", {
    style: "currency",
    currency: product.currency,
  }).format(product.price);
}

function splitBody(body: string) {
  return body
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

export function ProductDetail({ product }: { product: CatalogProduct }) {
  const [primaryImage, ...secondaryImages] = product.availableImages;
  const paragraphs = splitBody(product.body);

  return (
    <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
      <Card className="overflow-hidden border-border/70 bg-card/80">
        <div className="relative aspect-[4/3] bg-muted">
          {primaryImage ? (
            <Image
              src={primaryImage}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          ) : (
            <div className="flex h-full items-end bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.24),transparent_42%),linear-gradient(135deg,rgba(15,23,42,0.95),rgba(30,41,59,0.82))] p-6">
              <span className="text-sm font-medium text-white/80">
                {product.categoryName}
              </span>
            </div>
          )}
        </div>
        {secondaryImages.length > 0 ? (
          <CardContent className="grid gap-3 border-t border-border/70 p-4 sm:grid-cols-2">
            {secondaryImages.slice(0, 4).map((image) => (
              <div
                key={image}
                className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-muted"
              >
                <Image
                  src={image}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                />
              </div>
            ))}
          </CardContent>
        ) : null}
      </Card>

      <div className="space-y-6">
        <Card className="border-border/70 bg-card/80">
          <CardHeader className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <PriorityBadge priority={product.priority} />
              <FavoriteIndicator favorite={product.favorite} />
            </div>
            <CardTitle className="text-3xl leading-tight">
              {product.name}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {product.categoryName} · {product.storeName}
            </p>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-border/70 bg-background/60 p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                  Preço
                </p>
                <p className="mt-2 text-lg font-semibold">
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

            <div className="flex flex-wrap gap-3">
              {product.storeUrl ? (
                <StoreLink
                  href={product.storeUrl}
                  label={`Abrir ${product.storeName}`}
                />
              ) : null}
              <Button asChild variant="outline">
                <a href={`/#categorias`}>
                  Ver categorias
                  <LinkIcon className="size-4" />
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        {product.links.length > 0 ? (
          <Card className="border-border/70 bg-card/80">
            <CardHeader>
              <CardTitle>Links disponíveis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {product.links.map((link) => (
                <a
                  key={`${link.label}-${link.url}`}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between rounded-2xl border border-border/70 bg-background/60 px-4 py-3 text-sm transition-colors hover:border-primary/40 hover:bg-background"
                >
                  <span>{link.label}</span>
                  <LinkIcon className="size-4 text-muted-foreground" />
                </a>
              ))}
            </CardContent>
          </Card>
        ) : null}
      </div>
    </div>
  );
}
