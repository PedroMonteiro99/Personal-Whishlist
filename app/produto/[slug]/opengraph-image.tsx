import { ImageResponse } from "next/og";

import { getProductBySlug, getProductSlugs } from "@/lib/catalog";
import { formatPrice, formatStoreCount } from "@/lib/format";
import {
  OG_SIZE,
  loadOgFonts,
  loadRemoteImage,
  ogColors,
  ogGlow,
} from "@/lib/og/card";
import { SITE_NAME } from "@/lib/site";

export const alt = "Produto na wishlist";
export const size = OG_SIZE;
export const contentType = "image/png";

// Pré-gerada no build: quando o WhatsApp for buscar a imagem, ela já é um
// ficheiro estático — sem cold start e sem depender do CDN da loja nesse momento.
export async function generateStaticParams() {
  const slugs = await getProductSlugs();

  return slugs.map((slug) => ({ slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [product, fonts] = await Promise.all([
    getProductBySlug(slug),
    loadOgFonts(),
  ]);

  const photo = await loadRemoteImage(product?.availableImages[0]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          padding: 72,
          background: ogColors.background,
          fontFamily: "Geist",
          position: "relative",
        }}
      >
        <div style={ogGlow} />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            flex: 1,
            paddingRight: 56,
            position: "relative",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                fontSize: product && product.name.length > 34 ? 58 : 68,
                fontWeight: 600,
                letterSpacing: -2,
                lineHeight: 1.1,
                color: ogColors.foreground,
              }}
            >
              {product?.name ?? "Produto"}
            </div>
            {product ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  marginTop: 32,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    fontSize: 54,
                    fontWeight: 600,
                    letterSpacing: -1,
                    whiteSpace: "nowrap",
                    color: ogColors.accent,
                  }}
                >
                  {formatPrice(product)}
                </div>
                <div
                  style={{
                    display: "flex",
                    marginTop: 14,
                    fontSize: 26,
                    color: ogColors.muted,
                  }}
                >
                  {[
                    product.storeEntries.length > 0
                      ? `em ${formatStoreCount(product.storeEntries.length)}`
                      : null,
                    product.categoryName,
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </div>
              </div>
            ) : null}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <svg width="44" height="44" viewBox="0 0 32 32">
              <path
                d="M17.6 5H25a2 2 0 0 1 2 2v7.4a2 2 0 0 1-.59 1.42L16.4 26.41a2 2 0 0 1-2.83 0L5.59 18.4a2 2 0 0 1 0-2.83L16.18 5.59A2 2 0 0 1 17.6 5Z"
                fill={ogColors.accent}
              />
              <circle cx="21.4" cy="10.6" r="2.1" fill={ogColors.background} />
            </svg>
            <div
              style={{
                display: "flex",
                fontSize: 26,
                fontWeight: 600,
                color: ogColors.foreground,
              }}
            >
              {SITE_NAME}
            </div>
          </div>
        </div>

        {/* A fotografia mantém-se inteira sobre a Placa de Produto, tal como
            nos cartões da aplicação. Sem fotografia, o painel não aparece. */}
        {photo ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 430,
              height: 486,
              borderRadius: 32,
              background: ogColors.plate,
              position: "relative",
            }}
          >
            <img
              src={photo}
              width={366}
              height={422}
              style={{ objectFit: "contain" }}
              alt=""
            />
          </div>
        ) : null}
      </div>
    ),
    { ...size, fonts },
  );
}
