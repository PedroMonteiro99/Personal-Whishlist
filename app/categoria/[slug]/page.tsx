import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { JsonLd } from "@/components/JsonLd";
import { ProductGrid } from "@/components/ProductGrid";
import { CategoryHeader } from "@/features/category/components/CategoryHeader";
import { getCategoryPageData } from "@/features/category/lib/get-category-page";
import { getCategorySlugs } from "@/lib/catalog";
import { openGraphDefaults } from "@/lib/site";
import { breadcrumbJsonLd, collectionJsonLd } from "@/lib/structured-data";

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
  const { category, products } = await getCategoryPageData(slug);

  if (!category) {
    return { title: "Categoria não encontrada" };
  }

  const description =
    category.description ?? `Produtos da categoria ${category.name}.`;
  const url = `/categoria/${category.slug}`;

  return {
    title: category.name,
    description,
    alternates: { canonical: url },
    // Uma categoria sem produtos é uma página vazia: não deve entrar no índice.
    robots: products.length === 0 ? { index: false, follow: true } : undefined,
    openGraph: {
      ...openGraphDefaults(),
      title: category.name,
      description,
      url,
    },
    twitter: {
      card: "summary_large_image",
      title: category.name,
      description,
    },
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
      <JsonLd data={collectionJsonLd(category, products)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Início", path: "/" },
          { name: category.name, path: `/categoria/${category.slug}` },
        ])}
      />
      <div className="space-y-8">
        <CategoryHeader category={category} products={products} />
        <ProductGrid products={products} priorityCount={3} />
      </div>
    </section>
  );
}
