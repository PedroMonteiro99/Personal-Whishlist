import Link from "next/link";

import { ArrowRight } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {categories.map((category) => (
        <Card
          key={category.slug}
          className="group border-border/70 bg-card/80 transition-transform duration-300 hover:-translate-y-1"
        >
          <Link href={`/categoria/${category.slug}`} className="block">
            <CardHeader className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-lg font-semibold text-primary">
                  {(category.name ?? category.slug).slice(0, 1).toUpperCase()}
                </div>
                <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
              </div>
              <CardTitle>{category.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">
                {category.description ?? "Categoria disponível na wishlist."}
              </p>
              <p className="text-sm font-medium text-foreground">
                {productCountByCategory.get(category.slug) ?? 0} produtos
              </p>
            </CardContent>
          </Link>
        </Card>
      ))}
    </div>
  );
}
