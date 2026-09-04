import path from "node:path";

import { defineConfig } from "vitest/config";

const alias = {
  "@": path.resolve(import.meta.dirname, "."),
};

export default defineConfig({
  test: {
    projects: [
      {
        resolve: { alias },
        test: {
          // Só lógica pura e leitura de conteúdo: não é preciso ambiente de
          // browser (ver TEST-002 no PROJECT_BLUEPRINT.md).
          name: "unit",
          environment: "node",
          include: ["{lib,features,scripts}/**/*.test.ts"],
        },
      },
      {
        resolve: { alias },
        test: {
          // Componentes com lógica de estado relevante (ver TEST-003).
          name: "components",
          environment: "jsdom",
          include: ["{components,features,hooks}/**/*.test.tsx"],
          setupFiles: ["./vitest.setup.ts"],
        },
      },
    ],
  },
});
