import Link from "next/link";

import { ArrowLeft, SlidersHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatProductCount } from "@/lib/format";

import type { CatalogProduct } from "@/lib/catalog";
import type { Category } from "@/lib/content/schemas";

export function CategoryHeader({
  category,
  products,
}: Readonly<{ category: Category; products: CatalogProduct[] }>) {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button asChild variant="outline" size="sm">
          <Link href="/">
            <ArrowLeft className="size-4" />
            Início
          </Link>
        </Button>
        <Button asChild variant="ghost" size="sm">
          <Link href={`/pesquisa?categoria=${category.slug}`}>
            <SlidersHorizontal className="size-4" />
            Filtrar e ordenar
          </Link>
        </Button>
      </div>

      <div className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          {category.name}
        </h1>
        <p className="max-w-2xl text-base leading-7 text-muted-foreground">
          {category.description ??
            `Produtos da categoria ${category.name} na wishlist.`}
        </p>
        <p className="text-sm tabular-nums text-muted-foreground">
          {formatProductCount(products.length)}
        </p>
      </div>
    </div>
  );
}
