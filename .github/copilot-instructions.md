# GitHub Copilot Instructions — Wishlist Premium

Estas instruções aplicam-se a todas as sugestões do Copilot (chat e autocomplete) neste
repositório. A fonte de verdade completa está em `/PROJECT_BLUEPRINT.md` — consulta-a sempre
que precisares de detalhe adicional.

## Contexto do projeto

Wishlist Premium é uma aplicação web moderna e minimalista onde amigos e família consultam
ideias de presentes. Não é uma loja online. Deve parecer um produto comercial premium.

## Stack

- Next.js 15 (App Router) + React 19 + TypeScript (strict)
- Tailwind CSS v4 + shadcn/ui + Framer Motion
- Supabase (backend/DB)
- Conteúdo em MDX
- Deploy: Vercel · CI/CD: GitHub Actions · Package manager: pnpm

## Regras a seguir sempre

- **REPO-001/002**: o Git (ficheiros MDX) é a única fonte de verdade. Nunca gerar código que
  escreva diretamente na base de dados fora do fluxo `MDX → GitHub Actions → Supabase`.
- **ARCH-001/002**: preferir Server Components. Usar `"use client"` apenas quando necessário.
- **ARCH-004/005**: componentes pequenos, sem duplicação de código, extrair para `lib/`/`hooks/`.
- **ARCH-006/007**: TypeScript strict, validar dados externos com Zod.
- **CONTENT-001/002/003**: um produto = um ficheiro MDX; frontmatter estruturado, corpo Markdown
  apenas com notas pessoais.
- **UI-001/002/003/004**: usar shadcn/ui; inspiração em Apple/Vercel/Linear/Raycast/Arc/Notion;
  evitar Bootstrap, Material UI e estética "dashboard gaming"; Dark Mode é o modo primário.
- **DESIGN-001..005**: espaço em branco generoso, tipografia premium, sombras suaves, cartões
  minimalistas, animações discretas (Framer Motion).
- **FEAT-001..005**: cada feature em `features/<feature>/`; nunca importar diretamente de dentro
  de outra feature; acesso a dados centralizado em `lib/supabase/` e funções por feature.
- **ROUTE-001..005**: rotas da V1 são `/`, `/categoria/[slug]`, `/produto/[slug]`, `/pesquisa`;
  filtros/pesquisa refletidos sempre na URL via `searchParams`.
- **SEC-001..006**: RLS ativado, leitura pública apenas; `service_role` nunca em código exposto
  ao browser; segredos apenas em `.env.local` / GitHub Actions Secrets.
- **DOD-001..009**: uma tarefa só está concluída com lint + typecheck + build a passar, estados
  de loading/vazio/erro tratados, e o blueprint atualizado se necessário.

## Organização de código

- `app/` — rotas (App Router)
- `components/` — componentes de UI reutilizáveis (`components/ui` = shadcn/ui)
- `features/` — lógica e componentes organizados por feature
- `lib/` — utilitários e clients (ex: cliente Supabase)
- `hooks/` — hooks React reutilizáveis
- `scripts/` — scripts de sincronização e manutenção
- `supabase/` — migrations e configuração
- `types/` — tipos partilhados
- `content/` — conteúdo MDX (`wishlist/`, `stores/`, `categories/`, `pages/`)

## O que evitar

- Não sugerir Bootstrap, Material UI, ou bibliotecas de "dashboard" genéricas.
- Não sugerir escrita direta na base de dados (sempre via sincronização a partir de MDX).
- Não implementar funcionalidades da secção "Future Ideas" do blueprint sem pedido explícito
  (reservas, histórico de preços, notificações, coleções, dashboard privado).
- Não usar `any` sem justificação explícita em comentário.

## Ao gerar Pull Requests / Issues

- Referenciar as regras do blueprint relevantes (ex: `ARCH-003`, `DB-001`) na descrição.
- Garantir que o workflow `validate` (lint + typecheck + validação de frontmatter MDX) passa
  antes de sugerir merge.
