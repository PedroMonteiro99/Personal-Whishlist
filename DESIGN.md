---
name: Wishlist do Pedro
description: Wishlist pública de ideias de presentes, dark-mode-first, com o conteúdo em MDX versionado no Git.
colors:
  azul-vitrine: "hsl(217.2 91.2% 59.8%)"
  azul-vitrine-dia: "hsl(221.2 83.2% 53.3%)"
  ardosia-meia-noite: "hsl(224 71.4% 4.1%)"
  superficie-meia-noite: "hsl(224 71.4% 6%)"
  cinza-penumbra: "hsl(215 27.9% 16.9%)"
  cinza-penumbra-texto: "hsl(217.9 10.6% 64.9%)"
  branco-vitrine: "hsl(210 40% 98%)"
  ambar-destaque: "hsl(38 92% 50%)"
  ambar-destaque-texto: "hsl(48 96% 77%)"
  ambar-destaque-dia: "hsl(38 92% 45%)"
  ambar-destaque-texto-dia: "hsl(26 90% 30%)"
  anel-foco: "hsl(224.3 76.3% 48%)"
  placa-produto: "hsl(0 0% 100%)"
  vermelho-alerta: "hsl(0 62.8% 30.6%)"
  papel-vitrine: "hsl(0 0% 100%)"
  cinza-dia: "hsl(220 14.3% 95.9%)"
  cinza-dia-borda: "hsl(220 13% 91%)"
  cinza-dia-texto: "hsl(220 8.9% 46.1%)"
typography:
  display:
    fontFamily: "var(--font-geist-sans), Geist, system-ui, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 600
    lineHeight: "2.5rem"
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "var(--font-geist-sans), Geist, system-ui, sans-serif"
    fontSize: "1.875rem"
    fontWeight: 600
    lineHeight: "2.25rem"
    letterSpacing: "-0.025em"
  title:
    fontFamily: "var(--font-geist-sans), Geist, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: "1"
    letterSpacing: "-0.025em"
  body:
    fontFamily: "var(--font-geist-sans), Geist, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: "1.75rem"
    letterSpacing: "normal"
  body-sm:
    fontFamily: "var(--font-geist-sans), Geist, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: "1.25rem"
    letterSpacing: "normal"
  label:
    fontFamily: "var(--font-geist-sans), Geist, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: "1rem"
    letterSpacing: "0.28em"
  mono:
    fontFamily: "var(--font-geist-mono), Geist Mono, ui-monospace, monospace"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: "1.25rem"
    letterSpacing: "normal"
rounded:
  sm: "0.75rem"
  md: "0.875rem"
  lg: "1rem"
  xl: "1.5rem"
  pill: "9999px"
spacing:
  xs: "0.75rem"
  sm: "1rem"
  md: "1.25rem"
  lg: "1.5rem"
  xl: "2.5rem"
  "2xl": "3.5rem"
  seccao: "5rem"
  seccao-lg: "6rem"
components:
  button-primary:
    backgroundColor: "{colors.azul-vitrine}"
    textColor: "{colors.ardosia-meia-noite}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.pill}"
    padding: "0.5rem 1rem"
    height: "2.5rem"
  button-primary-hover:
    backgroundColor: "hsl(217.2 91.2% 59.8% / 0.9)"
    textColor: "{colors.ardosia-meia-noite}"
    rounded: "{rounded.pill}"
  button-outline:
    backgroundColor: "{colors.ardosia-meia-noite}"
    textColor: "{colors.branco-vitrine}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.pill}"
    padding: "0.5rem 1rem"
    height: "2.5rem"
  button-outline-hover:
    backgroundColor: "{colors.cinza-penumbra}"
    textColor: "{colors.branco-vitrine}"
    rounded: "{rounded.pill}"
  button-ghost-hover:
    backgroundColor: "{colors.cinza-penumbra}"
    textColor: "{colors.branco-vitrine}"
    rounded: "{rounded.pill}"
    height: "2.5rem"
  badge-priority-high:
    backgroundColor: "{colors.azul-vitrine}"
    textColor: "{colors.ardosia-meia-noite}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0.125rem 0.625rem"
  badge-priority-medium:
    backgroundColor: "{colors.cinza-penumbra}"
    textColor: "{colors.branco-vitrine}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0.125rem 0.625rem"
  badge-priority-low:
    backgroundColor: "{colors.ardosia-meia-noite}"
    textColor: "{colors.branco-vitrine}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0.125rem 0.625rem"
  chip-favorite:
    backgroundColor: "hsl(38 92% 50% / 0.1)"
    textColor: "{colors.ambar-destaque-texto}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0.125rem 0.625rem"
  card:
    backgroundColor: "{colors.superficie-meia-noite}"
    textColor: "{colors.branco-vitrine}"
    rounded: "{rounded.xl}"
    padding: "1.5rem"
  card-inset:
    backgroundColor: "hsl(224 71.4% 4.1% / 0.6)"
    textColor: "{colors.branco-vitrine}"
    rounded: "{rounded.lg}"
    padding: "1rem"
  input-search:
    backgroundColor: "{colors.ardosia-meia-noite}"
    textColor: "{colors.branco-vitrine}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.lg}"
    padding: "0.5rem 5rem 0.5rem 2.75rem"
    height: "3rem"
  monogram-tile:
    backgroundColor: "hsl(217.2 91.2% 59.8% / 0.1)"
    textColor: "{colors.azul-vitrine}"
    rounded: "{rounded.lg}"
    size: "3rem"
---

# Design System: Wishlist do Pedro

## Overview

**Creative North Star: "Vitrine à Meia-Noite"**

Uma montra vista de noite. O fundo é uma ardósia quase preta com um leve toque de azul, e cada
objeto — um produto, uma categoria, um preço — aparece como peça iluminada sobre essa escuridão.
A luz é escassa e intencional: existe uma única fonte azul e ela nunca se espalha. O que dá forma
ao espaço não é a sombra, é o tom: superfícies ligeiramente mais claras do que o fundo, separadas
por fios de borda quase invisíveis e por vidro desfocado.

A atmosfera é **calma, precisa e confiante**. Nada pisca, nada compete, nada tenta vender. O
sistema comporta-se como uma vitrine de loja fechada: a apresentação tem qualidade de retalho
premium, mas não há mecânica de compra em lado nenhum. Quando um elemento responde ao toque, a
resposta é física e contida — o cartão sobe quatro pixels, a imagem aproxima-se cinco por cento, o
título acende-se a azul. Movimento em vez de peso.

As formas são todas arredondadas e nunca há uma aresta viva: os controlos são pílulas completas,
os contentores são seixos de 24px. É essa suavidade constante, mais do que a paleta, que impede
a interface de parecer um painel de administração. Rejeitado explicitamente (`UI-003` do blueprint):
Bootstrap, Material UI e a estética "dashboard gaming".

**Key Characteristics:**

- Dark mode é o modo primário; o light mode é uma tradução, não a origem.
- Uma única cor de acento — o Azul de Vitrine — mais um âmbar reservado a um só uso.
- Profundidade por camada tonal, borda-fio e blur; praticamente sem sombra.
- Geometria totalmente arredondada: pílulas para controlos, seixos de 24px para contentores.
- Etiquetas em maiúsculas de 12px com espaçamento largo (0.22em–0.28em) como assinatura tipográfica.
- Coluna única de 1152px, respiração vertical de 80–96px entre secções.

## Colors

Uma paleta quase monocromática de azuis dessaturados, cortada por uma única luz azul saturada e
por um âmbar que só aparece uma vez por cartão.

### Primary

- **Azul de Vitrine** (`hsl(217.2 91.2% 59.8%)`): a única fonte de luz do sistema. Aparece no botão
  de ação principal, no badge de prioridade alta, no monograma da categoria (a 10% de opacidade
  sobre fundo), no título do produto quando o cartão está em hover, e no halo do cartão de
  destaques. Em light mode escurece para **Azul de Vitrine (Dia)** (`hsl(221.2 83.2% 53.3%)`) para
  manter contraste sobre papel.

### Neutral

- **Ardósia de Meia-Noite** (`hsl(224 71.4% 4.1%)`): o fundo da aplicação e o fundo interior dos
  painéis translúcidos. É também a cor do texto sobre o botão azul — o sistema inverte-se em vez
  de introduzir um branco puro.
- **Superfície de Meia-Noite** (`hsl(224 71.4% 6%)`): a cor dos cartões. Menos de dois pontos de
  luminosidade acima do fundo — a separação é deliberadamente subtil e depende da borda para ser
  lida.
- **Cinza de Penumbra** (`hsl(215 27.9% 16.9%)`): faz triplo serviço como borda, superfície
  secundária (badges de prioridade média, hover de botões) e preenchimento de skeleton. É sempre
  usado a 70% de opacidade quando é borda.
- **Cinza de Penumbra (Texto)** (`hsl(217.9 10.6% 64.9%)`): texto secundário, etiquetas, descrições,
  metadados de rodapé e ícones passivos.
- **Branco de Vitrine** (`hsl(210 40% 98%)`): texto primário. Nunca branco puro.

### Tertiary

O âmbar é um token do tema (`--favorite` / `--favorite-foreground`), não uma cor da paleta do
Tailwind, precisamente para poder trocar entre modos.

- **Âmbar de Destaque** (`hsl(38 92% 50%)` escuro · `hsl(38 92% 45%)` claro): existe apenas como
  fundo a 10% e borda a 40% do marcador de favorito.
- **Âmbar de Destaque (Texto)** (`hsl(48 96% 77%)` escuro · `hsl(26 90% 30%)` claro): o texto e a
  estrela dentro desse marcador. O modo claro escurece o tom até ao castanho-âmbar para manter
  6.34:1 sobre o fundo tingido; o escuro fica em 14.1:1. Não é usado em mais nenhum sítio.

### Sistema

- **Anel de Foco** (`hsl(224.3 76.3% 48%)`): contorno de 2px com 2px de afastamento em qualquer
  elemento com `:focus-visible`.
- **Placa de Produto** (`hsl(0 0% 100%)`): o fundo de qualquer enquadramento que contenha
  fotografia de produto. É o único token deliberadamente **igual nos dois temas** — as fotografias
  de retalho vêm sobre branco puro, e qualquer outro valor desenharia um retângulo visível à volta
  delas.
- **Vermelho de Alerta** (`hsl(0 62.8% 30.6%)`): definido no tema, ainda sem uso na V1.

### Light Mode

- **Papel de Vitrine** (`hsl(0 0% 100%)`): fundo da página e dos cartões em modo claro.
- **Cinza de Dia** (`hsl(220 14.3% 95.9%)`): superfície secundária, badges de prioridade média e
  estados de hover.
- **Cinza de Dia (Borda)** (`hsl(220 13% 91%)`): bordas e campos de formulário.
- **Cinza de Dia (Texto)** (`hsl(220 8.9% 46.1%)`): texto secundário e etiquetas.

O texto primário torna-se a Ardósia de Meia-Noite: o fundo do modo escuro passa a ser a tinta do
modo claro.

### Named Rules

**The Single Light Rule.** *(A Regra da Única Luz)* O Azul de Vitrine ocupa menos de 10% de
qualquer ecrã. Numa grelha de produtos isso significa: um badge azul só nos itens de prioridade
alta, e mais nada até o utilizador interagir. A raridade é o efeito.

**The Reserved Amber Rule.** *(A Regra do Âmbar Reservado)* O âmbar significa "favorito" e nada
mais. Se um novo estado precisar de destaque, resolve-se com tom, borda ou tipografia — nunca
pedindo emprestado ao âmbar.

**The Whole Product Rule.** *(A Regra do Produto Inteiro)* Fotografia de produto nunca é cortada.
O enquadramento é 4:3, a imagem entra em `object-contain` com folga, e o fundo é a Placa de
Produto. As fotos de retalho chegam em rácios imprevisíveis — uma delas é retrato 0.83 — e
`object-cover` chegava a comer 38% da altura.

**The Two Themes Rule.** *(A Regra dos Dois Temas)* Nenhuma cor entra na interface como classe
literal da paleta do Tailwind (`text-amber-200`, `bg-slate-900`). Toda a cor passa por um token
do tema, porque um valor fixo só pode estar certo num dos dois modos. A única constante
intencional é a Placa de Produto, que acompanha o material fotográfico e não o tema.

**The 70% Hairline Rule.** *(A Regra do Fio a 70%)* Toda a borda estrutural é
`hsl(215 27.9% 16.9% / 0.7)`. A borda a 100% está reservada a elementos que precisam mesmo de se
afirmar como caixa fechada.

## Typography

**Display Font:** Geist (with system-ui, sans-serif)
**Body Font:** Geist (with system-ui, sans-serif)
**Mono Font:** Geist Mono (with ui-monospace, monospace)

Ambas as famílias são carregadas via `next/font` e expostas como `var(--font-geist-sans)` e
`var(--font-geist-mono)`. Display e Body são deliberadamente a mesma família. A Geist Mono está
disponível mas não é usada em nenhum componente da V1.

**Character:** Uma única família geométrica neutra, trabalhada só por peso, tamanho e espaçamento.
A personalidade não vem do desenho da letra: vem do contraste entre títulos apertados
(`letter-spacing: -0.025em`) e etiquetas amplamente espaçadas (`0.22em`–`0.32em`). Essa distância
entre os dois extremos é a assinatura tipográfica do sistema.

### Hierarchy

- **Display** (600, 2.25rem/2.5rem, sobe para 3rem no `sm` e 3.75rem no `lg`, `-0.025em`,
  `text-balance`): o título da homepage. Um por página, no máximo.
- **Headline** (600, 1.875rem/2.25rem, sobe para 2.25rem no `sm`, `-0.025em`): títulos de página
  interior (pesquisa) e nome do produto na página de detalhe.
- **Title** (600, 1.125rem/1, `-0.025em`): títulos de cartão e nomes de produto na grelha.
- **Body** (400, 1rem, `line-height: 1.75rem`): parágrafos introdutórios. Medida limitada a
  `max-w-2xl` (~42rem).
- **Body Small** (400, 0.875rem, `line-height: 1.25rem`; `1.75rem` nas notas pessoais): descrições,
  metadados, texto de rodapé. É o tamanho mais usado da aplicação.
- **Label** (500, 0.75rem, maiúsculas, `letter-spacing: 0.22em`–`0.28em`): sobrescritos de secção
  ("Categorias", "Pesquisa"), rótulos de campo em cartões ("Preço", "Loja", "Notas") e badges.
  A marca no header usa a variante mais larga (`0.32em`).

### Named Rules

**The Spaced Label Rule.** *(A Regra da Etiqueta Espaçada)* Rótulos de campo dentro de cartões —
"Preço", "Loja", "Notas" — são 12px, maiúsculas, peso 500, cinza secundário, com pelo menos
`0.22em` de espaçamento. É este detalhe que faz o conteúdo parecer catalogado em vez de escrito.
O tratamento pertence a rótulos de campo e nunca a sobrescritos por cima de um título: o título
carrega o seu próprio peso.

**The Two Weights Rule.** *(A Regra do Peso Único)* O sistema usa apenas dois pesos: 400 para
texto corrido e 600 para tudo o que é título. Não há 500 em títulos nem 700 em lado nenhum.

**The Tabular Figures Rule.** *(A Regra dos Algarismos Tabulares)* Preços e contagens usam
`font-variant-numeric: tabular-nums`, para que os valores alinhem coluna a coluna quando a grelha
os empilha.

## Layout

Uma coluna central única de `max-w-6xl` (1152px), com margens laterais de 1rem no telemóvel,
1.5rem a partir de `sm` (640px) e 2rem a partir de `lg` (1024px). Não há sidebar, não há layout de
dashboard: cada página é uma pilha vertical de secções centradas.

**Ritmo vertical.** As secções abrem com 3.5rem (56px) de topo e fecham com 5rem (80px), subindo
para 5rem/6rem a partir de `lg`. Dentro de uma secção, os blocos separam-se por 2rem e os grupos
de texto por 1rem.

**Grelhas.** A homepage é uma sequência empilhada de secções à largura da coluna: hero (título,
parágrafo e a fila de pílulas de orçamento), destaques e categorias. A página de produto é a única
com grelha assimétrica — `1.05fr 0.95fr` a partir de `lg`, com 2rem de intervalo. A grelha de
produtos passa de 1 coluna para 2 em `md` (768px) e 3 em `xl` (1280px), com 1.25rem de intervalo;
a grelha de categorias segue o mesmo padrão com 1rem.

**Âncoras.** Secções alvo de ligações internas levam `scroll-mt-28` (7rem) para não ficarem
escondidas atrás do cabeçalho fixo.

**Densidade.** Cartões de produto usam 1.25rem de padding interior, cartões de conteúdo 1.5rem, e
os painéis embutidos (preço, loja, notas) 1rem. As imagens de produto são sempre 4:3.

**Cabeçalho.** Fixo no topo (`sticky`), com blur forte e fundo a 80% de opacidade, separado por um
fio de borda. O rodapé usa o mesmo fundo translúcido sem blur.

### Named Rules

**The Single Column Rule.** *(A Regra da Coluna Única)* Tudo vive dentro de 1152px centrados. Uma
vista nova que precise de mais largura está a pedir para ser dividida, não para sair da coluna.

## Elevation & Depth

Este sistema é **plano por defeito**. A profundidade não vem de sombra: vem de três camadas de
translucidez sobre um fundo escuro, de fios de borda a 70% e de desfoque.

O `body` tem um único gradiente radial — azul a 14%, largo, ancorado acima do topo da página — que
funciona como a fonte de luz da montra. Sobre isso, os cartões usam `bg-card/80` com
`backdrop-blur`, o cabeçalho usa `backdrop-blur-xl`, e os painéis embutidos descem para
`bg-background/60`. A hierarquia lê-se pela transparência, não pelo relevo.

A sombra que existe é vestigial e deliberadamente quase invisível.

### Shadow Vocabulary

- **Repouso** (`box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)`):
  aplicada a cartões e botões. Sobre um fundo a 4% de luminosidade é quase imperceptível — o seu
  papel é assentar o elemento, não elevá-lo.
- **Halo de destaque** (`box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)`
  com cor `hsl(217.2 91.2% 59.8% / 0.05)`): exclusiva do cartão de destaques da homepage. É uma
  aura azul de 5%, não uma sombra de projeção.

### Motion

Transições de cor correm em 150ms com `cubic-bezier(0.4, 0, 0.2, 1)`. O levantamento de cartão em
hover corre em 300ms; a aproximação da imagem dentro do cartão em 500ms — a imagem move-se mais
devagar do que o cartão que a contém, o que dá a sensação de profundidade sem paralaxe real.
`prefers-reduced-motion: reduce` reduz todas as transições e animações a 0.01ms e desliga o
scroll suave.

**O momento autoral: acender a montra.** A luz ambiente não está simplesmente lá — ela chega. Ao
carregar a página, `body::before` corre `vitrine-bloom` uma única vez: 1200ms de
`cubic-bezier(0.16, 1, 0.3, 1)`, de `opacity: 0` e `scale(0.92) translateY(-1.5rem)` até ao
repouso, com origem no topo. É a única animação de entrada de todo o site — nada mais tem
aparição encenada — e é literalmente a North Star a executar-se: alguém acende a montra antes de o
visitante olhar. Não bloqueia conteúdo, não repete, e desaparece em movimento reduzido.

**Nota de estado:** `framer-motion` está declarado no `package.json` mas não é importado em nenhum
componente. Toda a animação da V1 é CSS via utilitários de transição do Tailwind.

### Browser surfaces

As superfícies que o browser desenha por defeito também pertencem ao sistema: a seleção de texto
usa o Azul de Vitrine a 30%, o cursor de escrita usa o azul sólido, a barra de scroll é um fio
arredondado em Cinza de Penumbra sobre fundo transparente, e os sublinhados de ligação afastam-se
`0.25em` do texto.

A lista de opções de um `select` é desenhada pelo browser e herda o fundo do próprio campo: como
o campo é transparente para parecer uma pílula, `select option` recebe explicitamente
`hsl(var(--popover))` e `hsl(var(--popover-foreground))`. Sem isso o texto ficava claro sobre
fundo claro em dark mode. Medido: **19.24:1** no escuro e **20.13:1** no claro.

O ícone do separador é um SVG próprio (`app/icon.svg`) com o monograma em Azul de Vitrine sobre
Ardósia de Meia-Noite, nos valores exatos dos tokens (`#3b82f6` sobre `#030712`).

### Named Rules

**The Flat-At-Rest Rule.** *(A Regra do Plano em Repouso)* As superfícies são planas quando
ninguém lhes toca. A resposta a hover e foco é movimento e cor — nunca uma sombra que cresce.

**The Slow Image Rule.** *(A Regra da Imagem Lenta)* Dentro de um contentor animado, o conteúdo
visual move-se mais devagar do que o contentor (500ms contra 300ms).

## Shapes

Não existe uma aresta viva em toda a aplicação. A linguagem tem exatamente duas formas:

**Pílulas** (`border-radius: 9999px`) para tudo o que é controlo ou etiqueta: botões, campos de
texto, badges, o marcador de favorito e a contagem de produtos no cabeçalho de categoria.

**Seixos** (`border-radius: 1.5rem` / 24px) para tudo o que é contentor: cartões de produto, de
categoria, de conteúdo e o estado vazio. Dentro de um seixo, os elementos embutidos — painéis de
preço e loja, imagens secundárias, links de loja, o quadrado do monograma — descem para 1rem
(16px), criando uma hierarquia de curvatura de dois níveis.

A escala de raio do tema, derivada de `--radius: 1rem`, é `sm: 0.75rem`, `md: 0.875rem`,
`lg: 1rem`, `xl: 1.5rem`. Bordas são sempre de 1px e quase sempre a 70% de opacidade; o estado
vazio é o único elemento com borda tracejada.

### Named Rules

**The Pill and Pebble Rule.** *(A Regra da Pílula e do Seixo)* Se o utilizador clica nisso, é uma
pílula. Se isso contém coisas, é um seixo de 24px. Um elemento embutido dentro de um seixo usa
16px. Não há terceira opção.

## Components

### Buttons

- **Shape:** pílula completa (`9999px`), altura de 2.5rem, padding de 0.5rem 1rem, texto de
  0.875rem com peso 500 e ícone opcional separado por 0.5rem.
- **Primary:** fundo Azul de Vitrine, texto Ardósia de Meia-Noite (inversão total), sombra de
  repouso. Hover reduz o fundo para 90% de opacidade.
- **Outline:** borda de 1px em Cinza de Penumbra sobre fundo da página; hover preenche com Cinza de
  Penumbra. É a variante mais usada — ações secundárias, navegação de retorno, "Ver detalhe".
- **Ghost:** sem fundo nem borda; ganha o preenchimento de Cinza de Penumbra em hover.
- **Link:** texto Azul de Vitrine, sublinhado só em hover com 4px de afastamento.
- **Focus:** anel de 2px na cor Anel de Foco com 2px de afastamento sobre o fundo da página.
- **Todas as dimensões mantêm a pílula.** `size="sm"` (2.25rem) e `size="lg"` (2.75rem) partilham o
  mesmo `border-radius: 9999px` da dimensão base.

### Chips

- **Badge de prioridade:** pílula de 0.75rem de texto, peso 500, padding 0.125rem 0.625rem. Alta =
  fundo azul com texto invertido; média = fundo Cinza de Penumbra; baixa = contorno sobre fundo da
  página. A prioridade é sempre legível pelo texto ("Prioridade alta"), nunca só pela cor.
- **Marcador de favorito:** pílula em âmbar a 10% de fundo, borda a 30%, texto Âmbar de Destaque
  (Texto), com uma estrela preenchida de 14px. Não renderiza nada quando o produto não é favorito.

### Cards / Containers

- **Corner Style:** 1.5rem (24px).
- **Background:** Superfície de Meia-Noite, quase sempre a 80% de opacidade com `backdrop-blur`.
- **Border:** 1px em Cinza de Penumbra a 70%.
- **Shadow Strategy:** sombra de repouso apenas (ver Elevation & Depth).
- **Internal Padding:** 1.5rem em cartões de conteúdo, 1.25rem no cartão de produto, 1rem em
  painéis embutidos.
- **Enquadramento de imagem:** 4:3 sobre a Placa de Produto, imagem em `object-contain` com
  1.25rem de folga e fio de borda a separar da zona de texto. Quando não há imagem, o mesmo
  enquadramento recebe o gradiente de placeholder — esse sim, tematizado.
- **Hover (cartões navegáveis):** sobem 4px em 300ms; a imagem interior amplia 5% em 500ms; o
  título passa a Azul de Vitrine e a seta desloca-se 4px para a direita. Três sinais coordenados,
  nenhum deles uma sombra.
- **Um cartão, uma ligação:** cartões navegáveis são embrulhados por um único `<Link>` que envolve
  o cartão inteiro. Não há botões nem ligações secundárias dentro do cartão — uma paragem de
  tabulação por cartão, e o anel de foco desenha o contorno completo.

### Inputs / Fields

- **Style:** pílula de 2.5rem de altura, borda de 1px em Cinza de Penumbra, fundo da página,
  padding lateral de 1rem, placeholder em cinza secundário.
- **Campo de pesquisa:** variante alta (3rem) com raio de 1rem em vez de pílula, ícone de lupa de
  16px fixo a 1rem da esquerda e `label` `sr-only`.
- **Focus:** anel de 2px na cor Anel de Foco com 2px de afastamento; sem alteração de borda.
- **Disabled:** cursor bloqueado e 50% de opacidade.

### Navigation

- **Cabeçalho:** fixo no topo, fundo a 80% com `backdrop-blur-xl`, fio de borda inferior. A marca é
  um quadrado de 2.75rem com raio de 1rem e borda, contendo a etiqueta da marca em Azul de Vitrine
  (24px), seguido de duas linhas: o nome em 1rem peso 600 e um subtítulo em 12px cinza. Em hover,
  o quadrado sobe 2px.
- **Pesquisa no cabeçalho:** um campo real, não um botão que finge sê-lo. A partir de `sm` é uma
  pílula de 2.5rem com lupa à esquerda que alarga de 10rem para 14rem (13rem → 18rem em `lg`) ao
  receber foco, em 300ms; escreve-se e submete-se ali. Abaixo de `sm` não há largura para o campo,
  por isso fica um botão-ícone que leva a `/pesquisa`, onde o campo abre já em foco. Na própria
  `/pesquisa` desaparece, para não haver dois campos de pesquisa no mesmo ecrã.
- **Rodapé:** fundo translúcido sem blur, fio de borda superior, texto de 0.875rem em cinza
  secundário, empilhado no telemóvel e distribuído nos extremos a partir de `sm`.

### Empty State

Único componente do sistema com borda tracejada: cartão de seixo com `border-dashed` a 70% e fundo
a 60% de opacidade. Título e descrição, sem ilustração e sem botão. A ausência de conteúdo é
tratada com a mesma calma que a presença.

### Category Tile

Cartão de categoria com um quadrado de 3rem e raio de 1rem preenchido a Azul de Vitrine a 10%,
contendo o ícone da categoria (lucide, 20px) na cor de acento — é o único sítio onde o azul
aparece como superfície em vez de traço. O ícone vem do campo `icon` do frontmatter, resolvido por
um mapa estático; sem correspondência usa-se `package`. Uma seta de 16px no canto oposto marca a
afordância, e a contagem de produtos fecha o cartão em texto de 0.875rem peso 500.

**Só categorias com produtos são mostradas.** Uma categoria vazia levaria a uma página sem nada; o
seu mosaico só aparece quando há algo para ver.

### Galeria de Produto (componente-assinatura)

A única superfície com estado da V1, e o coração da página de produto.

- **Estrutura:** um carrossel horizontal de scroll-snap (`snap-x snap-mandatory`) dentro do seixo
  de 24px, com cada slide em 4:3 à largura total sobre a Placa de Produto e a imagem em
  `object-contain` com 1.5rem de folga (2rem a partir de `sm`). O scroll nativo dá o gesto de
  arrastar no telemóvel sem qualquer biblioteca; a barra de scroll é escondida pelo utilitário
  `no-scrollbar`.
- **Controlos:** dois botões-pílula de 2.5rem sobrepostos a 0.75rem das margens, em
  `bg-background/70` com `backdrop-blur` e fio de borda a 70%. Desaparecem (`opacity: 0`,
  `pointer-events: none`) na primeira e na última imagem em vez de ficarem cinzentos.
- **Contador:** pílula em baixo à direita, 12px, `tabular-nums`, mesmo material dos controlos.
- **Miniaturas:** faixa de quadrados de 4rem com raio de 1rem sobre a Placa de Produto, com a
  imagem em `object-contain` e 0.375rem de folga, e 1rem de padding na faixa. A ativa troca a
  borda para Azul de Vitrine e sobe a 100% de opacidade; as restantes ficam a 60%.
- **Uma imagem:** sem controlos, sem contador, sem miniaturas — só o enquadramento 4:3.
- **Sem imagens:** o enquadramento mantém-se e recebe o gradiente de placeholder com o nome da
  categoria.
- **Teclado e leitores de ecrã:** `role="group"` com `aria-roledescription="carrossel"`, cada slide
  anunciado como "Imagem N de M", setas esquerda/direita a navegar, a pista é focável para scroll
  por teclado, e uma região `aria-live` discreta anuncia a imagem atual.
- **Desktop:** a galeria fica fixa (`sticky`, 6rem do topo) enquanto a coluna de detalhes rola.
- **Movimento reduzido:** o scroll programático passa de `smooth` a `auto`.

### Filtros

Barra de controlos de `/pesquisa`, a única superfície de filtragem da aplicação.

- **Controlo:** pílula de 2.25rem com um `select` **nativo** por dentro (`appearance: none`,
  chevron de 14px sobreposto e `label` em `sr-only`). Nativo de propósito: no telemóvel abre o
  picker do sistema, que é mais rápido e mais acessível do que um menu desenhado, e poupa 29 kB de
  JavaScript face a um menu de biblioteca.
- **Estado:** fechado mostra o nome do campo em cinza secundário; ativo mostra o valor escolhido e
  a pílula passa a borda e fundo de Azul de Vitrine a 40% / 10%. A primeira opção da lista repõe
  o campo.
- **Campos:** Loja, Categoria, Orçamento, Prioridade e Ordenar, por esta ordem. Só são oferecidas
  lojas e categorias que ainda devolvem resultados nesta pesquisa.
- **Limpar filtros:** botão de texto sublinhado que só aparece com filtros ativos, e que preserva
  o termo de pesquisa.
- **Estado da URL:** cada campo é um `searchParam` em português (`loja`, `categoria`, `preco`,
  `prioridade`, `ordenar`). Um valor inválido é ignorado, nunca rebenta a página. Cada controlo é
  dono apenas do seu parâmetro e parte sempre da URL atual — incluindo o campo de pesquisa, que só
  escreve `q`.

### A marca

Uma **etiqueta de preço**, não um monograma. Diz o que o site é — preços e lojas — e sobrevive a
16px no separador do browser, que é onde a marca é mais vezes vista. O furo da etiqueta é
preenchido com a cor da superfície onde assenta, e no favicon recebe um halo claro: a etiqueta é
iluminada pela mesma luz que ilumina a página, vinda de cima.

Foi escolhida contra duas alternativas testadas em tamanho real: um monograma "WP", ilegível a
16px, e uma grelha de vitrine com um painel aceso — conceptualmente mais próxima da North Star,
mas que a 16px lia como ícone de launcher de aplicações, exatamente a estética "dashboard" que o
`UI-003` do blueprint proíbe.

O ficheiro do favicon (`app/icon.svg`) leva o seu próprio fundo Ardósia; o componente
`BrandMark` é só o glifo e herda a cor por `currentColor`.

### Onde comprar

A secção que resolve a pergunta "onde é que compro isto". Uma linha por loja dentro do seixo, cada
uma um link externo: nome da loja à esquerda, preço em `tabular-nums` e seta à direita. Ordenadas
da mais barata para a mais cara; lojas sem preço mostram "Sob consulta" e caem para o fim.

Quando há preços diferentes entre lojas, a primeira ganha borda de Azul de Vitrine e uma pílula
"Mais barato" a 10% — e o preço no topo da página, tal como no cartão da grelha, passa a "desde
X €". Com uma só loja, ou com preços iguais, nada disto aparece: o destaque só existe quando há
mesmo uma escolha a fazer.

O botão principal aponta sempre para a loja mais barata.

**Sem logótipos de loja.** As lojas são identificadas por nome, nunca pela sua marca gráfica. São
marcas de terceiros com paletas próprias — a Amazon laranja, e depois Worten, Fnac, Auchan — e
deixá-las entrar transforma a lista num mosaico de cores, contra a Regra da Única Luz. Além disso,
o nome já está escrito ao lado: o logótipo não acrescentaria informação, só decoração. O que
acrescenta informação é a **diferença de preço**, e é isso que a linha mostra.

### Pílulas de orçamento (homepage)

A porta de entrada do hero: uma fila de pílulas de 2.5rem — "Até 50 €", "50 € – 150 €", … — cada
uma com a contagem real em `tabular-nums`, ligando a `/pesquisa?preco=…`. Só aparecem as faixas
que têm produtos. Em hover ganham borda e fundo de acento. Respondem à primeira pergunta de quem
oferece um presente antes de ela ser feita.

## Do's and Don'ts

### Do:

- **Do** manter o Azul de Vitrine abaixo de 10% da área de qualquer ecrã (The Single Light Rule).
- **Do** usar `hsl(215 27.9% 16.9% / 0.7)` como borda estrutural em qualquer superfície nova.
- **Do** criar profundidade com translucidez e `backdrop-blur` sobre a Ardósia de Meia-Noite, em
  camadas de 60% / 80% / 90%.
- **Do** responder a hover com um levantamento de 4px em 300ms, mudança de cor do título e
  deslocação da seta — em conjunto, não isoladamente.
- **Do** definir qualquer rótulo de contexto em 12px maiúsculas com `0.22em`–`0.28em` de
  espaçamento e cor secundária.
- **Do** manter todo o conteúdo dentro da coluna de 1152px com `px-4 sm:px-6 lg:px-8`.
- **Do** enquadrar todas as imagens de produto em 4:3 com `object-contain` sobre a Placa de
  Produto, para que nada seja cortado.
- **Do** duplicar qualquer informação transmitida por cor em texto legível (a prioridade diz
  "Prioridade alta", não confia no azul).
- **Do** tratar o estado vazio com o cartão de borda tracejada, sem ilustração, com uma ação
  opcional quando existe um caminho de recuperação óbvio.
- **Do** dar `focus-visible` visível a tudo o que é operável, com o anel de 2px e 2px de
  afastamento.
- **Do** tornar cada cartão navegável um único link que envolve o cartão inteiro.
- **Do** usar `tabular-nums` em preços e contagens.
- **Do** tematizar as superfícies do browser — seleção, cursor, barra de scroll, afastamento do
  sublinhado — a partir da paleta.
- **Do** preferir o controlo nativo (`select`, `input`) quando ele resolve o problema: no telemóvel
  ganha em velocidade, acessibilidade e peso.
- **Do** refletir qualquer filtro ou ordenação na URL, para que a vista seja partilhável.

### Don't:

- **Don't** introduzir sombras duras ou sombras que crescem em hover — a profundidade é tonal
  (`DESIGN-003` do blueprint).
- **Don't** acrescentar um segundo tom de acento. O âmbar está reservado ao marcador de favorito e
  o vermelho ao erro.
- **Don't** usar cantos retos. Controlos são pílulas, contentores são seixos de 24px, embutidos são
  16px.
- **Don't** colocar um sobrescrito ou etiqueta por cima de um título de secção — o título carrega
  o seu próprio peso.
- **Don't** aninhar cartões. Uma grelha de produtos nunca vive dentro de outro cartão.
- **Don't** repetir a mesma ligação dentro de um cartão (imagem, título e botão a apontar ao mesmo
  destino).
- **Don't** usar mais do que dois pesos tipográficos (400 e 600).
- **Don't** sobrepor texto às imagens de produto; a informação vive sempre abaixo da imagem.
- **Don't** assumir que `framer-motion` está em uso — hoje toda a animação é CSS. Introduzi-lo é
  uma decisão nova, não uma continuação.
- **Don't** usar classes literais da paleta do Tailwind para cor (`text-amber-200`, `bg-slate-900`)
  — um valor fixo só pode estar certo num dos dois temas.
- **Do** anunciar o preço mais baixo como "desde X €" sempre que as lojas pedirem valores
  diferentes, para não prometer um preço que só existe num sítio.
- **Don't** cortar fotografia de produto com `object-cover` — os rácios de origem variam de 0.83 a
  1.34 e o corte come o produto.
- **Don't** mostrar uma categoria sem produtos na grelha da homepage.
- **Don't** reconstruir a URL de raiz num controlo: cada um é dono só do seu parâmetro e parte
  sempre da URL atual, ou apaga os filtros dos outros ao hidratar.
- **Do** mostrar, nas lojas mais caras, quanto custa a mais face à mais barata (`+20,12 €`) — é a
  informação que decide, ao contrário de um logótipo.
- **Don't** usar logótipos de lojas: são marcas de terceiros com paletas próprias e violam a Regra
  da Única Luz, sem acrescentar informação ao nome que já está escrito.
- **Don't** disfarçar navegação de campo de entrada: se parece um campo de pesquisa, tem de se
  poder escrever nele.
- **Don't** desenhar em light mode primeiro. O dark mode é a origem e o light mode é a tradução
  (`UI-004` do blueprint).
- **Don't** recorrer a padrões de Bootstrap, Material UI ou "dashboard gaming" (`UI-003` do
  blueprint).
