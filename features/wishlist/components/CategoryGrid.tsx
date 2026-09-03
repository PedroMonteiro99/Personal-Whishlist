import Link from "next/link";

import { ArrowRight } from "lucide-react";

import { EmptyState } from "@/components/EmptyState";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { resolveCategoryIcon } from "@/features/wishlist/lib/category-icons";
import { formatProductCount } from "@/lib/format";

import type { CatalogData } from "@/lib/catalog";

export function CategoryGrid({
  categories,
  products,
}: Pick<CatalogData, "categories" | "products">) {
  const productCountByCategory = new Map<string, number>();

  for (const product of products) {
    productCountByCategory.set(
      product.category,
      (productCountByCategory.get(product.category) ?? 0) + 1,
    );
  }

  // Uma categoria sem produtos não é navegável: mostrá-la só criaria becos sem saída.
  const populatedCategories = categories.filter(
    (category) => (productCountByCategory.get(category.slug) ?? 0) > 0,
  );

  if (populatedCategories.length === 0) {
    return (
      <EmptyState
        title="Ainda sem categorias"
        description="As categorias aparecem aqui assim que tiverem produtos."
      />
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {populatedCategories.map((category) => {
        const Icon = resolveCategoryIcon(category.icon);

        return (
          <Link
            key={category.slug}
            href={`/categoria/${category.slug}`}
            className="group block rounded-3xl"
          >
            <Card className="h-full border-border/70 bg-card/80 transition-transform duration-300 group-hover:-translate-y-1">
              <CardHeader className="space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Icon className="size-5" />
                  </span>
                  <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                </div>
                <CardTitle className="transition-colors group-hover:text-primary">
                  {category.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  {category.description ?? "Categoria disponível na wishlist."}
                </p>
                <p className="text-sm font-medium tabular-nums text-foreground">
                  {formatProductCount(
                    productCountByCategory.get(category.slug) ?? 0,
                  )}
                </p>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
