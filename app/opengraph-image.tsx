import { ImageResponse } from "next/og";

import { OG_SIZE, loadOgFonts, ogColors, ogGlow } from "@/lib/og/card";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";

export const alt = SITE_NAME;
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image() {
  const fonts = await loadOgFonts();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
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
            position: "relative",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 76,
              fontWeight: 600,
              letterSpacing: -2.5,
              lineHeight: 1.1,
              color: ogColors.foreground,
              maxWidth: 880,
            }}
          >
            Ideias de presentes, num só sítio.
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 28,
              fontSize: 30,
              lineHeight: 1.45,
              color: ogColors.muted,
              maxWidth: 760,
            }}
          >
            {SITE_DESCRIPTION}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            position: "relative",
          }}
        >
          <svg width="52" height="52" viewBox="0 0 32 32">
            <path
              d="M17.6 5H25a2 2 0 0 1 2 2v7.4a2 2 0 0 1-.59 1.42L16.4 26.41a2 2 0 0 1-2.83 0L5.59 18.4a2 2 0 0 1 0-2.83L16.18 5.59A2 2 0 0 1 17.6 5Z"
              fill={ogColors.accent}
            />
            <circle cx="21.4" cy="10.6" r="2.1" fill={ogColors.background} />
          </svg>
          <div
            style={{
              display: "flex",
              fontSize: 30,
              fontWeight: 600,
              color: ogColors.foreground,
            }}
          >
            {SITE_NAME}
          </div>
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
