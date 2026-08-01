import { createClient } from "@supabase/supabase-js";

/**
 * Cliente Supabase para uso no browser / Server Components de leitura pública.
 * Ver PROJECT_BLUEPRINT.md — REPO-001/002: nunca escrever diretamente na base de dados
 * a partir da aplicação; a escrita ocorre apenas via scripts de sincronização (GitHub Actions).
 */
export function createSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Variáveis de ambiente do Supabase em falta. Ver .env.example.",
    );
  }

  return createClient(url, anonKey);
}
