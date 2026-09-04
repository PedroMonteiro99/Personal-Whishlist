import { z } from "@/lib/zod";

/**
 * Schemas de validação para o frontmatter dos ficheiros MDX.
 * Ver PROJECT_BLUEPRINT.md — secção 15 (MDX Content) e regras CONTENT-XXX.
 */

/**
 * Só `http`/`https`. O `.url()` do Zod aceita qualquer esquema — incluindo
 * `javascript:` e `data:` — e estes valores vão parar diretamente a um `href`
 * em `StoreLink` e em `ProductDetail` (`SEC-012`).
 */
function isHttpUrl(value: string) {
  try {
    const { protocol } = new URL(value);

    return protocol === "http:" || protocol === "https:";
  } catch {
    return false;
  }
}

const externalUrlSchema = z
  .string()
  .url()
  .refine(isHttpUrl, "O URL tem de usar http:// ou https://.");

/**
 * Uma loja onde o produto existe, com o link direto e o preço nessa loja.
 * O nome visível vem de `content/stores/<slug>.mdx`; `label` só é preciso
 * quando se quer sobrepor esse nome (ex.: "Amazon ES" vs "Amazon").
 */
export const productStoreSchema = z.object({
  store: z.string().min(1),
  url: externalUrlSchema,
  price: z.number().nonnegative().optional(),
  label: z.string().min(1).optional(),
});

export const productSeoSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
});

export const productSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  category: z.string().min(1),
  stores: z.array(productStoreSchema).default([]),
  currency: z.string().length(3).default("EUR"),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
  favorite: z.boolean().default(false),
  images: z.array(z.string()).default([]),
  /**
   * O slug da ocasião em que este presente foi recebido. Sai das listas de
   * navegação mas mantém a sua página — o slug tem de continuar a resolver
   * (SEO-005), porque pode ter sido partilhado.
   */
  received: z.string().min(1).optional(),
  seo: productSeoSchema.optional(),
});

/**
 * Uma ocasião é um período de tempo, não um agrupamento de produtos: o Natal,
 * um aniversário. Exatamente uma está aberta de cada vez (ver `CONTENT-006`).
 */
export const occasionSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  date: z.string().min(1),
  status: z.enum(["aberta", "fechada"]),
});

export const categorySchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
  icon: z.string().optional(),
  order: z.number().int().nonnegative().default(0),
});

export const storeSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  url: externalUrlSchema,
  logo: z.string().optional(),
});

export type Product = z.infer<typeof productSchema>;
export type ProductStore = z.infer<typeof productStoreSchema>;
export type Category = z.infer<typeof categorySchema>;
export type Store = z.infer<typeof storeSchema>;
export type Occasion = z.infer<typeof occasionSchema>;
