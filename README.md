# Wishlist Premium

Aplicação web de wishlist premium onde amigos e família podem consultar ideias de presentes.
Começa como wishlist de Natal e evolui para uma aplicação completa.

📖 **Documentação principal:** [`PROJECT_BLUEPRINT.md`](./PROJECT_BLUEPRINT.md) — a fonte de
verdade para arquitetura, base de dados, UI e regras de desenvolvimento deste projeto.

## Stack

Next.js 16 · React 19 · TypeScript · Tailwind CSS v4 · shadcn/ui · MDX · Vercel ·
GitHub Actions · pnpm

## Início rápido

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Nenhuma credencial é necessária para correr o site localmente: o catálogo vem dos ficheiros MDX.

## Filosofia

O Git é a única fonte de verdade. Todo o conteúdo (produtos, categorias, lojas) é escrito em MDX
em `content/` e entra no build:

```
MDX → GitHub → build (Next.js) → site estático
```

Não há base de dados no caminho de leitura. Como cada alteração de conteúdo é um commit, e um
commit já dispara um build, uma cópia em base de dados só acrescentaria uma dependência e uma
divergência silenciosa. O Supabase existe para estado futuro gerado por visitantes (reservas).

```bash
pnpm validate:content   # valida frontmatter, slugs únicos e referências
```

## Estrutura

Ver secção "Folder Structure" em `PROJECT_BLUEPRINT.md`.

## Instruções para agentes de IA

- [`CLAUDE.md`](./CLAUDE.md) — instruções para o Claude Code
- [`.github/copilot-instructions.md`](./.github/copilot-instructions.md) — instruções para o GitHub Copilot
- [`.ai/`](./.ai/) — contexto adicional partilhado entre agentes
