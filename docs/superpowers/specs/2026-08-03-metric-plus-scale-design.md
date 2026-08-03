# Escala óptica do símbolo `+`

## Objetivo

Melhorar a leitura da métrica `6+` na abertura da seção Sobre, reduzindo a massa visual do símbolo sem diminuir o protagonismo do número nem afastar excessivamente a legenda.

## Direção aprovada

- O número `6` mantém a escala atual em todos os breakpoints.
- O símbolo `+` passa a usar `64%` do corpo tipográfico herdado do número.
- O símbolo será alinhado opticamente ao centro do número, preservando sua leitura como parte da mesma métrica: `display: inline-block`, `line-height: 1`, `letter-spacing: 0`, `margin-left: 0.04em` e `vertical-align: 0.12em`.
- A proporção de `64%` será a mesma no desktop, tablet e mobile.
- O respiro entre a linha da métrica e `ANOS EM PRODUTO DIGITAL` permanece em `32 px` no desktop e `24 px` até `520 px`.
- Cor, família tipográfica, peso e conteúdo da métrica permanecem inalterados.

## Comportamento e acessibilidade

- O contador continua animando de `0` a `6` uma vez por visita.
- O `+` continua oculto durante a contagem e reaparece no encerramento da animação.
- O `aria-label="mais de 6 anos em produto digital"` permanece como nome acessível do conjunto.
- Nenhum texto ou símbolo adicional será inserido no HTML.

## Implementação prevista

- `css/about.css`: transformar `.about__metric-plus` em um elemento inline de escala própria, usando os valores exatos aprovados: `font-size: 0.64em`, `line-height: 1`, `letter-spacing: 0`, `margin-left: 0.04em` e `vertical-align: 0.12em`.
- `css/about.css`: manter `margin-top: var(--space-8)` na regra-base da legenda, remover a alteração de margem do breakpoint de `720 px` e aplicar `var(--space-6)` somente em `@media (max-width: 520px)`.
- `index.html`: atualizar apenas a versão de cache de `about.css`.
- Não alterar os tokens globais de tipografia, pois a redução é específica do símbolo da métrica.

## Critérios de aceite

1. O `6` mantém exatamente o tamanho atual em cada breakpoint.
2. O tamanho computado do `+` corresponde a `64%` do tamanho computado do `6`.
3. O símbolo permanece visualmente associado ao número, não sobrepõe o `6` e não parece subscrito ou sobrescrito.
4. A legenda mantém 32 px de distância no desktop e 24 px até `520 px`.
5. O conjunto não produz overflow horizontal em desktop ou mobile.
6. Antes da contagem, durante `.is-counting` e depois da contagem, o `6` não muda de posição; o `+` fica invisível durante a contagem sem remover seu espaço e reaparece alinhado ao final.
7. A página respeita `prefers-reduced-motion` sem alterar a composição final.
8. O resultado é validado no localhost e, após publicação, no GitHub Pages.
9. A validação responsiva cobre `320`, `390`, `520`, `521`, `720`, `960` e pelo menos um desktop largo; em `520 px` a margem é `24 px`, enquanto em `521 px` e `720 px` ela permanece em `32 px`.
