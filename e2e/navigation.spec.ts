import { expect, test } from "@playwright/test";

/**
 * O percurso que um visitante faz de facto: chega à home, escolhe uma
 * categoria, abre um produto e sai para a loja (`TEST-004`).
 */
test.describe("navegação", () => {
  test("da home até um produto, passando pela categoria", async ({ page }) => {
    await page.goto("/");

    await expect(
      page.getByRole("heading", { name: /ideias de presentes/i }),
    ).toBeVisible();

    await page.getByRole("link", { name: /^Gaming/ }).first().click();

    await expect(page).toHaveURL(/\/categoria\/gaming/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Gaming",
    );

    const firstProduct = page.getByRole("link", { name: /Core Ultra 9/i }).first();
    await firstProduct.click();

    await expect(page).toHaveURL(/\/produto\//);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("a página de produto mostra preço e para onde ir comprar", async ({
    page,
  }) => {
    await page.goto("/produto/benq-screenbar-pro");

    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "BenQ ScreenBar Pro",
    );
    await expect(page.getByText("Onde comprar")).toBeVisible();

    // Um link para fora tem de abrir noutro separador e sem passar o referrer
    // (SEC-012 garante o esquema; aqui garante-se o alvo).
    const storeLink = page
      .getByRole("link", { name: /PC Diga/i })
      .first();
    await expect(storeLink).toHaveAttribute("target", "_blank");
    await expect(storeLink).toHaveAttribute("rel", /noreferrer/);
    await expect(storeLink).toHaveAttribute("href", /^https:\/\//);
  });

  test("um slug que não existe devolve 404", async ({ page }) => {
    const response = await page.goto("/produto/nao-existe-de-todo");

    expect(response?.status()).toBe(404);
  });

  test("as páginas trazem os cabeçalhos de segurança (SEC-013)", async ({
    page,
  }) => {
    const response = await page.goto("/");
    const headers = response?.headers() ?? {};

    expect(headers["content-security-policy"]).toContain("frame-ancestors 'none'");
    expect(headers["x-content-type-options"]).toBe("nosniff");
    expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
  });
});
