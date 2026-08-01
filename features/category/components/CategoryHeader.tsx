import Link from "next/link";

import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import type { CatalogProduct } from "@/lib/catalog";
import type { Category } from "@/lib/content/schemas";

export function CategoryHeader({
  category,
  products,
}: Readonly<{ category: Category; products: CatalogProduct[] }>) {
  return (
    <Card className="border-border/70 bg-card/80">
      <CardHeader className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <Button asChild variant="outline" size="sm" className="rounded-full">
            <Link href="/">
              <ArrowLeft className="size-4" />
              Voltar
            </Link>
          </Button>
          <span className="rounded-full border border-border/70 bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
            {products.length} produtos
          </span>
        </div>
        <div className="space-y-2">
          <CardTitle className="text-3xl">{category.name}</CardTitle>
          <CardDescription className="max-w-2xl text-base">
            {category.description ?? "Categoria disponível na wishlist."}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        Navega pelos produtos desta categoria e abre cada detalhe para ver
        notas, preço e links.
      </CardContent>
    </Card>
  );
}
