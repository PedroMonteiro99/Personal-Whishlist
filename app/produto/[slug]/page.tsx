import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { JsonLd } from "@/components/JsonLd";
import { ProductDetail } from "@/features/product/components/ProductDetail";
import { getProductPageData } from "@/features/product/lib/get-product-page";
import { getProductSlugs } from "@/lib/catalog";
import { openGraphDefaults } from "@/lib/site";
import { breadcrumbJsonLd, productJsonLd } from "@/lib/structured-data";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await getProductSlugs();

  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const { product } = await getProductPageData(slug);

  if (!product) {
    return { title: "Produto não encontrado" };
  }

  const description =
    product.seo?.description ??
    (product.body
      ? product.body.slice(0, 160)
      : `${product.name} na wishlist${
          product.storeEntries.length > 0
            ? `, disponível em ${product.storeEntries
                .map((entry) => entry.name)
                .join(", ")}`
            : ""
        }.`);

  const url = `/produto/${product.slug}`;

  return {
    title: product.name,
    description,
    alternates: { canonical: url },
    openGraph: {
      ...openGraphDefaults(),
      title: product.name,
      description,
      url,
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const { product } = await getProductPageData(slug);

  if (!product) {
    notFound();
  }

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <JsonLd data={productJsonLd(product)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Início", path: "/" },
          {
            name: product.categoryName,
            path: `/categoria/${product.category}`,
          },
          { name: product.name, path: `/produto/${product.slug}` },
        ])}
      />
      <ProductDetail product={product} />
    </section>
  );
}
