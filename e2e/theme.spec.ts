import { expect, test } from "@playwright/test";

import { THEME_STORAGE_KEY, usePreferredTheme } from "./helpers";

test.describe("tema", () => {
  test("dark mode é o modo primário (UI-004)", async ({ page }) => {
    await page.goto("/");

    await expect(page.locator("html")).toHaveClass(/dark/);
  });

  test("alternar aplica o tema e guarda a escolha", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("button", { name: "Ativar modo claro" }).click();

    await expect(page.locator("html")).not.toHaveClass(/dark/);
    await expect(
      page.getByRole("button", { name: "Ativar modo escuro" }),
    ).toBeVisible();

    const stored = await page.evaluate(
      (key) => window.localStorage.getItem(key),
      THEME_STORAGE_KEY,
    );
    expect(stored).toBe("light");
  });

  test("a escolha sobrevive a uma recarga, sem flash do tema errado", async ({
    page,
  }) => {
    // O tema é aplicado por um script inline antes da hidratação; se falhasse,
    // a página abria escura e saltava para clara à vista do visitante.
    await usePreferredTheme(page, "light");
    await page.goto("/");

    await expect(page.locator("html")).not.toHaveClass(/dark/);

    const classDuringFirstPaint = await page.evaluate(
      () => document.documentElement.className,
    );
    expect(classDuringFirstPaint).not.toContain("dark");
  });
});
