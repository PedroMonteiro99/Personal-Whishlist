import Image from "next/image";
import Link from "next/link";

import { ArrowRight } from "lucide-react";

import { FavoriteIndicator } from "@/components/FavoriteIndicator";
import { PriorityBadge } from "@/components/PriorityBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

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

export function ProductCard({
  product,
  className,
}: {
  product: CatalogProduct;
  className?: string;
}) {
  const imageUrl = product.availableImages[0];

  return (
    <Card
      className={cn(
        "group overflow-hidden border-border/70 bg-card/80 transition-transform duration-300 hover:-translate-y-1",
        className,
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <Link
          href={`/produto/${product.slug}`}
          className="absolute inset-0 block"
          aria-label={`Abrir ${product.name}`}
        >
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full w-full items-end bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.26),transparent_42%),linear-gradient(135deg,rgba(15,23,42,0.95),rgba(30,41,59,0.8))] p-5">
              <span className="max-w-[70%] text-sm font-medium text-white/80">
                {product.categoryName}
              </span>
            </div>
          )}
        </Link>
      </div>

      <CardContent className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <PriorityBadge priority={product.priority} />
              <FavoriteIndicator favorite={product.favorite} />
            </div>
            <Link href={`/produto/${product.slug}`} className="block">
              <h3 className="text-lg font-semibold leading-tight transition-colors group-hover:text-primary">
                {product.name}
              </h3>
            </Link>
          </div>
          <ArrowRight className="mt-1 size-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
        </div>

        <p className="text-sm text-muted-foreground line-clamp-3">
          {product.body}
        </p>

        <div className="flex items-center justify-between gap-3 border-t border-border/70 pt-4 text-sm text-muted-foreground">
          <span>{product.categoryName}</span>
          <span>{formatPrice(product)}</span>
        </div>

        <Button
          asChild
          variant="outline"
          className="w-full justify-between rounded-2xl"
        >
          <Link href={`/produto/${product.slug}`}>
            Ver detalhe
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
