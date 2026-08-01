import { z } from "zod";

/**
 * Schemas de validação para o frontmatter dos ficheiros MDX.
 * Ver PROJECT_BLUEPRINT.md — secção 15 (MDX Content) e regras CONTENT-XXX.
 */

export const productLinkSchema = z.object({
  label: z.string().min(1),
  url: z.string().url(),
});

export const productSeoSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
});

export const productSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  category: z.string().min(1),
  store: z.string().min(1),
  price: z.number().nonnegative().optional(),
  currency: z.string().length(3).default("EUR"),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
  favorite: z.boolean().default(false),
  images: z.array(z.string()).default([]),
  links: z.array(productLinkSchema).default([]),
  seo: productSeoSchema.optional(),
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
  url: z.string().url(),
  logo: z.string().optional(),
});

export type Product = z.infer<typeof productSchema>;
export type Category = z.infer<typeof categorySchema>;
export type Store = z.infer<typeof storeSchema>;
