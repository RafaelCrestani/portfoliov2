# Plano de implementação — refinamento do footer

## Arquivos

- `index.html`
- `css/footer.css`

## Etapas

1. Remover do HTML o metadado `Rafael Nassif · Product Designer`.
2. Remover a regra que colore o primeiro metadado com `var(--color-accent)`, permitindo que `04 / CONTATO` herde `var(--color-text)`.
3. Atualizar a largura da assinatura para:
   - acima de 960 px: `min(64vw, 520px)`;
   - até 960 px: `min(100%, 420px)`;
   - até 520 px: `min(100%, 300px)`;
   - paisagem baixa: `min(56vw, 320px)`.
4. Remover estilos que existiam apenas para esconder o segundo metadado no mobile.
5. Atualizar a versão do stylesheet do footer para evitar cache visual antigo.
6. Validar ausência de overflow, alinhamento do bloco legal e preservação das animações em desktop, tablet, mobile e paisagem baixa.
