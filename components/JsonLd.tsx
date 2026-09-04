/**
 * Injeta um bloco JSON-LD. O conteúdo é gerado no servidor a partir do
 * catálogo — nunca de dados do utilizador — por isso não há aqui superfície
 * de injeção.
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
