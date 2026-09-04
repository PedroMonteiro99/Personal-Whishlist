# PROJECT_BLUEPRINT.md

> Este documento é a **Constituição do projeto Wishlist Premium**.
> Toda a arquitetura, decisões técnicas e regras de implementação derivam deste ficheiro.
> Qualquer agente de IA (Copilot Agent, Claude Code, Codex, Cursor, Gemini CLI) deve conseguir
> implementar o projeto lendo apenas este documento.
>
> As regras são identificadas por um prefixo curto (ex: `ARCH-001`) para serem facilmente
> referenciadas em commits, PRs, issues e prompts.

Status: **completo (v1.0) — todas as secções fechadas; sujeito a revisão à medida que o projeto evolui**

---

## Índice

1. [Vision](#1-vision)
2. [Product](#2-product)
3. [Goals](#3-goals)
4. [Non Goals](#4-non-goals)
5. [Technical Stack](#5-technical-stack)
6. [Repository Philosophy](#6-repository-philosophy)
7. [Architecture](#7-architecture)
8. [Folder Structure](#8-folder-structure)
9. [Feature Architecture](#9-feature-architecture)
10. [Routing](#10-routing)
11. [UI System](#11-ui-system)
12. [Design Language](#12-design-language)
13. [Components](#13-components)
14. [Database](#14-database)
15. [MDX Content](#15-mdx-content)
16. [Synchronization](#16-synchronization)
17. [GitHub Actions](#17-github-actions)
18. [Security](#18-security)
19. [Performance](#19-performance)
20. [Accessibility](#20-accessibility)
21. [SEO](#21-seo)
22. [Testing](#22-testing)
23. [Documentation](#23-documentation)
24. [AI Instructions](#24-ai-instructions)
25. [Coding Standards](#25-coding-standards)
26. [Naming Conventions](#26-naming-conventions)
27. [Definition of Done](#27-definition-of-done)
28. [Roadmap](#28-roadmap)
29. [Future Ideas](#29-future-ideas)
30. [Appendix](#30-appendix)

---

## 1. Vision

Criar uma aplicação web de wishlist premium, elegante e extensível, para que amigos e família
consultem ideias de presentes. Não é apenas uma lista de produtos — é uma aplicação pensada para
durar vários anos, começando por uma wishlist de Natal e evoluindo para uma plataforma completa.

**VISION-001** — A aplicação deve parecer um produto comercial, não um projeto pessoal amador.
Qualquer pessoa que a visite pela primeira vez (mesmo sem contexto) deve perceber imediatamente
do que se trata e navegar sem fricção.

**VISION-002** — A wishlist é construída para durar: a estrutura de dados, o conteúdo em MDX e a
arquitetura devem suportar anos de uso (Natal, aniversários, outras ocasiões) sem exigir
reescritas. Adicionar um novo produto deve ser tão simples como criar um ficheiro MDX.

**VISION-003** — Simplicidade para quem consulta, extensibilidade para quem mantém. A pessoa que
recebe o link da wishlist só precisa de navegar e ver os produtos; a complexidade (sincronização,
validação, base de dados) fica invisível para ela.

**VISION-004** — O projeto evolui em camadas: a V1 é deliberadamente pequena (ver secção 28 —
Roadmap) para poder ser lançada rapidamente; funcionalidades mais complexas (reservas, histórico
de preços, dashboard privado) só são adicionadas depois de a base estar estável.

## 2. Product

**PRODUCT-001** — **O que é:** um site público, de leitura, que apresenta uma lista de produtos
("ideias de presentes") organizados por categorias, com pesquisa e filtros. Não requer login para
ser consultado.

**PRODUCT-002** — **Quem usa:**
- **Dono da wishlist** (o utilizador principal): gere o conteúdo via ficheiros MDX no repositório
  Git. Não interage com a aplicação como "admin" — a gestão é feita pelo fluxo de conteúdo, não por
  um painel de administração na V1.
- **Visitantes** (família e amigos): acedem à aplicação publicada (URL partilhada), navegam pelas
  categorias, pesquisam e consultam os detalhes de cada produto (preço, prioridade, loja, links de
  compra).

**PRODUCT-003** — **Como se usa (fluxo típico de um visitante):**
1. Acede à homepage e vê os produtos em destaque / favoritos.
2. Navega por categoria (ex: "Setup", "Gaming", "Perfumes") ou usa a pesquisa.
3. Aplica filtros (ex: prioridade, loja, disponibilidade de preço).
4. Abre a página de um produto para ver detalhes, notas pessoais e link(s) para comprar.

**PRODUCT-004** — **Como se usa (fluxo típico do dono da wishlist):**
1. Cria/edita um ficheiro `.mdx` em `content/wishlist/<categoria>/`.
2. Faz commit e push para o repositório.
3. O GitHub Actions valida o frontmatter e sincroniza para o Supabase.
4. A aplicação em produção reflete o novo conteúdo automaticamente.

**PRODUCT-005** — **Proposta de valor:** substitui listas informais (notas no telemóvel, mensagens
dispersas, folhas de cálculo) por uma experiência única, sempre atualizada, visualmente cuidada e
partilhável através de um único link.

## 3. Goals

- Aplicação pública, rápida e responsiva para consulta de ideias de presentes.
- Conteúdo gerido via MDX, com o Git como única fonte de verdade.
- Arquitetura extensível: começa simples (V1) e evolui (reservas, histórico de preços, etc.).
- Experiência visual "premium", inspirada em Apple, Vercel, Linear, Raycast, Arc e Notion.

## 4. Non Goals

- Não é uma loja online (sem carrinho, sem checkout, sem pagamentos).
- Não é um dashboard de gaming nem uma aplicação genérica de e-commerce.
- Não pretende suportar múltiplos utilizadores/contas na V1.
- Não haverá edição de conteúdo diretamente na base de dados.

## 5. Technical Stack

| Camada | Tecnologia |
|---|---|
| Frontend | Next.js 15 (App Router) |
| UI Library | React 19 |
| Linguagem | TypeScript (strict) |
| Estilos | Tailwind CSS v4 |
| Componentes | shadcn/ui |
| Animações | Framer Motion (Motion) |
| Backend / DB | Supabase (apenas estado futuro — ver `REPO-005`) |
| Conteúdo | MDX |
| Deployment | Vercel |
| CI/CD | GitHub Actions |
| Package Manager | pnpm |
| Validação | Zod |

**STACK-001** — A stack acima é fixa para a V1. Qualquer alteração exige atualização deste blueprint.

## 6. Repository Philosophy

**REPO-001** — O repositório Git é sempre a única fonte de verdade.
**REPO-002** — Todo o conteúdo (produtos, categorias, lojas) vive em ficheiros MDX versionados.
**REPO-003** — Nunca editar conteúdo diretamente numa base de dados.
**REPO-004** — **O catálogo é servido a partir dos MDX, não de uma base de dados.** Como toda a
alteração de conteúdo é um commit (`REPO-001`), e um commit já dispara um rebuild, uma cópia do
catálogo em base de dados não resolveria nenhum problema: só acrescentaria latência, uma dependência
de terceiros e uma cópia a divergir em silêncio. O site são ficheiros estáticos e não pode ficar
indisponível por causa de dados.

Fluxo de conteúdo:

```
MDX → GitHub → build (Next.js) → site estático
```

**REPO-005** — O projeto Supabase mantém-se para **estado**, não para conteúdo: dados gerados por
visitantes (reservas — `DB-004`), que por definição não pertencem ao Git. O catálogo continua
estático; só o estado é lido no browser, depois de a página carregar.

**REPO-006** — As reservas são um extra, nunca um requisito: sem configuração de Supabase, ou com
ele em baixo, a interface esconde a funcionalidade e o catálogo continua a funcionar por inteiro.
Verificado em browser com o serviço inalcançável.

## 7. Architecture

**ARCH-001** — Server Components são o padrão por defeito.
**ARCH-002** — Client Components (`"use client"`) apenas quando estritamente necessário (interatividade, hooks de estado, browser APIs).
**ARCH-003** — Arquitetura organizada por feature (ver secção 9), não por tipo de ficheiro.
**ARCH-004** — Sem código duplicado — extrair para `lib/` ou `hooks/` quando reutilizado.
**ARCH-005** — Componentes pequenos e focados numa única responsabilidade.
**ARCH-006** — TypeScript em modo `strict`, sem `any` não justificado.
**ARCH-007** — Toda a validação de dados externos (frontmatter MDX, formulários, respostas de API) usa Zod.

## 8. Folder Structure

```
app/                # Rotas (App Router), layouts, pages
components/          # Componentes de UI reutilizáveis (inclui shadcn/ui em components/ui)
features/            # Lógica e componentes organizados por feature de produto
lib/                 # Utilitários, clients (Supabase), helpers
hooks/               # React hooks reutilizáveis
scripts/             # Scripts de sincronização, seed, manutenção
supabase/            # Migrations e configuração do Supabase
types/               # Tipos TypeScript partilhados
content/             # Conteúdo em MDX
  wishlist/           # Produtos, por categoria (gaming, setup, sim-racing, lego, perfumes, sneakers, coffee, home, accessories)
  stores/             # Lojas
  categories/         # Categorias
  pages/              # Páginas estáticas em MDX
public/              # Assets estáticos
docs/                # Documentação derivada do blueprint
.ai/                 # Instruções e contexto para agentes de IA
.github/             # Workflows e instruções para Copilot
```

**FOLDER-001** — Nenhum ficheiro de conteúdo (produto/categoria/loja) deve existir fora de `content/`.
**FOLDER-002** — Componentes específicos de uma feature vivem em `features/<nome>/`, não em `components/`.

## 9. Feature Architecture

**FEAT-001** — Cada feature vive em `features/<feature>/`, com a seguinte estrutura interna
(apenas as pastas necessárias — não criar pastas vazias):

```
features/<feature>/
  components/     # componentes específicos desta feature
  hooks/           # hooks específicos desta feature
  lib/             # lógica/utilitários específicos desta feature
  types.ts         # tipos específicos desta feature
```

**FEAT-002** — Features da V1:

| Feature | Responsabilidade |
|---|---|
| `wishlist` | Listagem geral de produtos, grelha de categorias, secção de favoritos |
| `product` | Página de detalhe de um produto |
| `category` | Página de listagem por categoria |
| `search` | Pesquisa de produtos (input, resultados, estado da pesquisa) |
| `filters` | Filtros (prioridade, loja, categoria, preço) |
| `theme` | Dark/Light mode toggle e provider |

**FEAT-003** — Componentes genéricos e reutilizáveis por várias features (ex: `Button`, `Card`,
`Badge`) vivem em `components/ui/` (shadcn/ui). Componentes compostos, mas ainda assim partilhados
por mais do que uma feature (ex: `ProductCard` usado em `wishlist` e `category`), vivem em
`components/` (fora de `ui/`). Componentes usados por **apenas uma** feature vivem dentro dessa
feature, em `features/<feature>/components/`.

**FEAT-004** — Uma feature nunca importa diretamente de dentro de outra feature
(`features/search/lib/x` não deve ser importado por `features/filters/`). Lógica partilhada entre
features sobe para `lib/` ou `hooks/` na raiz.

**FEAT-005** — Acesso a dados (Supabase) fica centralizado em `lib/supabase/` e em funções de
"data access" por feature (ex: `features/wishlist/lib/get-products.ts`), nunca chamado
diretamente de dentro de um componente de UI.

## 10. Routing

**ROUTE-001** — Rotas da V1 (App Router, todas públicas, sem autenticação):

| Rota | Descrição |
|---|---|
| `/` | Homepage — destaque de favoritos/prioridade alta, acesso rápido às categorias |
| `/categoria/[slug]` | Lista de produtos de uma categoria |
| `/produto/[slug]` | Página de detalhe de um produto |
| `/pesquisa` | Pesquisa, filtros e ordenação (`ROUTE-006`) |
| `/recebidos` | Presentes já recebidos, agrupados por ocasião (`CONTENT-008`) |
| `/[slug]` (opcional) | Páginas estáticas de conteúdo em `content/pages/` (ex: "Sobre") |

**ROUTE-002** — Slugs de categoria e de produto são definidos no frontmatter MDX (`slug`) e devem
ser únicos dentro do seu tipo (validado por `scripts/validate-content.ts` — ver `SYNC-002`).

**ROUTE-003** — Filtros, ordenação e pesquisa usam `searchParams` (ex:
`/pesquisa?loja=amazon&preco=mais-300`), nunca estado ad-hoc que se perde ao recarregar a página —
a URL deve refletir sempre o estado visível.

**ROUTE-006** — A filtragem vive numa **superfície única**, `/pesquisa`, que acumula os papéis de
pesquisa, "ver tudo" e filtrar/ordenar. As páginas de categoria mantêm-se estáticas
(`generateStaticParams`, ver `PERF-003`) e ligam para `/pesquisa?categoria=<slug>` em vez de
lerem `searchParams` — ler `searchParams` numa rota tornaria-a dinâmica e anularia a geração
estática. Evita também duplicar a UI de filtros em duas rotas.

**ROUTE-004** — Rotas de fases futuras (fora da V1, não implementar ainda): `/dashboard`
(privado), `/dashboard/reservas`, `/colecoes/[slug]`. Ver secção 29 — Future Ideas.

**ROUTE-005** — Páginas de detalhe de produto (`/produto/[slug]`) e de categoria
(`/categoria/[slug]`) são geradas estaticamente (`generateStaticParams`) a partir dos MDX. Não há
revalidação a acionar: o conteúdo entra no build, e cada commit de conteúdo produz um build novo
(`REPO-004`).

## 11. UI System

**UI-001** — Base de componentes: shadcn/ui.
**UI-002** — Inspiração visual: Apple, Vercel, Linear, Raycast, Arc, Notion.
**UI-003** — Evitar explicitamente: Bootstrap, Material UI, estética "dashboard gaming".
**UI-004** — Dark Mode é o modo primário ("Dark Mode First"); Light Mode é secundário.

## 12. Design Language

**DESIGN-001** — Muito espaço em branco (whitespace generoso).
**DESIGN-002** — Tipografia premium, hierarquia clara.
**DESIGN-003** — Sombras suaves, nunca sombras duras/pesadas.
**DESIGN-004** — Cartões (cards) minimalistas.
**DESIGN-005** — Animações discretas e funcionais (Framer Motion), nunca decorativas em excesso.

## 13. Components

**COMP-001** — Inventário de componentes base da V1:

| Componente | Local | Responsabilidade |
|---|---|---|
| `ProductCard` | `components/` | Cartão de produto (imagem, nome, preço, badge de prioridade/favorito) |
| `ProductGrid` | `components/` | Grelha responsiva de `ProductCard` |
| `ProductDetail` | `features/product/components/` | Conteúdo completo da página de um produto |
| `CategoryGrid` | `features/wishlist/components/` | Grelha de categorias na homepage |
| `CategoryHeader` | `features/category/components/` | Cabeçalho de uma página de categoria (nome, descrição, contagem) |
| `SearchBar` | `features/search/components/` | Input de pesquisa com debounce |
| `SearchResults` | `features/search/components/` | Lista de resultados de pesquisa |
| `Filters` | `features/filters/components/` | Painel/barra de filtros (prioridade, loja, categoria) |
| `FilterChip` | `features/filters/components/` | Filtro individual ativo, removível |
| `ThemeToggle` | `features/theme/components/` | Alternância Dark/Light mode |
| `PriorityBadge` | `components/` | Indicador visual de prioridade (baixa/média/alta) |
| `FavoriteIndicator` | `components/` | Indicador visual de favorito |
| `StoreLink` | `components/` | Botão/link externo para a loja de compra |
| `EmptyState` | `components/` | Estado vazio (sem resultados de pesquisa/filtros) |
| `SiteHeader` / `SiteFooter` | `components/` | Layout global |

**COMP-002** — Base de componentes primitivos (`Button`, `Input`, `Badge`, `Card`, `Skeleton`,
`Dialog`, `DropdownMenu`, etc.) vem diretamente do shadcn/ui em `components/ui/`, sem alterações
de comportamento — apenas theming via Tailwind/CSS variables (ver secção 12 — Design Language).

**COMP-003** — Todo o componente com mais do que um estado visual (loading, vazio, erro, com
dados) deve tratar esses estados explicitamente — nunca assumir que os dados chegam sempre
preenchidos.

**COMP-004** — Componentes que buscam dados (Server Components a chamar Supabase) ficam separados
dos componentes puramente apresentacionais, para facilitar testes e reutilização
(ex: `ProductGrid` recebe `products` como prop; quem busca os dados é a página/rota).

## 14. Database

Tabelas em uso:

**DB-001** — `heartbeat` — tabela de uma linha, existe unicamente para o workflow `keepalive` ter
o que consultar (`CI-006`). Sem tabelas, o plano gratuito não teria como registar atividade.

**DB-004** — `reservations` — quem já vai oferecer cada produto: `product_slug`, `reserver_name`,
`token_hash`, `occasion`, `created_at`. Índice único em **`(product_slug, occasion)`**: um produto
é oferecido uma vez **por ocasião**, não uma vez para sempre. Sem isto, passado o Natal um produto
ficaria eternamente "já tratado".

Não há chaves estrangeiras para produtos nem para ocasiões, porque nenhum deles vive aqui
(`DB-002`, `CONTENT-006`): o conteúdo é do Git. Uma reserva de um produto entretanto removido do
MDX deixa apenas de ser mostrada.

Tabelas futuras (fora da V1):

**DB-902** — `price_history` — histórico de preços por produto.
**DB-903** — `collections` — coleções/agrupamentos personalizados.

**DB-002** — O catálogo (produtos, categorias, lojas, links) **não** vive na base de dados: vem
dos MDX (`REPO-004`). As tabelas `products`, `categories`, `stores` e `product_links` existiram na
migração inicial e foram removidas em `0003_drop_catalog_tables.sql`.

**DB-003** — Toda a tabela nova nasce com RLS ativado e apenas as políticas que a funcionalidade
exige (ver secção 18).

## 15. MDX Content

**CONTENT-001** — Um produto = um ficheiro MDX.
**CONTENT-002** — O frontmatter contém toda a informação estruturada (nome, categoria, lojas, prioridade, favorito, imagens, SEO).
**CONTENT-003** — O corpo Markdown contém apenas notas pessoais/descritivas, nunca dados estruturados.
**CONTENT-004** — Estrutura de pastas de conteúdo espelha as categorias (ver secção 8).
**CONTENT-005** — As lojas de um produto vivem num único bloco `stores:`, uma entrada por loja, com `store` (slug validado contra `content/stores/`), `url` (link direto ao produto) e `price` opcional. O nome visível vem do ficheiro da loja; `label` só existe para o sobrepor. Não há campo `store` nem `price` no topo do produto: o preço mostrado é o mais baixo entre as lojas, anunciado como "desde" quando as lojas pedem valores diferentes.

**CONTENT-006** — **Ocasiões.** Uma ocasião é um **período de tempo** (o Natal, um aniversário),
não um agrupamento de produtos — não confundir com as "Coleções" da secção 29. Vive em
`content/occasions/<slug>.mdx` com `name`, `slug`, `date` e `status: aberta | fechada`.

Tem de existir **exatamente uma ocasião aberta**: zero significa que as reservas não teriam onde
aterrar, duas significa que ninguém sabe qual conta. A validação falha o build nos dois casos.

A ocasião vive no Git, e não numa base de dados, por três razões: muda 2 a 4 vezes por ano (a
fricção de um commit é a certa para isso), dá historial de quando mudou, e mantém o catálogo fora
do caminho de leitura dinâmico (`REPO-004`). Fechar uma ocasião é um ato deliberado, nunca uma
transição automática por data — num site estático a data muda mas ninguém reconstrói.

**CONTENT-007** — Um produto **não é etiquetado por ocasião**. Se o queres, queres — a ocasião é
apenas quando alguém calha oferecê-lo. Etiquetar obrigaria a reetiquetar o catálogo a cada época.

**CONTENT-008** — `received: "<slug-da-ocasião>"` no frontmatter marca um presente como recebido.
O produto sai das listas de navegação (homepage, categorias, pesquisa, sitemap) mas **mantém a
sua página**: o slug pode ter sido partilhado e tem de continuar a resolver (`SEO-005`). A página
troca a ação de oferecer por uma nota, e o produto passa a aparecer em `/recebidos`.

```yaml
stores:
  - store: "amazon"
    url: "https://www.amazon.es/dp/B0CZ9P1QW9"
    price: 129.99
  - store: "pc-diga"
    url: "https://www.pcdiga.com/..."
    price: 134.90
```

## 16. Content Validation

**SYNC-001** — O conteúdo MDX é validado por `scripts/validate-content.ts`, que corre no workflow
`validate` em cada pull request. Não escreve em lado nenhum: só lê e verifica.
**SYNC-002** — A validação cobre frontmatter contra os schemas Zod, unicidade de slugs por tipo, e
referências resolvidas (categoria e lojas de cada produto existem em `content/`).
**SYNC-003** — Falhas de validação bloqueiam o merge (fail-fast), com o ficheiro e o problema
nomeados.
**SYNC-004** — As regras de integridade vivem num único módulo,
`lib/content/integrity.ts`, partilhado pelo validador e por `lib/catalog.ts`. Correm nos dois
momentos: no PR (falha o merge) e no build (falha o build). Estarem num só sítio garante que uma
regra nova entra nos dois de uma vez.

## 17. GitHub Actions

**CI-001** — `validate` — pull requests: lint, typecheck, validação de conteúdo, testes, build.
**CI-002** — `ci` — pushes em `main`: lint, typecheck, testes, build.
**CI-003** — `release` — gestão de versões/releases a partir de tags `v*.*.*`.
**CI-004** — `keepalive` — mantém o projeto Supabase gratuito ativo (ver 17.1).

**CI-005** — Os workflows declaram `permissions` explícitas (mínimo privilégio) e `concurrency`
por ref. Escritas em base de dados nunca usam `cancel-in-progress`.

### 17.1 Keepalive

**CI-006** — Job agendado (cron semanal) que consulta a tabela `heartbeat` para evitar que o
projeto gratuito seja pausado por inatividade (a pausa ocorre após 30 dias). Os secrets passam por
`env`, nunca interpolados no `run`.

## 18. Security

**SEC-001** — Row Level Security (RLS) ativado em todas as tabelas do Supabase. Cada tabela recebe
apenas as políticas que a sua funcionalidade exige — hoje, leitura pública em `heartbeat` e nada
mais.

**SEC-002** — A aplicação só fala com o Supabase para **reservas** (`SEC-008`). O catálogo não
passa por lá (`REPO-004`). Não há `service_role` em uso no repositório desde que a sincronização de
catálogo foi removida.

**SEC-008** — **Modelo de segurança das reservas, sem contas de utilizador.** A tabela
`reservations` tem RLS ativa e **nenhuma política**: `anon` não a lê nem escreve diretamente (uma
tentativa devolve `permission denied`). O acesso passa por três funções `security definer` com
`search_path` fixo — `list_reservations`, `reserve_product`, `release_product` — que são a única
superfície pública.

Quem reserva guarda um token aleatório no seu browser; a base de dados guarda apenas o SHA-256
desse token. Consequências: uma fuga da tabela não permite cancelar reservas de ninguém, e
`list_reservations` devolve o nome mas nunca o hash — em vez disso compara-o com o token de quem
pergunta e devolve um booleano `is_mine`.

O modelo foi verificado contra um Postgres real (leitura direta negada, escrita direta negada,
duplo `reserve` recusado, e um segundo token a falhar ao tentar cancelar reserva alheia).

**SEC-009** — O nome de quem reserva é visível a qualquer pessoa com o link. É deliberado — serve
para a família coordenar — e está limitado a 40 caracteres. Não recolher mais nada.

**SEC-010** — As reservas são sempre lidas e escritas **dentro de uma ocasião**. Um cliente
malicioso pode enviar uma ocasião inventada: o resultado é uma linha que nenhuma página mostra,
porque a lista só pede as ocasiões que existem em `content/occasions/`. Sem impacto em dados de
terceiros.

**SEC-003** — Segredos vivem apenas em `.env.local` (nunca commitado — ver `.gitignore`) e em
GitHub Actions Secrets. `.env.example` documenta as variáveis necessárias sem valores reais.

**SEC-004** — Todo o dado de entrada externo (frontmatter MDX, `searchParams`, formulários
futuros) é validado com Zod antes de ser usado (ver `ARCH-007`, `CODE-002`) — nunca confiar
implicitamente na estrutura de um ficheiro MDX.

**SEC-005** — Rotas futuras privadas (`/dashboard/*`, fora da V1) exigirão autenticação via
Supabase Auth e RLS adicional restrita ao utilizador dono da wishlist; não implementar
autenticação antes de essa funcionalidade ser efetivamente necessária (ver `Non Goals`).

**SEC-006** — Dependências mantidas atualizadas; o workflow `ci` (secção 17) deve idealmente
incluir, no futuro, verificação automática de vulnerabilidades (`pnpm audit` ou Dependabot).

## 19. Performance

**PERF-001** — Server Components por defeito (`ARCH-001`): busca de dados acontece no servidor,
reduzindo JavaScript enviado ao cliente.

**PERF-002** — Imagens de produtos servidas sempre via `next/image`, com dimensões definidas e
`priority` apenas nas imagens acima da dobra (ex: hero da homepage).

**PERF-003** — Páginas de produto e categoria geradas estaticamente (`generateStaticParams`) no
build, a partir dos MDX. Sem base de dados no caminho de leitura, não há revalidação a orquestrar:
o site servido é HTML estático. As imagens Open Graph seguem a mesma regra (`SEO-003`).

**PERF-004** — Pesquisa e filtros usam debounce no cliente (Client Component isolado e pequeno) e
delegam a query pesada ao servidor — o Client Component nunca carrega o catálogo inteiro para
filtrar em memória no browser.

**PERF-005** — Animações (Framer Motion) limitadas a transições de entrada/saída e microinterações;
nunca animações que bloqueiem o carregamento inicial de conteúdo (LCP).

**PERF-006** — Fontes carregadas via `next/font`, sem bloquear a renderização (evitar FOIT/FOUT
visível).

## 20. Accessibility

**A11Y-001** — Contraste de cor em Dark Mode e Light Mode deve cumprir WCAG AA como mínimo,
verificado para texto sobre fundo e para estados de foco/hover.

**A11Y-002** — Toda a navegação principal (categorias, pesquisa, filtros, cartões de produto) deve
ser operável por teclado, com `focus-visible` claramente estilizado.

**A11Y-003** — Elementos interativos não-nativos (dropdowns, chips de filtro removíveis, toggle de
tema) usam os atributos `aria-*` e roles adequados (herdados do shadcn/ui sempre que possível, em
vez de reconstruir do zero).

**A11Y-004** — Imagens de produto têm sempre `alt` descritivo, derivado do `name` do produto no
frontmatter; imagens puramente decorativas usam `alt=""`.

**A11Y-005** — Formulário/input de pesquisa tem `label` associado (visível ou `sr-only`), nunca
apenas `placeholder` como identificação do campo.

## 21. SEO

**SEO-001** — Cada produto e categoria tem metadata própria (`title`, `description`) definida no
frontmatter (`seo.title`, `seo.description` — ver `CONTENT-002`), usada via `generateMetadata` do
Next.js.

**SEO-002** — Sitemap (`sitemap.xml`) gerado dinamicamente a partir do catálogo. Não inclui
`/pesquisa` (proibida no `robots.txt`) nem categorias sem produtos — listar no sitemap uma página
bloqueada ou vazia é dar instruções contraditórias ao motor de busca.

**SEO-003** — Open Graph e Twitter Card definidos por página, com **imagem gerada** (`ImageResponse`)
para a homepage, cada produto e cada categoria. As imagens são pré-geradas no build
(`generateStaticParams`), para que a primeira partilha não dependa de um cold start nem do CDN da
loja. A fonte Geist vive no repositório (`lib/og/`) em TTF: o build não pode depender da rede, e o
Satori não lê WOFF2.

**SEO-004** — Dados estruturados (JSON-LD, schema.org) por tipo de página: `Product` com
`AggregateOffer` (uma `Offer` por loja, com preço e vendedor) nas páginas de produto,
`CollectionPage` nas de categoria, `WebSite` com `SearchAction` na homepage, e `BreadcrumbList` em
ambas. **Nenhum `availability` é declarado** — não conhecemos o stock das lojas e um `InStock`
falso é pior do que a ausência do campo (ver `PRODUCT.md`, "Evidence on Hand").

**SEO-006** — `/pesquisa` é `noindex`: gera combinações infinitas de filtros e as páginas de
categoria cobrem melhor o mesmo conteúdo. Categorias sem produtos são `noindex` enquanto vazias.

**SEO-007** — `metadataBase` vem de `NEXT_PUBLIC_SITE_URL` (com recurso ao domínio de produção que
a Vercel injeta). Sem ele, as imagens Open Graph saem em caminho relativo e nenhuma aplicação de
mensagens as resolve — o link fica sem pré-visualização.

**SEO-005** — URLs amigáveis e estáveis: o `slug` de um produto/categoria não deve mudar depois de
publicado (evitar links partidos partilhados por família/amigos).

## 22. Testing

**TEST-001** — Validação de conteúdo (frontmatter MDX contra os schemas Zod, slugs únicos,
referências resolvidas) corre no workflow `validate` (`CI-001`) — é a rede de segurança mínima e
obrigatória.

**TEST-002** — Testes unitários (Vitest) sobre a lógica pura de `lib/` e `features/*/lib/`:
formatação de preço, filtros, ordenação, dados estruturados e regras de integridade. Correm em
`ci` e em `validate`.

**TEST-006** — Os testes existem para apanhar **as regressões que este projeto já teve**, não para
encher cobertura. Cada caso não óbvio traz um comentário a dizer que erro previne — por exemplo o
filtro de loja que só encontrava produtos pela primeira loja, ou o preço "desde" a prometer o valor
errado. Um teste que nenhuma mutação plausível faria falhar não vale a manutenção.

**TEST-007** — `lib/catalog.test.ts` corre contra o conteúdo real em `content/`, não contra
fixtures: apanha um MDX partido antes do build e verifica a resolução de lojas de ponta a ponta.

**TEST-003** — Testes de componentes (Testing Library) focados em componentes com lógica de
estado relevante (ex: `Filters`, `SearchBar`), não em componentes puramente apresentacionais.

**TEST-004** — Testes end-to-end (Playwright, fase futura) cobrindo os fluxos críticos: navegar
por categoria, pesquisar, abrir um produto, alternar tema, reservar.

**TEST-005** — Não é objetivo atingir cobertura alta — prioriza-se o que tem maior risco de
quebrar silenciosamente (validação de conteúdo, filtros, preços).

## 19. Performance

> ⏳ A desenvolver — Server Components por defeito, imagens otimizadas (`next/image`), streaming, cache.

## 20. Accessibility

> ⏳ A desenvolver — contraste em dark mode, navegação por teclado, `aria-*` em componentes interativos.

## 21. SEO

> ⏳ A desenvolver — metadata por página/produto, sitemap, Open Graph, JSON-LD.

## 22. Testing

> ⏳ A desenvolver — estratégia de testes (unitários, integração, validação de conteúdo).

## 23. Documentation

**DOC-001** — Este blueprint é a fonte primária de documentação.
**DOC-002** — Documentação adicional em `docs/` deriva sempre deste ficheiro, nunca o contrário.

## 24. AI Instructions

Ver `.ai/`, `CLAUDE.md` e `.github/copilot-instructions.md` para instruções específicas de cada agente.
Todas essas instruções devem remeter para este blueprint como fonte de verdade.

## 25. Coding Standards

**CODE-001** — TypeScript strict, sem `any` não justificado.
**CODE-002** — Zod para validar todo o dado externo.
**CODE-003** — Sem duplicação de código — extrair para `lib/`/`hooks/`.
**CODE-004** — Componentes pequenos, uma responsabilidade cada.
**CODE-005** — Server Components por defeito; `"use client"` só quando necessário.

## 26. Naming Conventions

**NAME-001** — Ficheiros de componentes React: `PascalCase.tsx` (ex: `ProductCard.tsx`).
**NAME-002** — Ficheiros utilitários/hooks/lib: `kebab-case.ts` (ex: `get-products.ts`,
`use-debounce.ts`).
**NAME-003** — Hooks começam sempre por `use` (ex: `useDebounce`, `useFilters`).
**NAME-004** — Pastas: sempre `kebab-case` (ex: `sim-racing`, `features/product-detail` se
necessário).
**NAME-005** — Slugs (produtos, categorias, lojas, páginas): `kebab-case`, sem acentos, estáveis
depois de publicados (ver `SEO-005`).
**NAME-006** — Tabelas e colunas no Supabase: `snake_case` no plural para tabelas
(`products`, `product_links`), `snake_case` no singular para colunas (`created_at`, `store_id`).
**NAME-007** — Tipos e interfaces TypeScript: `PascalCase`, sem prefixo `I` (ex: `Product`, não
`IProduct`) — alinhado com os tipos inferidos dos schemas Zod (ver `lib/content/schemas.ts`).
**NAME-008** — Variáveis de ambiente: `SCREAMING_SNAKE_CASE`, com prefixo `NEXT_PUBLIC_` apenas
quando o valor precisa mesmo de estar acessível no browser (ver `SEC-002`).
**NAME-009** — Regras do blueprint: `PREFIXO-NÚMERO` (ex: `ARCH-001`), prefixo em maiúsculas,
número sequencial de 3 dígitos por secção; números `9XX` reservados para itens relativos a
funcionalidades futuras (fora da V1), como em `DB-901`.

## 27. Definition of Done

Uma funcionalidade/PR só é considerada "concluída" quando, cumulativamente:

**DOD-001** — `pnpm lint` e `pnpm typecheck` passam sem erros.
**DOD-002** — `pnpm build` completa com sucesso.
**DOD-003** — Se envolve conteúdo MDX, o workflow `validate` (frontmatter contra schemas Zod)
passa (ver `SYNC-002`, `TEST-001`).
**DOD-004** — Segue as regras de arquitetura (`ARCH-XXX`), design (`UI-XXX`/`DESIGN-XXX`) e
naming (`NAME-XXX`) aplicáveis.
**DOD-005** — Não introduz leitura do catálogo a partir de base de dados nem escrita de conteúdo
fora do Git (`REPO-004`).
**DOD-006** — Estados de loading/vazio/erro tratados nos componentes relevantes (`COMP-003`).
**DOD-007** — Verificação manual básica de acessibilidade (navegação por teclado, contraste) em
qualquer UI nova (`A11Y-XXX`).
**DOD-008** — Se a funcionalidade introduz uma decisão de arquitetura nova ou diverge de algo já
definido, o `PROJECT_BLUEPRINT.md` é atualizado no mesmo PR — o blueprint nunca fica
desatualizado relativamente ao código (ver `DOC-001`/`DOC-002`).
**DOD-009** — Responsivo e testado visualmente em, pelo menos, um breakpoint mobile e um desktop.

## 28. Roadmap

**V1 (atual):**
- Wishlist pública
- Produtos organizados por categorias
- Página individual de produto
- Pesquisa
- Filtros
- Dark Mode
- SEO
- Responsivo

## 29. Future Ideas

- Sistema de reservas ✅ implementado (`DB-004`/`SEC-008`)
- Histórico de preços
- Notificações
- Coleções
- Favoritos
- Dashboard privado
- Integração com APIs de preços

## 30. Appendix

### Ideias de Wishlist (conteúdo inicial de referência)

- **Gaming**: Jogos físicos PS5, Jogos Nintendo Switch 2, Acessórios Fanatec
- **Setup**: BenQ ScreenBar Pro, Secretlab Magnus Pro, Secretlab Chair, Anker Prime 20K, NVIDIA Shield TV Pro
- **Perfumes**: Dior Sauvage, Prada Paradigme
- **Ténis**: New Balance (estilo 480), modelos em azul-escuro
- **Colecionismo**: LEGO Technic, LEGO Icons, LEGO Speed Champions, Hot Wheels Premium

---

## Histórico de Revisões

- **v1.0** — Todas as 30 secções fechadas: Vision, Product, Feature Architecture, Routing,
  Components, Security, Performance, Accessibility, SEO, Testing, Naming Conventions e Definition
  of Done desenvolvidas. Documento pronto para servir de entrada a agentes de IA
  (Copilot Agent, Claude Code, Codex, Cursor, Gemini CLI).

## Próximos Passos (Implementação)

Estado atual: V1 funcional, partilhável, com reservas e ciclo de ocasiões. O que falta, por ordem:

1. **Aplicar as migrações `0004` e `0005`** no Supabase e confirmar as variáveis
   `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` na Vercel. Até lá as reservas
   simplesmente não aparecem (`REPO-006`).
2. **Encher o catálogo.** A aplicação está mais construída do que a wishlist está preenchida
   (3 produtos para um alvo de 40–100 — ver `PRODUCT.md`).
3. **Rever as descrições provisórias** das categorias criadas sem produtos
   (`sim-racing`, `lego`, `sneakers`, `perfumes`, `coffee`, `home`, `accessories`).
4. **Depois do Natal:** marcar os presentes recebidos com `received:`, fechar `natal-2026` e abrir
   a ocasião seguinte (`CONTENT-006`/`CONTENT-008`).
5. **Testes de componentes** (`TEST-003`) — `Filters`, `SearchBar`, `GiftAction`.
6. Rever este blueprint sempre que uma decisão de arquitetura mudar (`DOD-008`).
