/**
 * Converte um nome legível no slug que dá nome ao ficheiro e à rota.
 *
 * O catálogo é português: "Coração", "Ténis", "Ação" têm de dar
 * `coracao`, `tenis`, `acao`. Sem a decomposição NFD os acentos sobreviviam ao
 * filtro e acabavam num URL escapado com `%CC%81` (`SEO-005` pede slugs
 * estáveis e legíveis).
 */
export function toSlug(value: string) {
  return value
    .normalize("NFD")
    // Remove os diacríticos que a decomposição separou da letra base.
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[ø]/gi, "o")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
