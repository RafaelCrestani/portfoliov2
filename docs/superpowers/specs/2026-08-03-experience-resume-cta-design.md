# Botão de currículo na seção Experiência

## Objetivo

Disponibilizar o currículo de Rafael diretamente na seção Experiência, com uma ação clara no sidebar desktop e acesso equivalente no mobile.

## Arquivo e comportamento

- O PDF de origem é `C:\Users\Rafael Nassif\Downloads\CV - Rafael Nassif Crestani - 2026.pdf`.
- Uma cópia versionada será publicada como `assets/documents/cv-rafael-nassif-crestani-2026.pdf`.
- O texto da ação será `VER CURRÍCULO` acompanhado por `↗` com `aria-hidden="true"`.
- As duas instâncias usarão `aria-label="Ver currículo — abre em nova aba"` para anunciar o comportamento sem alterar o texto visual.
- O clique abrirá o PDF em nova aba com `target="_blank"` e `rel="noopener noreferrer"`.
- O link apontará para um caminho relativo ao projeto, compatível com localhost e GitHub Pages em `/portfoliov2/`.

## Desktop

- O botão ficará dentro do sidebar fixo de Experiência, depois do último item `SOFTEN` e antes do contador `01 / 05`.
- A margem inferior do link `SOFTEN` será zerada. Depois dele, um wrapper com borda superior de `1 px` e `padding-top: 24px` separará a ação da timeline sem somar os `22 px` atuais do último item.
- O botão não receberá marcador quadrado; assim, não parecerá um sexto capítulo.
- O botão terá `box-sizing: border-box`, largura total do conteúdo útil do rail, altura mínima de `48 px`, `padding: 12px 8px`, `gap: 4px`, fundo transparente, borda cinza e tipografia Satoshi em caixa alta com `font-size: var(--type-nav-size)` e `line-height: var(--type-nav-lh)`.
- O texto usará `white-space: nowrap`; o ícone ficará em um item flex sem encolhimento. Essa composição deve caber nos aproximadamente `115 px` úteis do rail em `961 px`.
- Entre `961 px` e `1040 px`, o padding horizontal do CTA será reduzido para `4 px` e o gap para `0`, preservando a fonte de `12 px` e evitando qualquer quebra na largura mínima do rail.
- Em hover com mouse, fundo e borda passam ao vermelho de destaque, o texto fica claro e o botão sobe `2 px`.
- O foco por teclado terá outline vermelho visível e independente do hover.
- Em `@media (min-width: 961px) and (max-height: 720px)`, o rail usará `padding-block: 24px`, o índice usará `margin-top: 24px`, o wrapper do currículo usará `padding-top: 12px`, o botão continuará com `min-height: 48px` e o contador usará `bottom: 24px`. Os links e o botão mantêm sua área interativa de `48 px`; somente os espaços externos são compactados.

## Mobile e tablet

- O wrapper mobile usa `display: none` por padrão. O sidebar e sua ação permanecem visíveis acima de `960 px`.
- Em `max-width: 960px`, o sidebar inteiro continua oculto e o wrapper mobile passa a `display: block`; em `960 px` há apenas a versão mobile e em `961 px` apenas a versão desktop.
- Uma segunda instância da mesma ação ficará depois de `.experience__story`, ao final da seção Experiência e antes do footer.
- O botão mobile terá largura total, altura mínima de `56 px`, fonte de `16 px`, line-height de `20 px` e padding em múltiplos da grade de 4 pt.
- A faixa mobile terá `padding: 32px clamp(20px, 6vw, 52px)`, alinhado ao `padding-inline` de `.experience__chapter-inner`, e uma borda superior fina.
- Apenas uma das duas instâncias ficará visível em cada breakpoint.

## Estrutura e estilos

- `index.html`: inserir o link desktop após `.experience__index` e a faixa mobile após `.experience__story`.
- `css/experience.css`: criar estilos compartilhados de `.experience__resume-link`, a variação do rail e o wrapper mobile; definir hover, foco, breakpoints e o ajuste para desktop baixo.
- `index.html`: incrementar a versão de cache de `experience.css`.
- Nenhum JavaScript novo será necessário.

## Critérios de aceite

1. Em larguras acima de `960 px`, o botão aparece abaixo de `SOFTEN` no sidebar e não se sobrepõe ao contador.
2. Em larguras até `960 px`, o botão do sidebar não aparece e a ação mobile fica ao final da seção Experiência.
3. O mobile usa fonte de `16 px` e altura mínima de `56 px`; o desktop mantém pelo menos `48 px` de área interativa.
4. Hover, foco visível e navegação por teclado funcionam sem deslocar a timeline.
5. O clique abre o PDF em nova aba no localhost e no GitHub Pages.
6. O PDF publicado corresponde ao arquivo fornecido e responde como documento PDF.
7. Não há overflow horizontal, quebra indesejada do texto ou colisão com o contador em `320`, `390`, `720`, `960`, `961`, `1024`, `1280` e em viewport desktop de baixa altura.
8. O contador e a navegação ativa da Experiência continuam funcionando sem alterações.
9. A ação desktop não colide com o contador em `961×560`, `1024×600` ou `1280×720` e não quebra o texto na largura útil mínima.
10. O arquivo está versionado, começa com a assinatura `%PDF-` e sua URL relativa sem `/` inicial retorna `200` com `Content-Type: application/pdf` no GitHub Pages.
