import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = defineConfig([
  ...nextVitals,
  globalIgnores([
    // Ignores por defeito do eslint-config-next, repostos ao substituí-los.
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Específicos deste projeto.
    "dist/**",
    ".github/skills/**",
  ]),
]);

export default eslintConfig;
