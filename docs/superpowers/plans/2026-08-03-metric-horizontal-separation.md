# Plano de implementação — separação horizontal do `6+`

## 1. Corrigir o tracking

**Arquivo:** `css/about.css`

- Alterar somente `.about__metric strong` de `letter-spacing: -0.13em` para `letter-spacing: 0`.
- Preservar escala, margem e alinhamento vertical do `+`.

## 2. Atualizar o cache

**Arquivo:** `index.html`

- Incrementar a versão de `css/about.css`.

## 3. Validar

- Confirmar que o início do `6` não muda de posição.
- Confirmar o avanço proporcional do `+` em 160, 220 e 320 px.
- Conferir a proporção de 64%, os estados da contagem e os espaçamentos da legenda.
- Testar `320`, `390`, `520`, `521`, `720`, `960` e desktop largo.
- Validar visualmente no localhost e no GitHub Pages.
