import fs from "node:fs/promises";
import path from "node:path";

import matter from "gray-matter";
import { cache } from "react";

import {
  categorySchema,
  productSchema,
  storeSchema,
  type Category,
  type Product,
  type Store,
} from "@/lib/content/schemas";

type RawProduct = Product & { body: string };

export type CatalogProduct = RawProduct & {
  categoryName: string;
  categoryDescription?: string;
  categoryIcon?: string;
  storeName: string;
  storeUrl: string;
  storeLogo?: string;
  availableImages: string[];
};

export type CatalogData = {
  categories: Category[];
  stores: Store[];
  products: CatalogProduct[];
};

const CONTENT_ROOT = path.join(process.cwd(), "content");
const PUBLIC_ROOT = path.join(process.cwd(), "public");

function comparePriority(priority: Product["priority"]) {
  if (priority === "high") {
    return 2;
  }

  if (priority === "medium") {
    return 1;
  }

  return 0;
}

function normalizeAssetPath(assetPath: string) {
  return assetPath.replace(/^\/+/, "");
}

async function assetExists(assetPath: string) {
  try {
    await fs.access(path.join(PUBLIC_ROOT, normalizeAssetPath(assetPath)));
    return true;
  } catch {
    return false;
  }
}

async function resolveAssetList(assetPaths: string[] = []) {
  const resolved = await Promise.all(
    assetPaths.map(async (assetPath) => {
      if (/^https?:\/\//i.test(assetPath)) {
        return assetPath;
      }

      return (await assetExists(assetPath)) ? assetPath : undefined;
    }),
  );

  return resolved.filter((assetPath): assetPath is string =>
    Boolean(assetPath),
  );
}

async function readMdxFiles(directory: string): Promise<string[]> {
  try {
    const entries = await fs.readdir(directory, { withFileTypes: true });
    const nestedFiles = await Promise.all(
      entries.map(async (entry) => {
        const resolvedPath = path.join(directory, entry.name);

        if (entry.isDirectory()) {
          return readMdxFiles(resolvedPath);
        }

        if (entry.isFile() && entry.name.endsWith(".mdx")) {
          return [resolvedPath];
        }

        return [];
      }),
    );

    return nestedFiles.flat();
  } catch {
    return [];
  }
}

async function readCollection<T>(
  directory: string,
  schema: { parse: (value: unknown) => T },
) {
  const files = await readMdxFiles(directory);

  return Promise.all(
    files.map(async (filePath) => {
      const content = await fs.readFile(filePath, "utf8");
      const parsed = matter(content);

      return {
        data: schema.parse(parsed.data),
        body: parsed.content.trim(),
      };
    }),
  );
}

function sortCategories(categories: Category[]) {
  return [...categories].sort((left, right) => {
    if (left.order !== right.order) {
      return left.order - right.order;
    }

    return left.name.localeCompare(right.name, "pt");
  });
}

function sortProducts(products: CatalogProduct[]) {
  return [...products].sort((left, right) => {
    if (left.favorite !== right.favorite) {
      return Number(right.favorite) - Number(left.favorite);
    }

    if (comparePriority(left.priority) !== comparePriority(right.priority)) {
      return comparePriority(right.priority) - comparePriority(left.priority);
    }

    return left.name.localeCompare(right.name, "pt");
  });
}

function createProductId(product: Product) {
  return product.slug;
}

export const getCatalogData = cache(async (): Promise<CatalogData> => {
  const [categoryEntries, storeEntries, productEntries] = await Promise.all([
    readCollection(path.join(CONTENT_ROOT, "categories"), categorySchema),
    readCollection(path.join(CONTENT_ROOT, "stores"), storeSchema),
    readCollection(path.join(CONTENT_ROOT, "wishlist"), productSchema),
  ]);

  const categories = sortCategories(categoryEntries.map(({ data }) => data));
  const stores = storeEntries
    .map(({ data }) => data)
    .sort((left, right) => left.name.localeCompare(right.name, "pt"));

  const categoryBySlug = new Map(
    categories.map((category) => [category.slug, category]),
  );
  const storeBySlug = new Map(stores.map((store) => [store.slug, store]));

  const products = await Promise.all(
    productEntries.map(async ({ data, body }) => {
      const category = categoryBySlug.get(data.category);
      const store = storeBySlug.get(data.store);

      return {
        ...data,
        body,
        availableImages: await resolveAssetList(data.images),
        categoryName: category?.name ?? data.category,
        categoryDescription: category?.description,
        categoryIcon: category?.icon,
        storeName: store?.name ?? data.store,
        storeUrl: store?.url ?? "",
        storeLogo: store?.logo,
      } satisfies CatalogProduct;
    }),
  );

  return {
    categories,
    stores,
    products: sortProducts(products),
  };
});

export const getFeaturedProducts = cache(async () => {
  const { products } = await getCatalogData();

  return products.filter(
    (product) => product.favorite || product.priority === "high",
  );
});

export const getCategoryBySlug = cache(async (slug: string) => {
  const { categories } = await getCatalogData();

  return categories.find((category) => category.slug === slug) ?? null;
});

export const getProductBySlug = cache(async (slug: string) => {
  const { products } = await getCatalogData();

  return products.find((product) => createProductId(product) === slug) ?? null;
});

export const getProductsByCategorySlug = cache(async (slug: string) => {
  const { products } = await getCatalogData();

  return products.filter((product) => product.category === slug);
});

export const searchProducts = cache(async (query: string) => {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return [] as CatalogProduct[];
  }

  const { products } = await getCatalogData();

  return products.filter((product) => {
    const haystack = [
      product.name,
      product.categoryName,
      product.storeName,
      product.body,
      product.categoryDescription ?? "",
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(normalizedQuery);
  });
});

export const getCategorySlugs = cache(async () => {
  const { categories } = await getCatalogData();

  return categories.map((category) => category.slug);
});

export const getProductSlugs = cache(async () => {
  const { products } = await getCatalogData();

  return products.map((product) => product.slug);
});
