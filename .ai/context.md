# Contexto para Agentes de IA

Este ficheiro complementa `CLAUDE.md` e `.github/copilot-instructions.md`. Todos os agentes
(Claude Code, Copilot Agent, Codex, Cursor, Gemini CLI, ...) devem tratar
`/PROJECT_BLUEPRINT.md` como a fonte de verdade única para decisões de arquitetura.

## Ordem de leitura recomendada para um novo agente

1. `PROJECT_BLUEPRINT.md` — visão geral completa, todas as regras `XXX-000`.
2. `README.md` — como correr o projeto localmente.
3. `CLAUDE.md` ou `.github/copilot-instructions.md` — instruções específicas da ferramenta.
4. Este ficheiro — notas de contexto adicionais e histórico de decisões relevantes.

## Histórico de decisões relevantes

- Optou-se por **um único documento** (`PROJECT_BLUEPRINT.md`) em vez de múltiplos ficheiros de
  documentação dispersos. Toda a documentação futura deriva desse ficheiro.
- O blueprint é escrito em **regras curtas e identificáveis** (`ARCH-001`, `DB-001`, `UI-001`,
  `CONTENT-001`, etc.) para ser facilmente interpretável por agentes de IA, em vez de texto corrido.
- O projeto está atualmente na fase de definição do blueprint — muitas secções ainda estão
  marcadas como "⏳ A desenvolver". Não assumir detalhes de implementação não definidos; se algo
  não está no blueprint, perguntar ou propor uma adição ao blueprint em vez de inventar.

## Estado atual do projeto

Fase: **planeamento / blueprint** (nenhum código de aplicação foi ainda escrito).
Próximos passos: ver secção "Plano para a Próxima Sessão" no fim do `PROJECT_BLUEPRINT.md`.
