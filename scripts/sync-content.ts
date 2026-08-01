/**
 * Script de sincronização MDX -> Supabase.
 * Ver PROJECT_BLUEPRINT.md — secção 16 (Synchronization) e regras SYNC-XXX.
 *
 * Fluxo: MDX (content/) → validação Zod → upsert no Supabase.
 * Este ficheiro é um ponto de partida — a implementação completa fica para a próxima sessão.
 */

async function main() {
  console.log("[sync-content] TODO: implementar leitura de content/, validação com Zod");
  console.log("[sync-content] TODO: implementar upsert em categories/stores/products/product_links");
}

main().catch((err) => {
  console.error("[sync-content] Falhou:", err);
  process.exit(1);
});
