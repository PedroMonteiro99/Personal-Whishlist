import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { ReservationsProvider } from "@/features/reservations/components/ReservationsProvider";
import { ThemeProvider } from "@/features/theme/components/ThemeProvider";
import {
  openGraphDefaults,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
} from "@/lib/site";

import "./globals.css";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  // Sem `metadataBase` as imagens OG saem em caminho relativo e nenhuma app
  // de mensagens as consegue resolver.
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  openGraph: {
    ...openGraphDefaults(),
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
};

const themeScript = `try{var t=localStorage.getItem("wishlist-premium-theme");document.documentElement.classList.toggle("dark",t!=="light")}catch(e){}`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-PT"
      className="dark"
      // Diz ao Next que o scroll suave é intencional, para ele o desligar
      // durante transições de rota em vez de avisar na consola.
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-background font-sans text-foreground antialiased`}
      >
        <ThemeProvider>
          <ReservationsProvider>
            <a
              href="#conteudo"
              className="sr-only focus-visible:not-sr-only focus-visible:absolute focus-visible:left-4 focus-visible:top-4 focus-visible:z-50 focus-visible:rounded-full focus-visible:border focus-visible:border-border/70 focus-visible:bg-card focus-visible:px-4 focus-visible:py-2 focus-visible:text-sm focus-visible:font-medium"
            >
              Saltar para o conteúdo
            </a>
            <div className="relative flex min-h-screen flex-col">
              <SiteHeader />
              <main id="conteudo" className="flex-1">
                {children}
              </main>
              <SiteFooter />
            </div>
          </ReservationsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
