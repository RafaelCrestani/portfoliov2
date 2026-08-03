# Plano de implementação — faixa no primeiro scroll do footer

## Arquivos

- `css/footer.css`
- `js/footer.js`
- `index.html`

## Etapas

1. Alterar o fundo de `.footer-contact` e `.footer-contact__stage` para `var(--color-background)`.
2. Reduzir o estado inicial do painel de `yPercent: 8` para `yPercent: 3`, preservando `0` em redução de movimento.
3. Atualizar as versões de cache do CSS e do JavaScript do footer.
4. Confirmar que a camada atrás do painel permanece visualmente contínua durante o deslocamento inicial.
5. Validar o primeiro scroll, overflow, console e estados finais em desktop e mobile.
