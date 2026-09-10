import Link from "next/link";

import { BrandMark } from "@/components/BrandMark";
import { getCatalogData, selectPopulatedCategories } from "@/lib/catalog";

const NAVIGATION = [
  { href: "/", label: "Wishlist" },
  { href: "/recebidos", label: "Já recebidos" },
  { href: "/pesquisa", label: "Pesquisar" },
];

function FooterLink({ href, children }: { href: string; children: string }) {
  return (
    <Link
      href={href}
      className="text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
    >
      {children}
    </Link>
  );
}

export async function SiteFooter() {
  const { categories, products } = await getCatalogData();
  // A mesma regra da grelha da homepage: uma categoria vazia é um beco sem
  // saída, e no rodapé seria ainda mais difícil de perceber porquê.
  const populatedCategories = selectPopulatedCategories(categories, products);

  return (
    <footer className="border-t border-border/70 bg-background/80">
      <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="flex flex-col gap-10 sm:flex-row sm:justify-between">
          <div className="max-w-sm space-y-3">
            <div className="flex items-center gap-2.5">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-border/70 bg-card text-primary">
                <BrandMark className="size-5" />
              </span>
              <span className="text-sm font-semibold text-foreground">
                Wishlist do Pedro
              </span>
            </div>
            <p className="text-sm leading-6 text-muted-foreground">
              Uma lista de ideias de presentes, escrita à mão e mantida
              atualizada. Não é uma loja: não há contas, carrinho nem
              pagamentos.
            </p>
          </div>

          <div className="flex flex-col gap-10 sm:flex-row sm:gap-16">
            <nav aria-labelledby="rodape-navegar" className="space-y-3">
              <h2
                id="rodape-navegar"
                className="text-sm font-semibold text-foreground"
              >
                Navegar
              </h2>
              <ul className="space-y-2.5 text-sm">
                {NAVIGATION.map((item) => (
                  <li key={item.href}>
                    <FooterLink href={item.href}>{item.label}</FooterLink>
                  </li>
                ))}
              </ul>
            </nav>

            {populatedCategories.length > 0 ? (
              <nav aria-labelledby="rodape-categorias" className="space-y-3">
                <h2
                  id="rodape-categorias"
                  className="text-sm font-semibold text-foreground"
                >
                  Categorias
                </h2>
                <ul className="space-y-2.5 text-sm">
                  {populatedCategories.map(({ category }) => (
                    <li key={category.slug}>
                      <FooterLink href={`/categoria/${category.slug}`}>
                        {category.name}
                      </FooterLink>
                    </li>
                  ))}
                </ul>
              </nav>
            ) : null}
          </div>
        </div>

        <p className="mt-10 border-t border-border/70 pt-6 text-sm leading-6 text-muted-foreground">
          Os preços são os que registei quando adicionei cada ideia — confirma
          sempre na loja antes de comprar.
        </p>
      </div>
    </footer>
  );
}
