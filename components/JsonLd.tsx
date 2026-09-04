/**
 * Injeta um bloco JSON-LD.
 *
 * `JSON.stringify` não escapa `<`, `>`, `&`, nem os separadores de linha
 * U+2028/U+2029. Como `productJsonLd` inclui o corpo do MDX (as notas
 * pessoais), um `</script>` escrito sem intenção fechava o elemento e o resto
 * do texto passava a ser interpretado como HTML (`SEC-011`).
 *
 * O conteúdo vem do Git, mas a barreira certa é na saída e não na confiança em
 * quem escreve o ficheiro. As sequências escapadas continuam a ser JSON
 * válido: quem consome os dados estruturados lê exatamente os mesmos
 * caracteres.
 */
function serializeJsonLd(data: object) {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  );
}
