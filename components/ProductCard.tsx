import Image from "next/image";
import Link from "next/link";

import { ArrowRight } from "lucide-react";

import { FavoriteIndicator } from "@/components/FavoriteIndicator";
import { PriorityBadge } from "@/components/PriorityBadge";
import { Card } from "@/components/ui/card";
import { ReservationBadge } from "@/features/reservations/components/ReservationBadge";
import { formatPrice, formatStoreCount } from "@/lib/format";
import { cn } from "@/lib/utils";

import type { CatalogProduct } from "@/lib/catalog";

export function ProductCard({
  product,
  className,
  priority = false,
}: {
  product: CatalogProduct;
  className?: string;
  priority?: boolean;
}) {
  const imageUrl = product.availableImages[0];

  return (
    <Link
      href={`/produto/${product.slug}`}
      className={cn("group block rounded-3xl", className)}
    >
      <Card className="h-full overflow-hidden border-border/70 bg-card/80 transition-transform duration-300 group-hover:-translate-y-1">
        <div
          className={cn(
            "relative aspect-[4/3] overflow-hidden border-b border-border/70",
            imageUrl ? "bg-product-plate" : "bg-secondary",
          )}
        >
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              // Acima da dobra é quase sempre a imagem do LCP: carregar com
              // prioridade evita que o browser a descubra tarde (PERF-002).
              priority={priority}
              className="object-contain p-5 transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full w-full items-end bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.26),transparent_45%)] p-5">
              <span className="text-sm font-medium text-foreground/80">
                {product.categoryName}
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4 p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <PriorityBadge priority={product.priority} />
                <FavoriteIndicator favorite={product.favorite} />
                <ReservationBadge productSlug={product.slug} />
              </div>
              <h3 className="text-lg font-semibold leading-tight tracking-tight transition-colors group-hover:text-primary">
                {product.name}
              </h3>
            </div>
            <ArrowRight className="mt-1 size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1" />
          </div>

          {product.body ? (
            <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">
              {product.body}
            </p>
          ) : null}

          <div className="mt-auto flex items-center justify-between gap-3 border-t border-border/70 pt-4 text-sm">
            <span className="text-muted-foreground">
              {product.storeEntries.length > 1
                ? formatStoreCount(product.storeEntries.length)
                : product.categoryName}
            </span>
            <span className="font-medium tabular-nums text-foreground">
              {formatPrice(product)}
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
