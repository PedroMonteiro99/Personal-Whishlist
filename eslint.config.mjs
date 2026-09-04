import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = defineConfig([
  ...nextVitals,
  {
    // As imagens Open Graph são desenhadas pelo Satori, que só entende `<img>`:
    // o `next/image` não corre dentro de `ImageResponse`.
    files: ["**/opengraph-image.tsx", "**/twitter-image.tsx"],
    rules: { "@next/next/no-img-element": "off" },
  },
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
