import { describe, expect, it } from "vitest";

import { toSlug } from "@/lib/slug";

describe("toSlug", () => {
  it("passa um nome simples a minúsculas com hífenes", () => {
    expect(toSlug("BenQ ScreenBar Pro")).toBe("benq-screenbar-pro");
  });

  it("remove os acentos do português", () => {
    // Sem a decomposição NFD o acento sobrevivia e o slug ia parar ao URL
    // escapado, em vez de legível (SEO-005).
    expect(toSlug("Coração")).toBe("coracao");
    expect(toSlug("Ténis de corrida")).toBe("tenis-de-corrida");
    expect(toSlug("Ação")).toBe("acao");
  });

  it("colapsa pontuação e espaços repetidos num só hífen", () => {
    expect(toSlug("Teclado  —  75%  (branco)")).toBe("teclado-75-branco");
  });

  it("não deixa hífenes soltos nas pontas", () => {
    expect(toSlug("  Rato Logitech!  ")).toBe("rato-logitech");
    expect(toSlug("--LEGO--")).toBe("lego");
  });

  it("mantém os números, que distinguem modelos", () => {
    expect(toSlug("Core Ultra 9 285K")).toBe("core-ultra-9-285k");
  });
});
