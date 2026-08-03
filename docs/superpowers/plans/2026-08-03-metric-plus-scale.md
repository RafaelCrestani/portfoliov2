# Plano de implementação — escala do símbolo `+`

## 1. Ajustar a composição tipográfica

**Arquivo:** `css/about.css`

- Manter o tamanho e o espaçamento do `6` inalterados.
- Aplicar ao `+`: `display: inline-block`, `font-size: 0.64em`, `line-height: 1`, `letter-spacing: 0`, `margin-left: 0.04em` e `vertical-align: 0.12em`.
- Preservar a regra de opacidade usada durante `.is-counting`.

## 2. Corrigir o breakpoint da legenda

**Arquivo:** `css/about.css`

- Manter `32 px` na regra-base.
- Remover o `margin-top` da regra de até `720 px`.
- Adicionar uma regra específica até `520 px` com `24 px`.

## 3. Atualizar o cache

**Arquivo:** `index.html`

- Incrementar a versão de `css/about.css` para garantir a atualização no GitHub Pages.

## 4. Validar

- Conferir a razão computada de `64%` entre `+` e `6`.
- Conferir a legenda em `520 px` (`24 px`) e `521 px` (`32 px`).
- Verificar `320`, `390`, `520`, `521`, `720`, `960` e desktop largo.
- Verificar os estados antes, durante e depois de `.is-counting`.
- Confirmar ausência de overflow e erros no console.
- Repetir a validação no GitHub Pages após a publicação.
