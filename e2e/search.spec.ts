import { expect, test } from "@playwright/test";

/**
 * A URL é a fonte de verdade da pesquisa e dos filtros (`ROUTE-005`): o que se
 * testa aqui é que um link partilhado reproduz exatamente o mesmo ecrã.
 */
test.describe("pesquisa e filtros", () => {
  test("escrever leva o termo para a URL e filtra a lista", async ({ page }) => {
    await page.goto("/pesquisa");

    await page.getByLabel("Pesquisar produtos").fill("benq");

    await expect(page).toHaveURL(/\?q=benq/);
    await expect(page.getByText(/BenQ ScreenBar Pro/i).first()).toBeVisible();
  });

  test("um filtro não deita fora a pesquisa ativa", async ({ page }) => {
    // Regressão: cada controlo só é dono do seu parâmetro. Reconstruir a URL
    // de raiz apagava o termo pesquisado.
    await page.goto("/pesquisa?q=benq");

    await page.getByLabel("Loja").selectOption("amazon");

    await expect(page).toHaveURL(/q=benq/);
    await expect(page).toHaveURL(/loja=amazon/);
  });

  test("limpar filtros mantém o termo pesquisado", async ({ page }) => {
    await page.goto("/pesquisa?q=benq&loja=amazon&preco=50-150");

    await page.getByRole("button", { name: "Limpar filtros" }).click();

    await expect(page).toHaveURL(/\/pesquisa\?q=benq$/);
    await expect(page.getByLabel("Pesquisar produtos")).toHaveValue("benq");
  });

  test("chegar a /pesquisa limpo não repõe um termo antigo", async ({
    page,
  }) => {
    // Regressão real: com o debounce a decorrer, uma mudança de URL vinda de
    // fora reescrevia o termo anterior e desfazia a navegação do visitante.
    await page.goto("/pesquisa?q=benq");
    await expect(page.getByLabel("Pesquisar produtos")).toHaveValue("benq");

    await page.goto("/pesquisa");

    await expect(page.getByLabel("Pesquisar produtos")).toHaveValue("");
    await page.waitForTimeout(600); // mais do que o debounce de 250ms
    await expect(page).toHaveURL(/\/pesquisa$/);
  });

  test("uma pesquisa sem resultados explica-se", async ({ page }) => {
    await page.goto("/pesquisa?q=zzzzzznaoexiste");

    await expect(
      page.getByText(/zzzzzznaoexiste|sem resultados|nada/i).first(),
    ).toBeVisible();
  });
});
