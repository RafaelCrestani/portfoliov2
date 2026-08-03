# Scroll ao topo e respiro da métrica

## Objetivo

Tornar o retorno do footer ao topo mais suave e contemplativo, além de melhorar a legibilidade entre a métrica `6+` e sua legenda.

## Scroll ao topo

- O link `VOLTAR AO TOPO ↑` deve usar a curva editorial `easeInOutCubic` já existente.
- Sua duração será de `1200 ms`, configurada apenas nesse link por um atributo declarativo.
- Os demais links editoriais permanecem com a duração padrão de `800 ms`.
- A exceção `data-scroll-instant-reduced` será removida do link do footer para impedir o salto instantâneo observado no navegador atual.
- O link mantém os `1200 ms` mesmo quando `prefers-reduced-motion: reduce` estiver ativo; essa é uma decisão deliberada para este controle.
- Mouse, toque, pointer e teclas de navegação continuam cancelando a animação em andamento.
- O hash `#topo` continua sendo atualizado ao término do movimento.

## Métrica `6+`

- A margem entre a linha tipográfica da métrica e `ANOS EM PRODUTO DIGITAL` será `32 px` no desktop.
- Até `520 px`, a margem será `24 px`.
- O recuo lateral da legenda permanece inalterado.
- Tipografia, contador, animação e alinhamento geral da abertura permanecem inalterados.

## Implementação prevista

- `js/editorial-scroll.js`: aceitar uma duração opcional em `data-scroll-duration`, resolvida localmente a cada clique com `Number(...)`, `Number.isFinite(value)` e `value > 0`. Valores ausentes, vazios, `0`, negativos, `NaN` ou infinitos usam o fallback de `800 ms`, sem alterar o padrão global.
- `index.html`: configurar `data-scroll-duration="1200"` no link e remover `data-scroll-instant-reduced`.
- `css/about.css`: substituir a margem superior fluida por `var(--space-8)` no desktop e `var(--space-6)` até `520 px`.
- Atualizar as versões de cache dos arquivos modificados.

## Critérios de aceite

1. O clique em `VOLTAR AO TOPO ↑` leva ao topo em aproximadamente `1200 ms`, sem salto inicial ou final.
2. Outros links editoriais continuam com aproximadamente `800 ms`.
3. A rolagem pode ser interrompida pelas interações já suportadas.
4. A legenda da métrica mantém 32 px de respiro no desktop e 24 px no mobile.
5. Não há overflow, mudança tipográfica ou regressão nas animações das seções.
6. O comportamento funciona no localhost e após a publicação no GitHub Pages.
7. Um atributo de duração inválido mantém os `800 ms` padrão.
8. Após `VOLTAR AO TOPO`, o próximo link editorial continua usando `800 ms`; a duração especial não persiste.
9. `VOLTAR AO TOPO` continua em `1200 ms` quando `prefers-reduced-motion: reduce` estiver ativo.
