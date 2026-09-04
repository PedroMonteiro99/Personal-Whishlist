import path from "node:path";

import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Só lógica pura e leitura de conteúdo: não é preciso ambiente de browser
    // (ver TEST-002 no PROJECT_BLUEPRINT.md).
    environment: "node",
    include: ["{lib,features,scripts}/**/*.test.ts"],
  },
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "."),
    },
  },
});
