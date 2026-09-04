import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

/**
 * Peças partilhadas pelas imagens Open Graph.
 *
 * As cores estão em hexadecimal literal de propósito: o Satori não resolve
 * variáveis CSS, e estas imagens são sempre escuras — não têm tema. Os valores
 * são os tokens do modo escuro convertidos (ver DESIGN.md).
 */
export const OG_SIZE = { width: 1200, height: 630 };

export const ogColors = {
  background: "#030712",
  surface: "#0b1120",
  border: "#1f2937",
  foreground: "#f8fafc",
  muted: "#9ca3af",
  accent: "#3b82f6",
  plate: "#ffffff",
};

/**
 * A luz da montra, aplicada como camada absoluta sobre toda a imagem: uma
 * única fonte azul vinda de cima. Em `rgba` porque o Satori não interpola
 * hexadecimal de 8 dígitos de forma fiável — e um alfa mal interpolado deixa
 * uma aresta reta onde devia haver desvanecimento.
 */
export const ogGlow = {
  position: "absolute" as const,
  top: 0,
  left: 0,
  width: OG_SIZE.width,
  height: OG_SIZE.height,
  backgroundImage:
    "radial-gradient(circle at 50% -18%, rgba(59, 130, 246, 0.38) 0%, rgba(59, 130, 246, 0.12) 38%, rgba(59, 130, 246, 0) 66%)",
};

export async function loadOgFonts() {
  // Lido do disco, não por `fetch`: o Turbopack não serve URLs `file://`, e a
  // fonte tem de vir do repositório para o build não depender da rede.
  const [regular, semibold] = await Promise.all([
    readFile(fileURLToPath(new URL("./Geist-Regular.ttf", import.meta.url))),
    readFile(fileURLToPath(new URL("./Geist-SemiBold.ttf", import.meta.url))),
  ]);

  return [
    {
      name: "Geist",
      data: regular,
      weight: 400 as const,
      style: "normal" as const,
    },
    {
      name: "Geist",
      data: semibold,
      weight: 600 as const,
      style: "normal" as const,
    },
  ];
}

/**
 * A fotografia do produto é remota (CDN da loja). Se falhar, a imagem OG tem
 * de sair na mesma — por isso é buscada aqui, com falha silenciosa, em vez de
 * ser entregue ao Satori, que rebentaria o build.
 */
export async function loadRemoteImage(url?: string) {
  if (!url) {
    return undefined;
  }

  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(5000) });

    if (!response.ok) {
      return undefined;
    }

    const buffer = await response.arrayBuffer();
    const contentType = response.headers.get("content-type") ?? "image/jpeg";

    return `data:${contentType};base64,${Buffer.from(buffer).toString("base64")}`;
  } catch {
    return undefined;
  }
}
