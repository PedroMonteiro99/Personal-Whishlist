# CLAUDE.md

Instruções para o Claude Code (e outros agentes de IA) ao trabalhar neste repositório.

## Fonte de Verdade

**Antes de qualquer alteração, lê `PROJECT_BLUEPRINT.md`.** Esse documento é a constituição do
projeto: arquitetura, base de dados, regras de UI, convenções de código, etc. Este `CLAUDE.md`
apenas resume o essencial para o dia a dia — em caso de conflito, o blueprint prevalece.

## O que é este projeto

Wishlist Premium: uma aplicação web onde amigos e família consultam ideias de presentes.
Não é uma loja. É uma aplicação elegante, minimalista, "premium", pensada para durar anos.

## Stack

Next.js 15 (App Router) · React 19 · TypeScript strict · Tailwind CSS v4 · shadcn/ui ·
Framer Motion · Supabase · MDX · Vercel · GitHub Actions · pnpm

## Regras não-negociáveis

1. **O Git é a única fonte de verdade.** Nunca editar dados diretamente no Supabase Studio.
   Todo o conteúdo (produtos, categorias, lojas) é gerido via ficheiros MDX em `content/` e
   sincronizado para o Supabase através de GitHub Actions.
2. **Server Components por defeito.** Só usar `"use client"` quando for mesmo necessário
   (estado, hooks, interatividade, browser APIs).
3. **Um produto = um ficheiro MDX.** Frontmatter = dados estruturados (validados com Zod).
   Corpo Markdown = apenas notas pessoais.
4. **TypeScript strict, sem `any` não justificado.**
5. **Zod para validar qualquer dado externo** (frontmatter, formulários, respostas de API/DB).
6. **Sem duplicação de código.** Extrair lógica repetida para `lib/` ou `hooks/`.
7. **Componentes pequenos**, uma responsabilidade cada, organizados por feature em `features/`.
8. **Estética:** inspiração em Apple, Vercel, Linear, Raycast, Arc, Notion. Dark Mode first,
   muito espaço em branco, tipografia premium, sombras suaves, cartões minimalistas, animações
   discretas. Evitar explicitamente Bootstrap, Material UI e estética "dashboard gaming".
9. **Segurança:** RLS ativado em todas as tabelas, apenas leitura pública. `service_role` do
   Supabase nunca é usada em código exposto ao browser — só nos scripts de sincronização (`SEC-XXX`).
10. **Definition of Done:** antes de dar uma tarefa por concluída, confirmar lint, typecheck,
    build, estados de loading/vazio/erro tratados, e o blueprint atualizado se alguma decisão de
    arquitetura mudou (`DOD-XXX`).

## Estrutura do repositório

```
app/          Rotas (App Router)
components/   Componentes de UI reutilizáveis (components/ui = shadcn/ui)
features/     Lógica/componentes por feature de produto
lib/          Utilitários e clients (ex: Supabase client)
hooks/        React hooks reutilizáveis
scripts/      Scripts de sincronização MDX → Supabase, seed, manutenção
supabase/     Migrations e config do Supabase
types/        Tipos TypeScript partilhados
content/      Conteúdo MDX (wishlist/, stores/, categories/, pages/)
docs/         Documentação derivada do blueprint
.ai/          Contexto adicional para agentes de IA
```

## Fluxo de dados

```
MDX → GitHub → GitHub Actions → Supabase → Aplicação
```

Nunca escrever na base de dados fora deste fluxo.

## Comandos úteis (a confirmar/ajustar ao inicializar o projeto)

```bash
pnpm install       # instalar dependências
pnpm dev           # ambiente de desenvolvimento
pnpm lint          # lint
pnpm typecheck     # verificação de tipos
pnpm build         # build de produção
pnpm sync:content  # sincronizar MDX → Supabase (script a criar em scripts/)
```

## Ao adicionar/alterar funcionalidades

- Confirmar se a funcionalidade está na V1 (ver secção "Roadmap" do blueprint) ou é uma
  "Future Idea" — não implementar funcionalidades futuras prematuramente.
- Atualizar `PROJECT_BLUEPRINT.md` sempre que uma decisão de arquitetura for tomada.
- Preferir consistência com as regras `ARCH-XXX`, `DB-XXX`, `UI-XXX`, `CONTENT-XXX` do blueprint.

## Ao gerar conteúdo MDX de exemplo

Seguir sempre a estrutura de pastas em `content/wishlist/<categoria>/` e incluir frontmatter
válido (nome, slug, categoria, loja, preço, prioridade, favorito, imagens, links, SEO).
