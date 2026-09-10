import { expect, test } from "@playwright/test";

import { stubReservations } from "./helpers";

const PRODUCT = "/produto/benq-screenbar-pro";

/**
 * O anunciador de rotas do Next também tem `role="alert"`; sem restringir ao
 * cartão, o seletor apanhava dois elementos.
 */
const giftAlert = (page: import("@playwright/test").Page) =>
  page.getByRole("alert").filter({ hasText: /\S/ });

/**
 * O fluxo de reservas (`SEC-008`) de ponta a ponta, com as RPC intercetadas.
 * Nenhum pedido sai da máquina — ver `stubReservations`.
 */
test.describe("reservas", () => {
  test("reservar mostra que o presente fica tratado, e dá para desfazer", async ({
    page,
  }) => {
    await stubReservations(page);
    await page.goto(PRODUCT);

    await page.getByLabel("O teu nome").fill("Ana");
    await page.getByRole("button", { name: /vou oferecer/i }).click();

    await expect(page.getByText("Vais oferecer este.")).toBeVisible();

    await page.getByRole("button", { name: /afinal já não vou/i }).click();

    await expect(page.getByLabel("O teu nome")).toBeVisible();
  });

  test("sem nome não reserva, e explica porquê", async ({ page }) => {
    await stubReservations(page);
    await page.goto(PRODUCT);

    await page.getByRole("button", { name: /vou oferecer/i }).click();

    await expect(giftAlert(page)).toContainText("Escreve o teu nome");
  });

  test("um presente já reservado por outra pessoa aparece como tal", async ({
    page,
  }) => {
    await stubReservations(page, {
      initial: [
        {
          product_slug: "benq-screenbar-pro",
          reserver_name: "Rita",
          created_at: new Date().toISOString(),
          is_mine: false,
        },
      ],
    });
    await page.goto(PRODUCT);

    await expect(page.getByText("Rita", { exact: true })).toBeVisible();
    await expect(page.getByLabel("O teu nome")).toHaveCount(0);
  });

  test("quando alguém se antecipa, o aviso é claro", async ({ page }) => {
    await stubReservations(page, { reserveSucceeds: false });
    await page.goto(PRODUCT);

    await page.getByLabel("O teu nome").fill("Ana");
    await page.getByRole("button", { name: /vou oferecer/i }).click();

    await expect(giftAlert(page)).toContainText("antecipou");
  });

  test("com o serviço em baixo, o catálogo continua utilizável", async ({
    page,
  }) => {
    // As reservas são um extra: uma falha esconde a funcionalidade em vez de
    // partir a página.
    await stubReservations(page, { fail: true });
    await page.goto(PRODUCT);

    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "BenQ ScreenBar Pro",
    );
    await expect(page.getByLabel("O teu nome")).toHaveCount(0);
    await expect(page.getByText("Onde comprar")).toBeVisible();
  });

  test("o modo dono esconde as reservas na interface", async ({ page }) => {
    await stubReservations(page, {
      initial: [
        {
          product_slug: "benq-screenbar-pro",
          reserver_name: "Rita",
          created_at: new Date().toISOString(),
          is_mine: false,
        },
      ],
    });
    await page.goto(PRODUCT);

    // `exact` é obrigatório: sem ele o Playwright faz correspondência parcial
    // sem distinguir maiúsculas, e "Rita" aparecia também dentro de "escrita",
    // no texto do rodapé.
    await expect(page.getByText("Rita", { exact: true })).toBeVisible();

    await page.getByRole("button", { name: /esconder as reservas/i }).click();

    await expect(page.getByText("Rita", { exact: true })).toHaveCount(0);
  });
});
