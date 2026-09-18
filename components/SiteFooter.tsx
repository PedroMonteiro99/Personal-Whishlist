import Link from "next/link";

import { BrandMark } from "@/components/BrandMark";
import { getCatalogData, selectPopulatedCategories, selectPopulatedStores } from "@/lib/catalog";

const NAVIGATION = [
  { href: "/", label: "Wishlist" },
  { href: "/recebidos", label: "Recebidos" },
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

function FooterNav({
  id,
  title,
  links,
}: {
  id: string;
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <nav aria-labelledby={id} className="space-y-3">
      <h2 id={id} className="text-sm font-semibold text-foreground">
        {title}
      </h2>
      <ul className="space-y-2.5 text-sm">
        {links.map((link) => (
          <li key={link.href}>
            <FooterLink href={link.href}>{link.label}</FooterLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export async function SiteFooter() {
  const { categories, stores, products } = await getCatalogData();
  // A mesma regra da grelha da homepage: uma categoria vazia é um beco sem
  // saída, e no rodapé seria ainda mais difícil de perceber porquê.
  const populatedCategories = selectPopulatedCategories(categories, products);
  // As lojas dão a outra entrada útil: "tenho cartão da Worten", "quero juntar
  // tudo numa encomenda". O filtro já existia em /pesquisa — faltava a porta.
  const populatedStores = selectPopulatedStores(stores, products);

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

          <div className="flex flex-col gap-10 sm:flex-row sm:flex-wrap sm:gap-x-14 sm:gap-y-8">
            <FooterNav
              id="rodape-navegar"
              title="Navegar"
              links={NAVIGATION}
            />

            {populatedCategories.length > 0 ? (
              <FooterNav
                id="rodape-categorias"
                title="Categorias"
                links={populatedCategories.map(({ category }) => ({
                  href: `/categoria/${category.slug}`,
                  label: category.name,
                }))}
              />
            ) : null}

            {populatedStores.length > 0 ? (
              <FooterNav
                id="rodape-lojas"
                title="Lojas"
                links={populatedStores.map(({ store }) => ({
                  href: `/pesquisa?loja=${store.slug}`,
                  label: store.name,
                }))}
              />
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
