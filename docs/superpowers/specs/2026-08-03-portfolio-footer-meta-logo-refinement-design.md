# Refinamento de metadados e assinatura do footer

## Objetivo

Reduzir o ruído visual do encerramento do portfólio e reforçar a hierarquia entre a chamada de contato, as ações e a assinatura final.

## Decisões aprovadas

- A identificação `04 / CONTATO` passa do vermelho para o preto usado nos demais metadados editoriais.
- O texto `RAFAEL NASSIF · PRODUCT DESIGNER`, atualmente posicionado à direita do cabeçalho do painel, é removido integralmente.
- A assinatura `NASSIF` permanece alinhada à esquerda no rodapé final, mas sua largura máxima no desktop cai de 780 px para 520 px.
- Em telas menores, a assinatura reduz proporcionalmente e nunca ultrapassa a largura disponível.
- O bloco legal e o link `Voltar ao topo` permanecem à direita, mantendo a composição assimétrica atual.

## Comportamento responsivo

- Desktop: largura máxima de 520 px para a assinatura.
- Tablet e mobile: largura fluida limitada a 420 px, com folga lateral preservada.
- Mobile estreito: largura máxima visual de aproximadamente 300 px para evitar competição com o bloco legal.
- Mobile em paisagem: largura limitada a 320 px para preservar a altura útil.

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
