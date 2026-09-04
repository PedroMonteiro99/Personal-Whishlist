import type {
  Category,
  Occasion,
  Product,
  Store,
} from "@/lib/content/schemas";

/**
 * As regras de integridade do conteúdo, num único sítio.
 *
 * São usadas em dois momentos: pelo `validate-content` no workflow `validate`
 * (falha o PR) e por `lib/catalog.ts` ao construir o catálogo (falha o build).
 * Viviam duplicadas nos dois — o que significava que uma regra nova podia
 * entrar num sítio e faltar no outro.
 *
 * Devolve problemas em vez de os atirar: quem chama decide se falha logo ou se
 * junta tudo para mostrar de uma vez.
 */

export type ContentEntry<T> = { data: T; body: string; filePath: string };

export function collectDuplicateSlugs<T extends { slug: string }>(
  entries: ContentEntry<T>[],
  label: string,
) {
  const seen = new Map<string, string>();
  const problems: string[] = [];

  for (const { data, filePath } of entries) {
    const previous = seen.get(data.slug);

    if (previous) {
      problems.push(
        `${filePath}: o slug "${data.slug}" (${label}) já é usado por ${previous}`,
      );
      continue;
    }

    seen.set(data.slug, filePath);
  }

  return problems;
}

export function collectBrokenReferences(
  products: ContentEntry<Product>[],
  categories: ContentEntry<Category>[],
  stores: ContentEntry<Store>[],
  occasions: ContentEntry<Occasion>[] = [],
) {
  const categorySlugs = new Set(categories.map(({ data }) => data.slug));
  const storeSlugs = new Set(stores.map(({ data }) => data.slug));
  const occasionSlugs = new Set(occasions.map(({ data }) => data.slug));
  const problems: string[] = [];

  for (const { data, filePath } of products) {
    if (!categorySlugs.has(data.category)) {
      problems.push(
        `${filePath}: a categoria "${data.category}" não existe em content/categories/`,
      );
    }

    if (data.received && !occasionSlugs.has(data.received)) {
      problems.push(
        `${filePath}: a ocasião "${data.received}" não existe em content/occasions/`,
      );
    }

    const seenStores = new Set<string>();

    for (const entry of data.stores) {
      // A repetição já explica a segunda ocorrência: não vale a pena repetir
      // também o aviso de loja inexistente.
      if (seenStores.has(entry.store)) {
        problems.push(
          `${filePath}: a loja "${entry.store}" está repetida no mesmo produto`,
        );
        continue;
      }

      seenStores.add(entry.store);

      if (!storeSlugs.has(entry.store)) {
        problems.push(
          `${filePath}: a loja "${entry.store}" não existe em content/stores/`,
        );
      }
    }
  }

  return problems;
}

/**
 * Exatamente uma ocasião aberta de cada vez. Zero significa que as reservas não
 * teriam onde aterrar; duas significa que ninguém sabe qual conta.
 */
export function collectOccasionProblems(occasions: ContentEntry<Occasion>[]) {
  const open = occasions.filter(({ data }) => data.status === "aberta");

  if (occasions.length === 0) {
    return ["content/occasions/: não existe nenhuma ocasião"];
  }

  if (open.length === 0) {
    return [
      "content/occasions/: nenhuma ocasião está aberta — as reservas não teriam onde aterrar",
    ];
  }

  if (open.length > 1) {
    return [
      `content/occasions/: há ${open.length} ocasiões abertas (${open
        .map(({ data }) => data.slug)
        .join(", ")}) — só pode haver uma`,
    ];
  }

  return [];
}

export function collectContentProblems(
  products: ContentEntry<Product>[],
  categories: ContentEntry<Category>[],
  stores: ContentEntry<Store>[],
  occasions: ContentEntry<Occasion>[] = [],
) {
  return [
    ...collectDuplicateSlugs(products, "produto"),
    ...collectDuplicateSlugs(categories, "categoria"),
    ...collectDuplicateSlugs(stores, "loja"),
    ...collectDuplicateSlugs(occasions, "ocasião"),
    ...collectOccasionProblems(occasions),
    ...collectBrokenReferences(products, categories, stores, occasions),
  ];
}

export function formatContentProblems(problems: string[]) {
  return `Conteúdo MDX inválido:\n${problems
    .map((problem) => `  · ${problem}`)
    .join("\n")}`;
}
