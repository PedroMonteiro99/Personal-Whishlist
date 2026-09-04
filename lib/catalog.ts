import fs from "node:fs/promises";
import path from "node:path";

import matter from "gray-matter";
import { cache } from "react";

import {
  collectContentProblems,
  formatContentProblems,
} from "@/lib/content/integrity";
import {
  categorySchema,
  occasionSchema,
  productSchema,
  storeSchema,
  type Category,
  type Occasion,
  type Product,
  type Store,
} from "@/lib/content/schemas";

type RawProduct = Product & { body: string };

/** Uma loja resolvida: o link do produto mais os dados de `content/stores/`. */
export type CatalogProductStore = {
  slug: string;
  name: string;
  productUrl: string;
  storeUrl: string;
  logo?: string;
  price?: number;
};

export type CatalogProduct = RawProduct & {
  categoryName: string;
  categoryDescription?: string;
  categoryIcon?: string;
  availableImages: string[];
  /** Ordenadas da mais barata para a mais cara; sem preço vão para o fim. */
  storeEntries: CatalogProductStore[];
  storeSlugs: string[];
  lowestPrice?: number;
  hasMultiplePrices: boolean;
  /** O nome da ocasião em que foi recebido, quando já o foi. */
  receivedOccasionName?: string;
};

export type CatalogData = {
  categories: Category[];
  stores: Store[];
  occasions: Occasion[];
  /** A ocasião a que as novas reservas ficam associadas. */
  activeOccasion: Occasion;
  /** Só os que ainda não foram recebidos: é a lista que se navega. */
  products: CatalogProduct[];
  /** Já recebidos. Mantêm a página, saem das listas (SEO-005). */
  receivedProducts: CatalogProduct[];
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
        filePath,
      };
    }),
  );
}

type ContentEntry<T> = { data: T; body: string; filePath: string };

function toRelativePath(filePath: string) {
  return path.relative(process.cwd(), filePath).split(path.sep).join("/");
}

/**
 * O Git é a única fonte de verdade: uma referência partida faria o produto
 * desaparecer da aplicação sem qualquer aviso. Falha já, nomeando o ficheiro e
 * a referência em falta (ver SYNC-003/SYNC-004 no PROJECT_BLUEPRINT.md).
 */
function assertContentIntegrity(
  productEntries: ContentEntry<Product>[],
  categoryEntries: ContentEntry<Category>[],
  storeEntries: ContentEntry<Store>[],
  occasionEntries: ContentEntry<Occasion>[],
) {
  const withRelativePaths = <T>(entries: ContentEntry<T>[]) =>
    entries.map((entry) => ({
      ...entry,
      filePath: toRelativePath(entry.filePath),
    }));

  const problems = collectContentProblems(
    withRelativePaths(productEntries),
    withRelativePaths(categoryEntries),
    withRelativePaths(storeEntries),
    withRelativePaths(occasionEntries),
  );

  if (problems.length > 0) {
    throw new Error(formatContentProblems(problems));
  }
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

/**
 * Resolve as lojas de um produto contra `content/stores/` e ordena-as da mais
 * barata para a mais cara. Lojas sem preço vão para o fim: não têm posição.
 */
function resolveProductStores(
  entries: Product["stores"],
  storeBySlug: Map<string, Store>,
): CatalogProductStore[] {
  return entries
    .map((entry) => {
      const store = storeBySlug.get(entry.store);

      return {
        slug: entry.store,
        name: entry.label ?? store?.name ?? entry.store,
        productUrl: entry.url,
        storeUrl: store?.url ?? "",
        logo: store?.logo,
        price: entry.price,
      } satisfies CatalogProductStore;
    })
    .sort((left, right) => {
      if (typeof left.price !== "number") {
        return typeof right.price === "number" ? 1 : 0;
      }

      if (typeof right.price !== "number") {
        return -1;
      }

      return left.price - right.price;
    });
}

export const getCatalogData = cache(async (): Promise<CatalogData> => {
  const [categoryEntries, storeEntries, productEntries, occasionEntries] =
    await Promise.all([
      readCollection(path.join(CONTENT_ROOT, "categories"), categorySchema),
      readCollection(path.join(CONTENT_ROOT, "stores"), storeSchema),
      readCollection(path.join(CONTENT_ROOT, "wishlist"), productSchema),
      readCollection(path.join(CONTENT_ROOT, "occasions"), occasionSchema),
    ]);

  assertContentIntegrity(
    productEntries,
    categoryEntries,
    storeEntries,
    occasionEntries,
  );

  const categories = sortCategories(categoryEntries.map(({ data }) => data));
  const stores = storeEntries
    .map(({ data }) => data)
    .sort((left, right) => left.name.localeCompare(right.name, "pt"));

  // Mais recentes primeiro: é a ordem em que uma lista de ocasiões se lê.
  const occasions = occasionEntries
    .map(({ data }) => data)
    .sort((left, right) => right.date.localeCompare(left.date));

  const categoryBySlug = new Map(
    categories.map((category) => [category.slug, category]),
  );
  const storeBySlug = new Map(stores.map((store) => [store.slug, store]));
  const occasionBySlug = new Map(
    occasions.map((occasion) => [occasion.slug, occasion]),
  );

  // A integridade já garantiu que existe exatamente uma.
  const activeOccasion = occasions.find(
    (occasion) => occasion.status === "aberta",
  )!;

  const allProducts = await Promise.all(
    productEntries.map(async ({ data, body }) => {
      const category = categoryBySlug.get(data.category);
      const storeEntries = resolveProductStores(data.stores, storeBySlug);
      const prices = storeEntries
        .map((entry) => entry.price)
        .filter((price): price is number => typeof price === "number");

      return {
        ...data,
        body,
        availableImages: await resolveAssetList(data.images),
        categoryName: category?.name ?? data.category,
        categoryDescription: category?.description,
        categoryIcon: category?.icon,
        storeEntries,
        storeSlugs: storeEntries.map((entry) => entry.slug),
        lowestPrice: prices[0],
        hasMultiplePrices: new Set(prices).size > 1,
        receivedOccasionName: data.received
          ? (occasionBySlug.get(data.received)?.name ?? data.received)
          : undefined,
      } satisfies CatalogProduct;
    }),
  );

  // Um presente recebido sai das listas mas mantém a sua página: o slug foi
  // partilhado e tem de continuar a resolver (SEO-005).
  const sorted = sortProducts(allProducts);

  return {
    categories,
    stores,
    occasions,
    activeOccasion,
    products: sorted.filter((product) => !product.received),
    receivedProducts: sorted.filter((product) => Boolean(product.received)),
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
  const { products, receivedProducts } = await getCatalogData();

  // Procura também nos recebidos: a página tem de continuar a resolver.
  return (
    [...products, ...receivedProducts].find(
      (product) => createProductId(product) === slug,
    ) ?? null
  );
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
      ...product.storeEntries.map((entry) => entry.name),
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
  const { products, receivedProducts } = await getCatalogData();

  // Inclui os recebidos: as páginas deles continuam a ser geradas (SEO-005).
  return [...products, ...receivedProducts].map((product) => product.slug);
});

export const getActiveOccasion = cache(async () => {
  const { activeOccasion } = await getCatalogData();

  return activeOccasion;
});

/**
 * As ocasiões já fechadas, da mais recente para a mais antiga. É a partir
 * delas que se monta a vista de agradecimentos.
 */
export const getClosedOccasions = cache(async () => {
  const { occasions } = await getCatalogData();

  return occasions.filter((occasion) => occasion.status === "fechada");
});

export const getOccasionBySlug = cache(async (slug: string) => {
  const { occasions } = await getCatalogData();

  return occasions.find((occasion) => occasion.slug === slug) ?? null;
});

export const getProductsReceivedIn = cache(async (occasionSlug: string) => {
  const { receivedProducts } = await getCatalogData();

  return receivedProducts.filter(
    (product) => product.received === occasionSlug,
  );
});
