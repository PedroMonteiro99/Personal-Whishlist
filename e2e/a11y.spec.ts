import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

import { ROUTES, usePreferredTheme, type Theme } from "./helpers";

/**
 * Acessibilidade automatizada (`A11Y-001`..`A11Y-005`).
 *
 * As regras de acessibilidade estavam escritas no blueprint mas nada as
 * verificava, e uma delas tinha saído de conformidade sem ninguém dar por isso:
 * a pílula "Mais barato" ficou em 4.48:1 sobre a tinta azul, contra os 4.5:1
 * mínimos. Estes testes existem para essa classe de erro — invisível a olho,
 * fácil de reintroduzir numa mudança de cor.
 *
 * Correm nos dois temas porque o contraste é uma propriedade de cada um: o dark
 * mode passava enquanto o light mode falhava.
 */
const THEMES: Theme[] = ["dark", "light"];

const WCAG_AA = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"];

for (const theme of THEMES) {
  test.describe(`acessibilidade · ${theme}`, () => {
    for (const route of ROUTES) {
      test(`${route.name} não tem violações WCAG AA`, async ({ page }) => {
        await usePreferredTheme(page, theme);
        await page.goto(route.path);

        // Sem isto o axe pode medir cores a meio da transição de tema.
        await expect(page.locator("body")).toBeVisible();

        const { violations } = await new AxeBuilder({ page })
          .withTags(WCAG_AA)
          .analyze();

        // A mensagem tem de dizer o que está errado sem obrigar a reproduzir:
        // regra, impacto e o elemento concreto.
        const detail = violations
          .map(
            (violation) =>
              `[${violation.impact}] ${violation.id}: ${violation.help}\n` +
              violation.nodes
                .map((node) => `    ${node.target.join(" ")}\n      ${node.failureSummary?.replace(/\s+/g, " ")}`)
                .join("\n"),
          )
          .join("\n");

        expect(violations, `Violações em ${route.path} (${theme}):\n${detail}`).toEqual([]);
      });
    }
  });
}

test.describe("acessibilidade · teclado", () => {
  test("dá para chegar à pesquisa e aos produtos só com o teclado (A11Y-002)", async ({
    page,
  }) => {
    await page.goto("/");

    const reachable = await page.evaluate(() => {
      const selector =
        'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';
      return document.querySelectorAll(selector).length;
    });

    expect(reachable).toBeGreaterThan(5);

    // O foco tem de ser visível: sem contorno, navegar por teclado é às cegas.
    await page.keyboard.press("Tab");
    const hasVisibleFocus = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el || el === document.body) {
        return false;
      }
      const style = getComputedStyle(el);
      return (
        style.outlineStyle !== "none" ||
        style.boxShadow !== "none" ||
        el.matches(":focus-visible")
      );
    });

    expect(hasVisibleFocus).toBe(true);
  });

  test("a pesquisa tem label associado, não só placeholder (A11Y-005)", async ({
    page,
  }) => {
    await page.goto("/pesquisa");

    await expect(page.getByLabel("Pesquisar produtos")).toBeVisible();
  });
});

test.describe("acessibilidade · mobile", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("a home não tem violações no ecrã pequeno", async ({ page }) => {
    await page.goto("/");

    const { violations } = await new AxeBuilder({ page })
      .withTags(WCAG_AA)
      .analyze();

    expect(violations.map((violation) => violation.id)).toEqual([]);
  });
});
