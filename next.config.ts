import path from "node:path";

import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

/**
 * A origem do Supabase tem de estar no `connect-src`, senão as reservas
 * (`SEC-008`) são bloqueadas pela política. Sem a variável definida, a
 * funcionalidade está desligada e o curinga não abre nada em uso.
 */
function supabaseOrigin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!url) {
    return "https://*.supabase.co";
  }

  try {
    return new URL(url).origin;
  } catch {
    return "https://*.supabase.co";
  }
}

/**
 * Content Security Policy (`SEC-013`).
 *
 * `script-src` precisa de `'unsafe-inline'`: o Next injeta scripts inline
 * (bootstrap e dados de Flight) e o tema é aplicado antes da hidratação para
 * não haver flash de branco. A alternativa — nonces — exige `middleware`, que
 * tornaria dinâmicas páginas que hoje são estáticas (`REPO-004`). A troca é
 * deliberada: este site não tem sessões nem dados privados a proteger de um
 * script injetado, e as diretivas que mais valem aqui (`frame-ancestors`,
 * `object-src`, `base-uri`, `form-action`) continuam estritas.
 */
function contentSecurityPolicy() {
  return [
    "default-src 'self'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "object-src 'none'",
    `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https://m.media-amazon.com",
    "font-src 'self'",
    `connect-src 'self' ${supabaseOrigin()}${isDev ? " ws: wss:" : ""}`,
    "manifest-src 'self'",
    ...(isDev ? [] : ["upgrade-insecure-requests"]),
  ].join("; ");
}

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.resolve(__dirname),
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "m.media-amazon.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: contentSecurityPolicy() },
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Redundante com `frame-ancestors`, mas cobre browsers antigos.
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
