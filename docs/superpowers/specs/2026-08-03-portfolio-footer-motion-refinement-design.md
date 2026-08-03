# Refinamento de movimento do footer do portfólio

Data: 2026-08-03  
Status: aprovado conceitualmente pelo usuário; aguardando revisão técnica e revisão final do documento.

## Objetivo

Refinar a seção de contato para aproximar sua coreografia da referência escolhida pelo usuário. O footer deve iniciar com parte da frase já visível, construir a tipografia por queda progressiva de caracteres, atravessar a tela horizontalmente e revelar os contatos de forma coreografada. O painel deve perder todas as bordas arredondadas.

## Escopo

O trabalho fica restrito ao footer existente em `index.html`, `css/footer.css` e `js/footer.js`. A assinatura com a marca Nassif, os links atuais, a lógica de pin com GSAP/ScrollTrigger e os fallbacks existentes são preservados.

Ficam fora do escopo:

- alterar textos, links ou canais de contato;
- mudar tipografia, paleta ou identidade visual geral;
- modificar as seções Hero, Sobre ou Experiência;
- reintroduzir grid, marquee ou retrato no footer.

## Composição visual

### Painel

- O painel da seção Contato usa corte reto em todos os breakpoints.
- `footer-contact__panel` e `footer-contact__signature` não usam `border-radius`.
- A transição entre Experiência, Contato e assinatura ocorre por linhas e contraste de fundo, sem cápsula ou cartão arredondado.

### Frase principal

- A frase continua sendo “VAMOS CONVERSAR?”.
- Ao iniciar a área pinada, entre 25% e 35% da largura real da frase já intersecta a viewport e seus glifos estão perceptíveis.
- A posição inicial é calculada com base em `track.scrollWidth`: `viewportWidth - trackWidth * 0.30`, limitada para evitar posicionamento inadequado em telas muito estreitas.
- A frase permanece em uma linha na versão aprimorada.

## Estrutura de marcação

O texto semântico do título permanece íntegro para tecnologias assistivas. O `h2` recebe `aria-label="Vamos conversar?"`. A versão visual recebe `aria-hidden="true"` e contém um `span` por caractere, incluindo um espaço preservado entre as palavras.

Cada caractere visual usa uma classe própria e um índice CSS/JS para o stagger. A versão estática sem JavaScript continua exibindo o texto completo, sem depender dos caracteres animados para leitura.

O texto de apoio recebe um wrapper neutro `.footer-contact__copy-mask`, com `overflow: hidden`. O `<p>` continua semanticamente íntegro; somente o `<p>` é animado em opacidade e deslocamento. O wrapper mantém padding vertical mínimo de 4 px para não recortar ascendentes, descendentes ou acentos.

## Coreografia

### 1. Entrada do painel

O painel mantém a subida curta já existente, porém sem arredondamento. A entrada deve ser discreta e terminar antes que a queda tipográfica se torne o foco.

### 2. Cascata tipográfica

- Em movimento normal, todos os caracteres participam da sequência em cascata, inclusive os que formam os 30% inicialmente visíveis. Em movimento reduzido, todos participam da queda curta simultaneamente, sem stagger.
- Cada caractere começa acima da linha de base, com deslocamento vertical curto. Os caracteres que intersectam a viewport iniciam com `autoAlpha` suficiente para serem perceptíveis, aproximadamente `0.30`; assim os 25%–35% da frase são de fato visíveis desde o começo, embora ainda estejam caindo. A opacidade chega a `1` junto com o assentamento na linha de base.
- A entrada usa easing suave, com stagger pequeno e progressivo da esquerda para a direita.
- A queda ocupa somente o início da timeline. Quando termina, todos os caracteres permanecem alinhados e a frase continua a travessia como uma unidade.
- A travessia horizontal começa junto da cascata, mas é longa e linear, controlada pelo scroll.

### 3. Saída da frase e entrada dos contatos

- O bloco de contato não aparece de forma seca.
- A entrada começa somente quando a frase já saiu visualmente da área útil.
- O texto de apoio entra com opacidade, deslocamento vertical curto e máscara vertical que se abre de baixo para cima.
- Os quatro botões entram depois do texto, com opacidade, subida curta e stagger sutil da esquerda para a direita.
- A liberação de `inert` e `aria-hidden` usa um marco nomeado e reversível da timeline, `actionsReady`, colocado somente depois que a entrada do último botão atingir opacidade perceptível. O `onUpdate` compara `timeline.time()` com `timeline.labels.actionsReady`, evitando um número de progresso arbitrário. Antes desse marco, os atributos permanecem aplicados; ao cruzá-lo em sentido reverso, são reaplicados.
- Se o foco estiver dentro do bloco de contatos ao cruzar `actionsReady` em sentido reverso, o ancestral não é ocultado imediatamente. Em `focusout`, o código verifica `event.relatedTarget`: se o novo foco continuar dentro de `.footer-contact__reveal`, nada muda. Se estiver fora, o estado é sincronizado no próximo `requestAnimationFrame`. O código nunca aplica `aria-hidden` a um ancestral do elemento focado.

## Timeline GSAP

A timeline continua sendo a fonte única do movimento da seção.

Ordem relativa recomendada:

1. painel: início `0`, duração curta;
2. cascata de caracteres: início próximo de `0.04`, término antes de `0.24`;
3. travessia horizontal: início próximo de `0.08`, término próximo de `0.72`;
4. texto de apoio: início após `0.78`;
5. botões: início após o texto, próximo de `0.82`;
6. label `actionsReady`: depois que o quarto botão já iniciou e atingiu opacidade perceptível.

Os valores finais podem ser calibrados visualmente, mas a ordem não deve mudar. O deslocamento horizontal continua derivado de funções invalidadas em `ScrollTrigger.refresh()`.

## Responsividade

- Desktop, tablet e mobile mantêm a mesma narrativa.
- A porção inicial visível deriva da largura medida da frase, não de um valor fixo de viewport.
- O deslocamento vertical dos caracteres, o stagger e a distância total de scroll são menores no mobile.
- Os botões mantêm o arranjo 4/2/1 existente e altura mínima de 52 px no mobile.
- Nenhum texto mobile fica abaixo de 14 px; os tokens atuais preservam 16 px para labels e textos utilitários.

## Movimento reduzido e fallback

- Com `prefers-reduced-motion: reduce`, a mesma narrativa permanece reconhecível, mas a queda usa menor distância, `stagger: 0` e `ease: "none"`. Travessia, texto e botões também usam `ease: "none"`, sem inércia.
- A travessia horizontal continua ligada ao scroll porque ela é a interação principal aprovada pelo usuário.
- Sem GSAP, ScrollTrigger ou JavaScript, o footer volta ao estado estático: frase completa, texto e contatos visíveis e utilizáveis.
- O link “Pular animação e acessar contatos” continua levando ao fim da timeline e focando o primeiro canal de contato.

## Reconstrução e teardown

- A divisão em caracteres acontece uma única vez e é identificada por um atributo de estado no título; rebuilds de `gsap.matchMedia()`, resize, `pageshow` e `ScrollTrigger.refresh()` reutilizam os spans existentes.
- A função de cleanup mata a timeline e tweens associados antes de limpar estilos inline.
- O teardown remove `transform`, `opacity`, `visibility` e `will-change` de painel, track, caracteres, texto e botões.
- O fallback remove o estado aprimorado, restaura a frase completa, deixa texto e contatos visíveis e devolve interatividade.
- Uma falha parcial durante a criação da timeline chama o mesmo cleanup, evitando spans duplicados ou controles permanentemente inertes.

## Acessibilidade

- O título mantém um único nome acessível: “Vamos conversar?”.
- Spans de caracteres são ignorados por leitores de tela.
- Controles ocultos permanecem `inert` e `aria-hidden` até a revelação.
- Foco visível, ordem de tabulação e links atuais são preservados.
- O hash `#contato-acoes` continua concluindo a timeline e tornando os botões interativos.

## Validação

### Funcional

- A seção inicia com 25%–35% da largura real da frase dentro da viewport e perceptível antes de deslocamento horizontal relevante.
- Todos os caracteres caem em sequência curta e se estabilizam na linha de base.
- A frase atravessa a tela sem saltos durante resize ou refresh.
- O texto de apoio e os botões entram somente após a saída da frase.
- Os contatos nunca ficam focáveis enquanto visualmente ocultos.

### Visual

Validar início, meio e fim em:

- desktop largo;
- tablet;
- mobile vertical em 390 × 844 e 320 × 568;
- mobile horizontal em 844 × 390;
- movimento reduzido.

Checar também corte reto, ausência de overflow documental, acentos sem recorte e consistência dos espaçamentos na grade de 4 pontos.

### Técnica

- `node --check js/footer.js`;
- ausência de erros e avisos novos no console;
- `ScrollTrigger.refresh()` mantém posição e medidas corretas;
- acesso direto e recarga em `#contato` e `#contato-acoes` permanecem funcionais;
- fallback validado com as bibliotecas GSAP indisponíveis.
