# Correção da faixa no primeiro scroll do footer

## Problema

No início da animação do footer, o painel branco parte com `yPercent: 8`. Como o footer e o palco fixado usam `var(--color-text)` como fundo, o deslocamento expõe uma faixa preta antes de o painel alcançar sua posição final.

## Solução aprovada

- Manter a entrada vertical do painel como micro movimento.
- Reduzir o deslocamento inicial de `8%` para `3%` quando animações completas estiverem ativas.
- Manter deslocamento `0` para usuários com `prefers-reduced-motion: reduce`.
- Alterar o fundo de `.footer-contact` e `.footer-contact__stage` para `var(--color-background)`, igual ao painel.
- Não alterar a animação horizontal da frase, a cascata de caracteres, o reveal do texto, os botões ou a assinatura.

## Comportamento esperado

O primeiro scroll produz uma subida curta e sutil do conteúdo, mas nenhuma camada preta fica visível acima, abaixo ou entre o painel e o palco. A transição deve parecer contínua em desktop, tablet, mobile e paisagem baixa.

## Critérios de aceite

1. Nenhuma faixa preta aparece no primeiro scroll.
2. O painel ainda se move verticalmente de `3%` para `0` com movimento completo.
3. Com redução de movimento, o painel permanece em `0` durante toda a entrada.
4. A frase continua iniciando com aproximadamente 30% visível e atravessa horizontalmente conforme o scroll.
5. Texto, botões e assinatura mantêm tempos, posições finais e interatividade atuais.
6. Não há overflow horizontal nem erros no console nos breakpoints validados.

## Fora de escopo

- Alterar duração total ou distância do pin.
- Alterar cores de texto e botões.
- Alterar conteúdo, assinatura ou metadados do footer.
