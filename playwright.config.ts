import { defineConfig, devices } from "@playwright/test";

const PORT = 3100;
const BASE_URL = `http://127.0.0.1:${PORT}`;

/**
 * Testes end-to-end (`TEST-004`).
 *
 * Correm contra o **build de produção**, não contra o `next dev`: é o que vai
 * para o ar, e é o único sítio onde a CSP (`SEC-013`), os cabeçalhos e a
 * prerenderização estática se comportam como em produção. O `next dev` traz
 * ainda o overlay de erros e o HMR, que sujam os testes.
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  // Um `.only` esquecido passaria a suite inteira a verde sem a correr.
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI
    ? [["github"], ["html", { open: "never" }]]
    : [["list"], ["html", { open: "never" }]],
  expect: { timeout: 10_000 },
  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "desktop",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } },
    },
  ],
  webServer: {
    command: `pnpm build && pnpm start --port ${PORT}`,
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    // O build entra no tempo: numa máquina fria não fica por menos.
    timeout: 300_000,
    stdout: "pipe",
    stderr: "pipe",
    env: {
      NEXT_PUBLIC_SITE_URL: BASE_URL,
      /**
       * As reservas são compiladas para fora quando não há configuração
       * (`areReservationsEnabled`), por isso sem estas variáveis não havia nada
       * para testar. O destino é falso de propósito: os testes intercetam os
       * pedidos e nunca sai tráfego da máquina — nenhum Supabase real é tocado.
       */
      NEXT_PUBLIC_SUPABASE_URL: "https://stub.supabase.co",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: "stub-anon-key-for-e2e",
    },
  },
});
