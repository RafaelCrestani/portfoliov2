# Refinamento de metadados e assinatura do footer

## Objetivo

Reduzir o ruído visual do encerramento do portfólio e reforçar a hierarquia entre a chamada de contato, as ações e a assinatura final.

## Decisões aprovadas

- A identificação `04 / CONTATO` passa do vermelho para `var(--color-text)`, herdando o preto usado nos demais metadados editoriais. A regra específica que aplica `var(--color-accent)` ao primeiro item deve ser removida, sem introduzir preto literal ou um seletor compensatório.
- O texto `RAFAEL NASSIF · PRODUCT DESIGNER`, atualmente posicionado à direita do cabeçalho do painel, é removido integralmente.
- A assinatura `NASSIF` permanece alinhada à esquerda no rodapé final, mas sua largura máxima no desktop cai de 780 px para 520 px.
- Em telas menores, a assinatura reduz proporcionalmente e nunca ultrapassa a largura disponível.
- No desktop, o bloco legal e o link `Voltar ao topo` permanecem à direita, mantendo a composição assimétrica atual.

## Comportamento responsivo

- Acima de 960 px: `width: min(64vw, 520px)`.
- Até 960 px: `width: min(100%, 420px)` e preservação do empilhamento atual entre assinatura e bloco legal.
- Até 520 px: `width: min(100%, 300px)` para evitar competição visual com o bloco legal.
- Em paisagem baixa: `width: min(56vw, 320px)` e preservação das duas colunas já existentes.

## Fora de escopo

- Não alterar a animação horizontal de `VAMOS CONVERSAR?`.
- Não alterar o tempo ou a entrada dos botões.
- Não modificar links, textos legais, cores dos botões ou a estrutura geral do footer.

## Critérios de aceite

1. `04 / CONTATO` é exibido em preto em todos os breakpoints.
2. `RAFAEL NASSIF · PRODUCT DESIGNER` não existe mais no HTML nem deixa espaço residual.
3. A assinatura não ultrapassa 520 px no desktop e mantém proporção e nitidez.
4. A assinatura não provoca overflow horizontal em 320 px, 390 px, tablet ou desktop.
5. O bloco legal continua legível e alinhado sem colisões com a assinatura.
6. As animações e a navegação do footer permanecem funcionais.
