# Separação horizontal da métrica `6+`

## Objetivo

Criar um pequeno espaço visual entre o terminal do número `6` e o traço do símbolo `+`, mantendo os dois elementos claramente associados como uma única métrica.

## Direção aprovada

- O tamanho do `6` permanece inalterado.
- O `+` permanece com `64%` do corpo do número e mantém o alinhamento vertical atual.
- O tracking negativo de `-0.13em` será removido do conjunto da métrica.
- O conjunto passa a usar `letter-spacing: 0` no `<strong>`; o valor explícito do `+` também permanece em `0`.
- A margem proporcional existente do `+`, `0.04em`, permanece inalterada.
- O avanço resultante será proporcional ao corpo tipográfico: aproximadamente `41.6 px` no desktop de `320 px`, `28.6 px` quando o número usa `220 px` e `20.8 px` quando usa `160 px`.

## Comportamento preservado

- O contador continua animando de `0` a `6` uma vez por visita.
- Durante `.is-counting`, o `+` continua invisível sem sair do fluxo; portanto, o número não muda de posição.
- Cor, família, peso, escala, alinhamento vertical e acessibilidade permanecem inalterados.
- O respiro da legenda continua em `32 px` acima de `520 px` e `24 px` até `520 px`.

## Implementação prevista

- `css/about.css`: substituir `letter-spacing: -0.13em` por `letter-spacing: 0` em `.about__metric strong`.
- `index.html`: incrementar a versão de cache de `about.css`.
- Nenhuma alteração em HTML estrutural ou JavaScript.

## Critérios de aceite

1. Há espaço branco visível entre o terminal do `6` e o início do traço horizontal do `+`.
2. O `+` mantém exatamente `64%` do tamanho computado do `6`.
3. O número mantém tamanho, posição inicial e alinhamento atuais.
4. A separação cresce proporcionalmente com a tipografia e continua equilibrada em `320`, `390`, `520`, `521`, `720`, `960` e desktop largo.
5. Durante a contagem, o `6` não se desloca; ao final, o `+` reaparece na posição aprovada.
6. O conjunto não produz overflow horizontal.
7. A legenda mantém os espaçamentos responsivos já aprovados.
8. O resultado é validado visualmente no localhost e no GitHub Pages após a publicação.
