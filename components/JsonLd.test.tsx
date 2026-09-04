import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { JsonLd } from "@/components/JsonLd";

function serialized(data: object) {
  const { container } = render(<JsonLd data={data} />);
  const script = container.querySelector(
    'script[type="application/ld+json"]',
  );

  if (!script) {
    throw new Error("Bloco JSON-LD não encontrado.");
  }

  return script.innerHTML;
}

describe("JsonLd", () => {
  it("escapa um `</script>` vindo do corpo do MDX", () => {
    // `JSON.stringify` sozinho não escapa `<`: um `</script>` numa nota
    // pessoal fechava o elemento e o resto virava HTML (SEC-011).
    const html = serialized({
      description: "Notas</script><script>alert(1)</script>",
    });

    expect(html).not.toContain("</script>");
    expect(html).not.toContain("<script>");
    expect(html).toContain("\\u003c");
  });

  it("escapa os separadores de linha U+2028 e U+2029", () => {
    // São JSON válido mas quebram um script inline em alguns motores.
    const html = serialized({ description: "a\u2028b\u2029c" });

    expect(html).not.toContain("\u2028");
    expect(html).not.toContain("\u2029");
  });

  it("mantém o JSON válido e com o mesmo conteúdo", () => {
    // Escapar não pode alterar o que os motores de busca leem.
    const data = {
      "@context": "https://schema.org",
      name: "Rato & Teclado <Pro>",
      description: "Linha 1\u2028Linha 2",
    };

    expect(JSON.parse(serialized(data))).toEqual(data);
  });
});
