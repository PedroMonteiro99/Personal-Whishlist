# Product

<!-- impeccable:product-schema 1 -->

> Registo de verdade de produto para trabalho de design. Complementa — não substitui —
> `PROJECT_BLUEPRINT.md`, que continua a ser a constituição técnica do projeto.
> Este ficheiro não define linguagem visual (isso vive em `DESIGN.md` / briefs de superfície).

## Platform

web

## Users

**Primário — visitantes (família e amigos).** Recebem um único link, tipicamente por mensagem, e
chegam sem qualquer contexto prévio. O trabalho que estão a fazer é decidir o que oferecer:
percorrer ideias, perceber o que é mais desejado, confirmar preço e loja, e sair com um link de
compra. Não têm conta, não fazem login, não deixam nada para trás.

**Uso repartido de forma equilibrada entre telemóvel e desktop** (confirmado pelo dono): nenhum
dos dois contextos é secundário — a experiência tem de estar completa nos dois.

**Secundário — o dono da wishlist (Pedro Monteiro).** Mantém o conteúdo exclusivamente através de
ficheiros MDX versionados no repositório. Não usa a aplicação como administrador; não existe
painel de administração na V1.

## Product Purpose

Um site público e de leitura que apresenta ideias de presentes organizadas por categoria, com
pesquisa e filtros, partilhável por um único link. Substitui listas informais (notas no telemóvel,
mensagens dispersas, folhas de cálculo) por uma fonte única, sempre atualizada e visualmente
cuidada.

Sucesso: um visitante sem contexto percebe imediatamente do que se trata, encontra uma ideia
adequada sem fricção, e chega ao link de compra. Do lado do dono, adicionar um produto continua a
ser tão simples como criar um ficheiro.

## Positioning

O catálogo é gerado a partir de ficheiros MDX versionados em Git, sincronizados para Supabase por
GitHub Actions. O conteúdo tem histórico, revisão e validação de esquema antes de chegar à
aplicação — algo que nem uma folha de cálculo partilhada nem uma app de wishlist genérica de
retalhista oferecem. Não é uma loja: não há carrinho, checkout, pagamentos nem contas.

## Operating Context

**Visitante:** abre o link → homepage com favoritos/prioridade alta → navega por categoria ou
pesquisa → aplica filtros (prioridade, loja, categoria) → abre a página do produto → segue o link
externo para a loja. Tudo público, sem autenticação.

**Dono:** cria/edita `content/wishlist/<categoria>/<slug>.mdx` → commit e push → GitHub Actions
valida o frontmatter com Zod e sincroniza para Supabase → produção reflete a alteração.

**Ciclo de vida:** arranca como wishlist de Natal e evolui para outras ocasiões (aniversários,
etc.) ao longo de vários anos, sem reescrita da estrutura de dados.

## Capabilities and Constraints

**Âmbito confirmado da V1:** rotas `/`, `/categoria/[slug]`, `/produto/[slug]`, `/pesquisa`;
destaque de favoritos e prioridade alta; pesquisa com debounce; filtros por prioridade, loja e
categoria; alternância Dark/Light; SEO por página (metadata, sitemap, Open Graph, JSON-LD
`Product`); responsivo.

**Terminologia do domínio (visível ao utilizador, pt-PT):** produto, categoria, loja, prioridade
(baixa/média/alta), favorito, preço, notas pessoais.

**Restrições duráveis:**
- Git é a única fonte de verdade; o catálogo é servido a partir dos MDX no build, sem base de
  dados no caminho de leitura.
- O projeto Supabase existe para estado gerado por visitantes (reservas), não para conteúdo.
  Enquanto isso não existir, a aplicação não fala com nenhuma base de dados.
- Credenciais de base de dados vivem apenas em GitHub Actions Secrets, nunca no browser.
- TypeScript strict; todo o dado externo validado com Zod.
- Server Components por defeito; `"use client"` apenas quando necessário.
- Estado de pesquisa e filtros vive sempre na URL (`searchParams`), nunca só em memória.
- Slugs estáveis depois de publicados — links partilhados não podem partir.
- Locale único: português europeu; rotas em português (`/categoria`, `/produto`, `/pesquisa`).
  Não há i18n planeado.
- Preços em EUR, definidos no frontmatter; podem estar ausentes num produto.

**Explicitamente fora da V1 (não implementar sem pedido):** reservas de presentes, histórico de
preços, notificações, coleções, dashboard privado, autenticação, integração com APIs de preços.

**Por decidir:** quais as categorias efetivamente publicadas na V1 além de `setup`; se as páginas
estáticas em `content/pages/` (`/[slug]`) entram na V1 — o blueprint marca-as como opcionais.

## Brand Commitments

- **Nome visível aos visitantes:** "Wishlist do Pedro". "Wishlist Premium" é o nome interno do
  projeto/repositório, não o rótulo da interface.
- **Voz:** português europeu, direta e pessoal; as notas de produto são escritas na primeira
  pessoa pelo dono.
- **Restrições visuais já fixadas pelo dono** em `PROJECT_BLUEPRINT.md` §11–12 (`UI-001`–`UI-004`,
  `DESIGN-001`–`DESIGN-005`): shadcn/ui como base de componentes, Dark Mode como modo primário, e
  a exclusão explícita de Bootstrap, Material UI e estética "dashboard gaming". Registado tal como
  está; a linguagem visual completa não é decidida aqui.

## Evidence on Hand

**Conteúdo real hoje:** um produto (`content/wishlist/setup/benq-screenbar-pro.mdx`), uma
categoria (`content/categories/setup.mdx`), uma loja (`content/stores/amazon.mdx`).

**Escala alvo no lançamento:** ~40 a 100 produtos (confirmado pelo dono) — o catálogo é grande o
suficiente para que filtros, pesquisa e densidade de grelha sejam funcionalmente necessários, não
decorativos.

**Imagens:** URLs remotas do CDN da Amazon, referenciadas no frontmatter. Não existem assets
próprios em `public/` — sem logótipo, sem fotografia original.

**Ideias de conteúdo de referência** (Apêndice do blueprint, ainda não publicadas): gaming, setup,
perfumes, ténis, colecionismo/LEGO.

**Ausências que não devem ser inventadas:** não há testemunhos, clientes, métricas de utilização,
preços históricos, prazos de entrega, avaliações, disponibilidade de stock, nem qualquer prova
social. Nenhum destes elementos existe e nenhum deve aparecer como conteúdo de exemplo.

## Product Principles

1. **O visitante nunca precisa de contexto.** Quem abre o link pela primeira vez percebe o que é
   e como navegar, sem explicação prévia.
2. **Consultar, não comprar.** A aplicação informa e encaminha para a loja; nunca simula uma
   experiência de e-commerce.
3. **Adicionar um produto é criar um ficheiro.** Qualquer decisão que torne a manutenção mais
   pesada do que isso está errada.
4. **A URL é o estado.** Qualquer vista que o visitante consiga ver, consegue partilhar.
5. **Construído para durar anos.** A estrutura suporta novas ocasiões e novas categorias sem
   reescrita; escolhas de curto prazo que exijam migração são recusadas.

## Accessibility & Inclusion

WCAG AA como mínimo, verificado em Dark Mode e Light Mode, incluindo estados de foco e hover.
Navegação completa por teclado com `focus-visible` claramente estilizado em toda a navegação
principal (categorias, pesquisa, filtros, cartões de produto). Elementos interativos não-nativos
usam roles e atributos `aria-*` adequados. Imagens de produto têm `alt` descritivo derivado do
nome; decorativas usam `alt=""`. O campo de pesquisa tem `label` associado, nunca apenas
`placeholder`.
