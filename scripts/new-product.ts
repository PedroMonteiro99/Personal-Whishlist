import fs from "node:fs/promises";
import path from "node:path";
import readline from "node:readline/promises";
import { fileURLToPath } from "node:url";

import matter from "gray-matter";

import { categorySchema, productSchema, storeSchema } from "@/lib/content/schemas";
import { toSlug } from "@/lib/slug";

/**
 * Cria um ficheiro de produto em `content/wishlist/<categoria>/<slug>.mdx`.
 *
 * O catálogo é escrito à mão, um ficheiro por produto (`CONTENT-001`), e o
 * frontmatter tem campos que é fácil escrever mal: o slug da loja tem de
 * existir em `content/stores/`, o preço é número e não texto, o `category` tem
 * de casar com a pasta. Este script pergunta, valida contra os mesmos schemas
 * Zod do build e escreve o ficheiro já correto — em vez de se descobrir o erro
 * no `validate:content` a seguir.
 *
 * Não substitui o Git como fonte de verdade (`REPO-004`): só escreve o MDX que
 * a seguir é commitado como qualquer outro.
 */

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(SCRIPT_DIR, "..");
const CONTENT_ROOT = path.join(PROJECT_ROOT, "content");

type NamedEntry = { slug: string; name: string };

async function readCollection(
  directory: string,
  schema: { parse: (value: unknown) => NamedEntry },
): Promise<NamedEntry[]> {
  const files = await fs.readdir(directory);
  const entries = await Promise.all(
    files
      .filter((file) => file.endsWith(".mdx"))
      .map(async (file) => {
        const raw = await fs.readFile(path.join(directory, file), "utf8");
        return schema.parse(matter(raw).data);
      }),
  );

  return entries.sort((left, right) => left.name.localeCompare(right.name, "pt"));
}

function quote(value: string) {
  return `"${value.replace(/"/g, '\\"')}"`;
}

class Prompter {
  /**
   * As perguntas são servidas por um iterador de linhas, e não por
   * `rl.question`. Com entrada que não é um terminal — um ficheiro de
   * respostas, um teste — o readline emite as linhas todas de uma vez, e só a
   * primeira pergunta as apanhava: as restantes perdiam-se e o script ficava a
   * aguardar entrada que já tinha passado. O iterador pausa o fluxo entre
   * leituras e serve uma linha de cada vez, em terminal e fora dele.
   */
  private readonly lines: AsyncIterator<string>;

  constructor(rl: readline.Interface) {
    this.lines = rl[Symbol.asyncIterator]();
  }

  private async read(prompt: string) {
    process.stdout.write(prompt);

    const { value, done } = await this.lines.next();

    if (done) {
      throw new Error("A entrada terminou antes de o produto estar completo.");
    }

    return String(value).trim();
  }

  async text(question: string, { required = false, fallback = "" } = {}) {
    for (;;) {
      const suffix = fallback ? ` [${fallback}]` : "";
      const answer = await this.read(`${question}${suffix}: `);
      const value = answer || fallback;

      if (value || !required) {
        return value;
      }

      console.log("  ! Este campo é obrigatório.");
    }
  }

  async choice(question: string, options: NamedEntry[]) {
    console.log(`\n${question}`);
    options.forEach((option, index) => {
      console.log(`  ${index + 1}) ${option.name}  (${option.slug})`);
    });

    for (;;) {
      const answer = await this.read("  Número: ");
      const index = Number(answer) - 1;

      if (Number.isInteger(index) && index >= 0 && index < options.length) {
        return options[index]!;
      }

      console.log(`  ! Escolhe um número entre 1 e ${options.length}.`);
    }
  }

  async confirm(question: string, fallback = false) {
    const hint = fallback ? "S/n" : "s/N";
    const answer = (await this.read(`${question} (${hint}): `)).toLowerCase();

    if (!answer) {
      return fallback;
    }

    return answer.startsWith("s") || answer.startsWith("y");
  }

  async price(question: string) {
    for (;;) {
      const answer = (await this.read(`${question}: `)).replace(",", ".");

      if (!answer) {
        return undefined;
      }

      const value = Number(answer);

      if (Number.isFinite(value) && value >= 0) {
        return value;
      }

      console.log("  ! Escreve um número (ex: 139.99), ou deixa vazio.");
    }
  }
}

async function main() {
  const [categories, stores] = await Promise.all([
    readCollection(path.join(CONTENT_ROOT, "categories"), categorySchema),
    readCollection(path.join(CONTENT_ROOT, "stores"), storeSchema),
  ]);

  if (categories.length === 0 || stores.length === 0) {
    throw new Error(
      "É preciso pelo menos uma categoria e uma loja em content/ antes de criar um produto.",
    );
  }

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  const ask = new Prompter(rl);

  try {
    console.log("\nNovo produto na wishlist\n");

    const name = await ask.text("Nome do produto", { required: true });
    const slug = await ask.text("Slug", { fallback: toSlug(name) });
    const category = await ask.choice("Categoria:", categories);

    const targetDir = path.join(CONTENT_ROOT, "wishlist", category.slug);
    const targetFile = path.join(targetDir, `${slug}.mdx`);

    // Nunca sobrepor: um ficheiro existente é conteúdo real, e o slug é
    // estável por contrato (SEO-005).
    if (
      await fs
        .access(targetFile)
        .then(() => true)
        .catch(() => false)
    ) {
      throw new Error(
        `Já existe ${path.relative(PROJECT_ROOT, targetFile).replaceAll(path.sep, "/")}.`,
      );
    }

    const productStores: Array<{ store: string; url: string; price?: number }> = [];

    do {
      const store = await ask.choice("Loja:", stores);
      const url = await ask.text(`URL do produto na ${store.name}`, {
        required: true,
      });
      const price = await ask.price(`Preço na ${store.name} (vazio = sob consulta)`);

      productStores.push({ store: store.slug, url, price });
    } while (await ask.confirm("Adicionar outra loja?"));

    const priorityChoice = await ask.choice("Prioridade:", [
      { slug: "high", name: "Alta" },
      { slug: "medium", name: "Média" },
      { slug: "low", name: "Baixa" },
    ]);
    const favorite = await ask.confirm("É favorito?");

    const images: string[] = [];
    for (;;) {
      const image = await ask.text(
        `URL da imagem ${images.length + 1} (vazio para terminar)`,
      );

      if (!image) {
        break;
      }

      images.push(image);
    }

    const seoDescription = await ask.text(
      "Descrição curta para SEO (vazio para saltar)",
    );
    const note = await ask.text("Nota pessoal (corpo do MDX)");

    const product = {
      name,
      slug,
      category: category.slug,
      stores: productStores,
      currency: "EUR",
      priority: priorityChoice.slug,
      favorite,
      images,
      ...(seoDescription
        ? { seo: { title: `${name} — Wishlist`, description: seoDescription } }
        : {}),
    };

    // A mesma validação que corre no build: um ficheiro escrito por este script
    // nunca pode falhar o `validate:content` (TEST-001).
    const parsed = productSchema.safeParse(product);

    if (!parsed.success) {
      throw new Error(
        `Frontmatter inválido:\n${parsed.error.issues
          .map((issue) => `  · ${issue.path.join(".")}: ${issue.message}`)
          .join("\n")}`,
      );
    }

    const lines = [
      "---",
      `name: ${quote(name)}`,
      `slug: ${quote(slug)}`,
      `category: ${quote(category.slug)}`,
      "stores:",
      ...productStores.flatMap((entry) => [
        `  - store: ${quote(entry.store)}`,
        `    url: ${quote(entry.url)}`,
        ...(entry.price === undefined ? [] : [`    price: ${entry.price}`]),
      ]),
      `currency: "EUR"`,
      `priority: ${quote(priorityChoice.slug)}`,
      `favorite: ${favorite}`,
      ...(images.length > 0
        ? ["images:", ...images.map((image) => `  - ${quote(image)}`)]
        : ["images: []"]),
      ...(seoDescription
        ? [
            "seo:",
            `  title: ${quote(`${name} — Wishlist`)}`,
            `  description: ${quote(seoDescription)}`,
          ]
        : []),
      "---",
      "",
      note || "Nota pessoal: (por escrever)",
      "",
    ];

    await fs.mkdir(targetDir, { recursive: true });
    await fs.writeFile(targetFile, lines.join("\n"), "utf8");

    const relative = path
      .relative(PROJECT_ROOT, targetFile)
      .replaceAll(path.sep, "/");

    console.log(`\nCriado: ${relative}`);
    console.log("Confirma com: pnpm validate:content");
  } finally {
    rl.close();
  }
}

main().catch((error: unknown) => {
  console.error(`\n${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
});
