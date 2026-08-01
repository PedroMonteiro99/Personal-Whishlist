# Wishlist Premium

Aplicação web de wishlist premium onde amigos e família podem consultar ideias de presentes.
Começa como wishlist de Natal e evolui para uma aplicação completa.

📖 **Documentação principal:** [`PROJECT_BLUEPRINT.md`](./PROJECT_BLUEPRINT.md) — a fonte de
verdade para arquitetura, base de dados, UI e regras de desenvolvimento deste projeto.

## Stack

Next.js 15 · React 19 · TypeScript · Tailwind CSS v4 · shadcn/ui · Framer Motion · Supabase ·
MDX · Vercel · GitHub Actions · pnpm

## Início rápido

```bash
pnpm install
cp .env.example .env.local   # preencher as credenciais do Supabase
pnpm dev
```

## Filosofia

O Git é a única fonte de verdade. Todo o conteúdo (produtos, categorias, lojas) é escrito em
MDX em `content/` e sincronizado para o Supabase via GitHub Actions:

```
MDX → GitHub → GitHub Actions → Supabase → Aplicação
```

## Estrutura

Ver secção "Folder Structure" em `PROJECT_BLUEPRINT.md`.

## Instruções para agentes de IA

- [`CLAUDE.md`](./CLAUDE.md) — instruções para o Claude Code
- [`.github/copilot-instructions.md`](./.github/copilot-instructions.md) — instruções para o GitHub Copilot
- [`.ai/`](./.ai/) — contexto adicional partilhado entre agentes
