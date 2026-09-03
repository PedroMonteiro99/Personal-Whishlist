import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProductGrid } from "@/components/ProductGrid";
import { CategoryHeader } from "@/features/category/components/CategoryHeader";
import { getCategoryPageData } from "@/features/category/lib/get-category-page";
import { getCategorySlugs } from "@/lib/catalog";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await getCategorySlugs();

  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const { category } = await getCategoryPageData(slug);

  if (!category) {
    return { title: "Categoria não encontrada" };
  }

  return {
    title: category.name,
    description:
      category.description ?? `Produtos da categoria ${category.name}.`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const { category, products } = await getCategoryPageData(slug);

  if (!category) {
    notFound();
  }

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <div className="space-y-8">
        <CategoryHeader category={category} products={products} />
        <ProductGrid products={products} />
      </div>
    </section>
  );
}
