import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProductDetail } from "@/features/product/components/ProductDetail";
import { getProductPageData } from "@/features/product/lib/get-product-page";
import { getProductSlugs } from "@/lib/catalog";

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

  return {
    title: product.name,
    description:
      product.seo?.description ??
      (product.body
        ? product.body.slice(0, 160)
        : `${product.name} na wishlist${
            product.storeEntries.length > 0
              ? `, disponível em ${product.storeEntries
                  .map((entry) => entry.name)
                  .join(", ")}`
              : ""
          }.`),
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
      <ProductDetail product={product} />
    </section>
  );
}
