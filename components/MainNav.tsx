"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

/**
 * A navegação principal: os dois estados em que um presente vive nesta lista —
 * ainda por oferecer, e já recebido.
 *
 * O ativo é marcado com a superfície secundária, não com o Azul de Vitrine: a
 * Regra da Única Luz reserva o azul para menos de 10% do ecrã, e "onde estou"
 * não é o mesmo tipo de destaque que um filtro ligado.
 */
const LINKS = [
  { href: "/", label: "Wishlist" },
  { href: "/recebidos", label: "Recebidos" },
] as const;

export function MainNav({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Navegação principal" className={className}>
      <ul className="flex items-center gap-1">
        {LINKS.map((link) => {
          // Correspondência exata: numa página de produto ou de categoria não
          // se mente a dizer que se está na raiz.
          const isCurrent = pathname === link.href;

          return (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={isCurrent ? "page" : undefined}
                className={cn(
                  "inline-flex h-9 items-center rounded-full px-3.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  isCurrent
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
