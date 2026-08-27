# Ideias de design — HDMicro Microsites

## Três abordagens visuais

### 1. Oficina Editorial Azul

Uma landing page com a energia de uma oficina digital: módulos parecem peças de um projeto que o cliente monta com orientação. O contraste entre azul elétrico, papel claro e grafite cria segurança sem parecer uma agência genérica.

**Probabilidade:** 0,07

### 2. Vitrine de Bairro Contemporânea

Uma estética calorosa e comercial inspirada em fachadas, placas e menus de comércio local. Mais humana e direta, com blocos de informação que parecem sinalização urbana bem organizada.

**Probabilidade:** 0,04

### 3. Cardápio de Produto Digital

Uma direção mais escura e técnica, como uma folha de especificações premium. O cliente percorre os módulos como quem escolhe ingredientes para uma solução digital.

**Probabilidade:** 0,09

---

## Direção escolhida: Oficina Editorial Azul

### Movimento de design

**Neoeditorialismo técnico brasileiro**, combinando composição de revista, diagramas de oficina e sinalização digital. A página será intencionalmente assimétrica: títulos grandes ocupam um lado, a seleção de módulos ganha uma coluna de trabalho e a prova de processo aparece como uma fita de montagem ao longo da página.

### Princípios centrais

1. **Clareza vendável:** cada frase explica uma escolha ou um resultado, sem prometer mágica.
2. **Montagem visível:** módulos, nicho e briefing formam uma sequência compreensível de projeto.
3. **Tecnologia humana:** linguagem direta para negócios locais, sem jargão desnecessário.
4. **Confiança por transparência:** o site não inventa preços, avaliações, integrações ou garantias.

### Filosofia de cor

O azul elétrico HDMicro (`#146EF5`) será a cor assinatura: ele representa ação e tecnologia acessível. O azul-marinho quase preto (`#061B3A`) dá densidade e autoridade; um fundo de papel quente (`#F5F1E8`) evita o visual frio de “site de TI”; laranja tangerina (`#FF6B35`) aparece apenas como marca de urgência e especialidade gastronômica.

### Paradigma de layout

**Linha de montagem editorial.** Em vez de uma pilha de cartões centralizados, a página usa uma faixa de leitura: marca e promessa à esquerda, composição visual à direita; depois uma régua lateral marca “Escolha / Combine / Publique”. Os módulos aparecem em uma bancada selecionável que se desloca em colunas e a área de restaurante ganha um painel próprio, com linguagem de cardápio e pedido.

### Elementos de assinatura

1. **Régua azul vertical** que acompanha seções de decisão.
2. **Etiquetas de oficina** com códigos curtos como `M01`, `M02` e `FOOD 01`.
3. **Mapa de montagem** no hero: formas modulares, setas e blocos em azul com aparência de peça digital.

### Filosofia de interação

As interações devem confirmar escolhas: ao selecionar um módulo, o resumo do projeto se atualiza; ao copiar o briefing, o site informa de modo claro que nenhum pedido foi enviado. Os botões de navegação deslocam a pessoa até a próxima decisão, sem fingir que há uma venda concluída ou um atendimento automático.

### Animação

Elementos entram com deslocamento curto e opacidade em cascata, respeitando `prefers-reduced-motion`. Os módulos recebem transição de cor e movimento de 160 ms ao selecionar; botões reduzem discretamente para `0.97` ao pressionar. Não usar animações contínuas, neon pulsante ou efeitos que distraiam do orçamento.

### Sistema tipográfico

**Space Grotesk** para títulos e números, com peso 600–700 e letras compactas; **DM Sans** para textos e formulários, com leitura confortável. Títulos são curtos, fortes e alinhados à esquerda; texto de apoio é menor, com largura limitada. Não usar Inter como fonte base.

### Essência de marca

**A HDMicro transforma a presença digital de negócios locais em microsites montados por necessidade real, não por pacote genérico.**

Personalidade: **direta, técnica e acolhedora**.

### Voz da marca

Headlines devem soar práticas e seguras; CTAs devem convidar para uma decisão concreta; microcopy deve explicar o que acontece de verdade.

Exemplos:

- “Seu negócio não precisa de um site enorme. Precisa da página certa para a próxima venda.”
- “Escolha o que entra. Nós montamos o caminho para publicar.”

### Wordmark e logo

O wordmark usa `HD` como bloco azul sólido e `Micro` em branco/grafite, acompanhado de um símbolo sem texto: três peças geométricas arredondadas conectadas por uma linha curta, representando módulos que viram uma página. O símbolo deve funcionar sozinho como favicon.

### Cor de marca assinatura

**Azul HDMicro — `#146EF5`**.

## Style Decisions

- A linha de montagem editorial será contínua: régua azul, códigos de módulo, etiquetas de estação e marcas de decisão aparecem em todas as seções principais.
- A imagem principal privilegia diagramas, blocos, setas, anotações e folhas de montagem; evitar renderizações genéricas de SaaS com brilho excessivo.
- **HDMicro** é a marca proprietária em todos os lockups. **SiteOne** aparece como produto subordinado: “SiteOne / microsites”.
- A bancada de módulos deve parecer uma superfície de trabalho, conectando a seleção do visitante ao briefing e aos códigos de montagem.
