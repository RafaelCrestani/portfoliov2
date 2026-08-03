# Ajuste de ritmo do rodapé de contato

## Objetivo

Tornar a sequência “Vamos conversar?” mais suave e contemplativa, reduzindo a quantidade de rolagem necessária sem interromper a travessia horizontal completa. Compactar também a assinatura final para remover o vazio excessivo acima da marca e dos dados legais.

## Direção aprovada

- Manter a frase atravessando completamente a tela.
- Reduzir em aproximadamente 40% a distância vertical que controla a animação.
- Amortecer a resposta do `scrub` para que pequenos impulsos da roda não produzam mudanças bruscas.
- Reduzir a queda inicial das letras e alongar levemente sua acomodação, preservando o efeito editorial letra por letra.
- Antecipar discretamente a entrada do texto de apoio e dos botões para eliminar uma cauda de rolagem vazia.
- Reduzir a altura mínima da assinatura final de 62vh para aproximadamente 44vh em desktop.
- Reduzir o padding superior da assinatura de 64px para 32px em desktop, mantendo a composição responsiva já existente em telas menores.

## Parâmetros de movimento

### Distância de rolagem

- Desktop: de 2,3 alturas de viewport para 1,4.
- Tablet: de 1,9 para 1,2.
- Mobile: de 1,5 para 1,0.

### Suavização

- `scrub`: de 0,7 para 1,0.
- Queda das letras: desktop 36px, tablet 28px, mobile 20px.
- Duração de acomodação das letras: 0,16 da timeline.
- A travessia horizontal continua linear e termina totalmente fora da tela.
- Conteúdo de contato começa a aparecer por volta de 72% da timeline; botões, por volta de 76%.

## Assinatura final

- Desktop acima de 960px: `min-height: 44svh` com fallback `44vh`.
- Padding superior: 32px.
- Logo e dados legais continuam ancorados na base, preservando a leitura editorial.
- Até 960px, mantém-se o fluxo compacto sem altura mínima.

## Acessibilidade

- `prefers-reduced-motion` continua respeitado.
- O botão de pular animação continua levando diretamente aos contatos.
- A disponibilidade de foco dos botões continua sincronizada com a revelação visual.

## Validação

- Conferir o percurso completo em 1280×912, 1024×768, 960×720, 390×844 e 320×568.
- Confirmar que a frase cruza integralmente a tela e os botões aparecem antes do fim da sequência.
- Confirmar ausência de faixa, salto ou conteúdo vazio durante o pin.
- Confirmar que a assinatura final ocupa menos altura, sem colisões entre logo e bloco legal.
- Confirmar comportamento estático e acessível com movimento reduzido.
