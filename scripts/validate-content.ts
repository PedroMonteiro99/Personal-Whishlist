import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import matter from "gray-matter";

import {
  collectContentProblems,
  type ContentEntry,
} from "@/lib/content/integrity";
import {
  categorySchema,
  occasionSchema,
  productSchema,
  storeSchema,
} from "@/lib/content/schemas";

/**
 * Valida todo o conteúdo MDX: frontmatter contra os schemas Zod, slugs únicos e
 * referências resolvidas. Corre no workflow `validate` (SYNC-001).
 *
 * As regras vivem em `lib/content/integrity.ts`, partilhadas com o catálogo:
 * uma regra nova entra nos dois sítios de uma vez.
 */

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(SCRIPT_DIR, "..");
const CONTENT_ROOT = path.join(PROJECT_ROOT, "content");

function normalizeFilePath(filePath: string) {
  return path.relative(PROJECT_ROOT, filePath).replaceAll(path.sep, "/");
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

async function parseCollection<T>(
  directory: string,
  schema: { parse: (value: unknown) => T },
  problems: string[],
) {
  const files = await readMdxFiles(directory);

  const parsed = await Promise.all(
    files.map(async (filePath): Promise<ContentEntry<T> | null> => {
      const content = await fs.readFile(filePath, "utf8");
      const file = matter(content);

      try {
        return {
          filePath: normalizeFilePath(filePath),
          data: schema.parse(file.data),
          body: file.content.trim(),
        };
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "frontmatter inválido";
        problems.push(`${normalizeFilePath(filePath)}: ${message}`);
        return null;
      }
    }),
  );

  return parsed.filter((entry): entry is ContentEntry<T> => entry !== null);
}

async function main() {
  const parseProblems: string[] = [];

  const [categories, stores, products, occasions] = await Promise.all([
    parseCollection(
      path.join(CONTENT_ROOT, "categories"),
      categorySchema,
      parseProblems,
    ),
    parseCollection(
      path.join(CONTENT_ROOT, "stores"),
      storeSchema,
      parseProblems,
    ),
    parseCollection(
      path.join(CONTENT_ROOT, "wishlist"),
      productSchema,
      parseProblems,
    ),
    parseCollection(
      path.join(CONTENT_ROOT, "occasions"),
      occasionSchema,
      parseProblems,
    ),
  ]);

  const problems = [
    ...parseProblems,
    ...collectContentProblems(products, categories, stores, occasions),
  ];

  if (problems.length > 0) {
    console.error("Conteúdo MDX inválido:");

    for (const problem of problems) {
      console.error(`  · ${problem}`);
    }

    process.exit(1);
  }

  const storeLinks = products.reduce(
    (total, { data }) => total + data.stores.length,
    0,
  );
  const received = products.filter(({ data }) => data.received).length;
  const active = occasions.find(({ data }) => data.status === "aberta");

  console.log(
    `Conteúdo válido: ${products.length} produtos (${received} já recebidos), ` +
      `${categories.length} categorias, ${stores.length} lojas, ` +
      `${storeLinks} ligações a loja, ${occasions.length} ocasiões.`,
  );
  console.log(`Ocasião aberta: ${active?.data.name ?? "—"}`);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
