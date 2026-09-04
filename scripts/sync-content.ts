import matter from "gray-matter";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  categorySchema,
  productSchema,
  storeSchema,
  type Category,
  type Product,
  type Store,
} from "@/lib/content/schemas";

import { createSupabaseServiceClient } from "./lib/supabase-service-client";

type SyncMode = "dry-run" | "write";

type ParsedEntry<T> = {
  filePath: string;
  data: T;
  body: string;
};

type ProductRecord = Product & { body: string };

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(SCRIPT_DIR, "..");
const CONTENT_ROOT = path.join(PROJECT_ROOT, "content");

function normalizeFilePath(filePath: string) {
  return path.relative(PROJECT_ROOT, filePath).replaceAll(path.sep, "/");
}

function formatValidationError(filePath: string, error: unknown) {
  const relativePath = normalizeFilePath(filePath);

  if (error instanceof Error) {
    return `[sync-content] Validation failed for ${relativePath}: ${error.message}`;
  }

  return `[sync-content] Validation failed for ${relativePath}`;
}

async function readMdxFiles(directory: string): Promise<string[]> {
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
}

function parseFrontmatter<T>(
  filePath: string,
  schema: { parse: (value: unknown) => T },
): Promise<ParsedEntry<T>> {
  return fs.readFile(filePath, "utf8").then((content) => {
    const parsed = matter(content);

    try {
      return {
        filePath: normalizeFilePath(filePath),
        data: schema.parse(parsed.data),
        body: parsed.content.trim(),
      };
    } catch (error) {
      throw new Error(formatValidationError(filePath, error));
    }
  });
}

async function parseCollection<T>(
  directory: string,
  schema: { parse: (value: unknown) => T },
) {
  const files = await readMdxFiles(directory);
  return Promise.all(
    files.map((filePath) => parseFrontmatter(filePath, schema)),
  );
}

function assertUniqueSlugs<T extends { slug: string }>(
  entries: ParsedEntry<T>[],
  label: string,
) {
  const seen = new Map<string, string>();

  for (const entry of entries) {
    const previous = seen.get(entry.data.slug);

    if (previous) {
      throw new Error(
        `[sync-content] Duplicate ${label} slug "${entry.data.slug}" found in ${previous} and ${entry.filePath}`,
      );
    }

    seen.set(entry.data.slug, entry.filePath);
  }
}

function assertProductReferences(
  products: ParsedEntry<ProductRecord>[],
  categories: ParsedEntry<Category>[],
  stores: ParsedEntry<Store>[],
) {
  const categorySlugs = new Set(categories.map(({ data }) => data.slug));
  const storeSlugs = new Set(stores.map(({ data }) => data.slug));

  for (const product of products) {
    if (!categorySlugs.has(product.data.category)) {
      throw new Error(
        `[sync-content] Unknown category slug "${product.data.category}" referenced by product "${product.data.slug}" in ${product.filePath}`,
      );
    }

    const seenStores = new Set<string>();

    for (const entry of product.data.stores) {
      if (!storeSlugs.has(entry.store)) {
        throw new Error(
          `[sync-content] Unknown store slug "${entry.store}" referenced by product "${product.data.slug}" in ${product.filePath}`,
        );
      }

      if (seenStores.has(entry.store)) {
        throw new Error(
          `[sync-content] Duplicate store "${entry.store}" on product "${product.data.slug}" in ${product.filePath}`,
        );
      }

      seenStores.add(entry.store);
    }
  }
}

async function upsertCategories(
  categories: ParsedEntry<Category>[],
  mode: SyncMode,
) {
  if (mode === "dry-run") {
    console.log(`[sync-content] dry-run categories: ${categories.length}`);
    return;
  }

  const client = createSupabaseServiceClient();
  const { error } = await client.from("categories").upsert(
    categories.map(({ data }) => data),
    { onConflict: "slug" },
  );

  if (error) {
    throw new Error(
      `[sync-content] Failed to upsert categories: ${error.message}`,
    );
  }
}

async function upsertStores(stores: ParsedEntry<Store>[], mode: SyncMode) {
  if (mode === "dry-run") {
    console.log(`[sync-content] dry-run stores: ${stores.length}`);
    return;
  }

  const client = createSupabaseServiceClient();
  const { error } = await client.from("stores").upsert(
    stores.map(({ data }) => data),
    { onConflict: "slug" },
  );

  if (error) {
    throw new Error(`[sync-content] Failed to upsert stores: ${error.message}`);
  }
}

async function getForeignKeyMaps() {
  const client = createSupabaseServiceClient();
  const [
    { data: categoryRows, error: categoryError },
    { data: storeRows, error: storeError },
  ] = await Promise.all([
    client.from("categories").select("id, slug"),
    client.from("stores").select("id, slug"),
  ]);

  if (categoryError) {
    throw new Error(
      `[sync-content] Failed to read categories: ${categoryError.message}`,
    );
  }

  if (storeError) {
    throw new Error(
      `[sync-content] Failed to read stores: ${storeError.message}`,
    );
  }

  return {
    categoryIdBySlug: new Map(
      (categoryRows ?? []).map((row) => [row.slug, row.id]),
    ),
    storeIdBySlug: new Map((storeRows ?? []).map((row) => [row.slug, row.id])),
  };
}

async function upsertProducts(
  products: ParsedEntry<ProductRecord>[],
  mode: SyncMode,
) {
  if (mode === "dry-run") {
    console.log(`[sync-content] dry-run products: ${products.length}`);
    return [] as Array<{ id: string; slug: string }>;
  }

  const { categoryIdBySlug } = await getForeignKeyMaps();

  const rows = products.map(({ data }) => {
    const categoryId = categoryIdBySlug.get(data.category);

    if (!categoryId) {
      throw new Error(
        `[sync-content] Unknown category slug "${data.category}" referenced by product "${data.slug}"`,
      );
    }

    return {
      slug: data.slug,
      name: data.name,
      category_id: categoryId,
      currency: data.currency,
      priority: data.priority,
      favorite: data.favorite,
      images: data.images,
      seo: data.seo ?? null,
      body: data.body,
    };
  });

  const client = createSupabaseServiceClient();
  const { data, error } = await client
    .from("products")
    .upsert(rows, { onConflict: "slug" })
    .select("id, slug");

  if (error) {
    throw new Error(
      `[sync-content] Failed to upsert products: ${error.message}`,
    );
  }

  return (data ?? []).map((row) => ({ id: row.id, slug: row.slug }));
}

async function replaceProductLinks(
  products: ParsedEntry<ProductRecord>[],
  productIds: Array<{ id: string; slug: string }>,
  mode: SyncMode,
) {
  if (mode === "dry-run") {
    const links = products.reduce(
      (total, { data }) => total + data.stores.length,
      0,
    );
    console.log(`[sync-content] dry-run product_links: ${links}`);
    return;
  }

  const { storeIdBySlug } = await getForeignKeyMaps();
  const productIdBySlug = new Map(productIds.map((row) => [row.slug, row.id]));

  const links = products.flatMap(({ data }) => {
    const productId = productIdBySlug.get(data.slug);

    if (!productId) {
      throw new Error(
        `[sync-content] Missing database id for product "${data.slug}"`,
      );
    }

    return data.stores.map((entry) => {
      const storeId = storeIdBySlug.get(entry.store);

      if (!storeId) {
        throw new Error(
          `[sync-content] Unknown store slug "${entry.store}" referenced by product "${data.slug}"`,
        );
      }

      return {
        product_id: productId,
        store_id: storeId,
        label: entry.label ?? null,
        url: entry.url,
        price: entry.price ?? null,
      };
    });
  });

  const client = createSupabaseServiceClient();
  const productIdsToReplace = productIds.map((row) => row.id);

  if (productIdsToReplace.length === 0) {
    return;
  }

  const { error: deleteError } = await client
    .from("product_links")
    .delete()
    .in("product_id", productIdsToReplace);

  if (deleteError) {
    throw new Error(
      `[sync-content] Failed to clear product_links: ${deleteError.message}`,
    );
  }

  if (links.length === 0) {
    return;
  }

  const { error: insertError } = await client
    .from("product_links")
    .insert(links);

  if (insertError) {
    throw new Error(
      `[sync-content] Failed to insert product_links: ${insertError.message}`,
    );
  }
}

async function main() {
  const mode: SyncMode = process.argv.includes("--dry-run")
    ? "dry-run"
    : "write";

  const [categories, stores, products] = await Promise.all([
    parseCollection(path.join(CONTENT_ROOT, "categories"), categorySchema),
    parseCollection(path.join(CONTENT_ROOT, "stores"), storeSchema),
    parseCollection(path.join(CONTENT_ROOT, "wishlist"), productSchema).then(
      (entries) =>
        entries.map((entry) => ({
          filePath: entry.filePath,
          data: {
            ...entry.data,
            body: entry.body,
          },
          body: entry.body,
        })),
    ),
  ]);

  assertUniqueSlugs(categories, "category");
  assertUniqueSlugs(stores, "store");
  assertUniqueSlugs(products, "product");
  assertProductReferences(products, categories, stores);

  console.log(`[sync-content] mode=${mode}`);
  console.log(
    `[sync-content] categories=${categories.length}, stores=${stores.length}, products=${products.length}`,
  );

  await upsertCategories(categories, mode);
  await upsertStores(stores, mode);
  const productIds = await upsertProducts(products, mode);
  await replaceProductLinks(products, productIds, mode);

  console.log("[sync-content] done");
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(message);
  process.exit(1);
});
