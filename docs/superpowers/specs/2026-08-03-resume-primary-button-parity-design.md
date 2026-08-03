# Paridade total entre currículo e botão principal

## Objetivo

Fazer `Ver currículo` usar exatamente o mesmo componente principal de `Enviar um e-mail`: cor, borda, raio, altura, padding, gap, tipografia, seta, hover e foco.

Esta decisão substitui a escolha anterior de tratar o currículo como ação secundária contornada e de compactá-lo no trilho desktop.

## Componente compartilhado

`base.css` continuará fornecendo `.action-pill` e passará a fornecer também `.action-pill--primary`.

### Base `.action-pill`

- altura mínima de 64 px;
- padding de 16 px × 20 px;
- gap de 16 px;
- borda de 1 px e raio de 999 px;
- conteúdo centralizado e distribuído com `space-between`;
- tipografia em caixa alta;
- seta sem encolhimento;
- hover vermelho com texto branco e deslocamento de −4 px;
- foco vermelho de 2 px com offset de 4 px.

### Variante `.action-pill--primary`

- texto em `var(--color-surface)`;
- fundo em `var(--color-text)`;
- borda em `var(--color-text)`.

`Enviar um e-mail` e as duas instâncias responsivas de `Ver currículo` receberão a mesma combinação `.action-pill.action-pill--primary`. A classe `.footer-contact__button--primary` pode permanecer no HTML como identificação contextual, mas não será mais a fonte do visual principal.

## Encaixe na Experiência

### Desktop acima de 960 px

- O currículo permanece abaixo de `Soften`.
- `.experience__resume-link--rail` controla apenas `width: 100%`; não altera altura, padding ou gap.
- O wrapper `.experience__resume-rail` se expande 20 px para cada lado dentro do trilho, por meio de margens laterais negativas, para acomodar o componente completo sem truncar o texto em 961 px.
- A expansão permanece dentro da área visual da sidebar e não altera sua largura, a posição do divisor ou a área dos cards.
- O contador continua com pelo menos 48 px de distância vertical do botão em viewport de 961 × 560 px.

### Tablet e mobile até 960 px

- O currículo continua no bloco após os cards e ocupa 100% da largura útil.
- Entre 521 e 960 px, currículo e contatos usam 64 px, padding 16 × 20 px, gap 16 px e tipografia 16/20 px.
- Até 520 px, ambos usam 52 px, padding 12 × 16 px, gap 16 px e tipografia 16/20 px.

## Comportamento e acessibilidade

- Currículo e e-mail compartilham exatamente o mesmo hover e foco.
- O currículo continua abrindo o PDF em nova aba com `target="_blank"` e `rel="noopener noreferrer"`.
- O rótulo acessível continua informando que o documento abre em nova aba.
- Nenhum JavaScript é adicionado ou alterado.
- Os seletores `.footer-contact__button`, `will-change` e a timeline do rodapé permanecem intactos.

## Arquivos

- `css/base.css`: adiciona `.action-pill--primary`.
- `css/experience.css`: remove a compactação do botão lateral e expande somente seu wrapper.
- `css/footer.css`: remove a definição visual duplicada da variante principal contextual.
- `index.html`: aplica `.action-pill--primary` ao currículo e ao e-mail e incrementa cache para `base.css?v=7`, `experience.css?v=11` e `footer.css?v=10`.

## Validação

1. Comparar as propriedades computadas de currículo e e-mail nos breakpoints aplicáveis.
2. Confirmar igualdade de cor, borda, raio, altura, padding, gap, fonte, line-height, hover e foco.
3. Testar 320 × 800, 390 × 844, 720 × 900, 960 × 900, 961 × 560, 1024 × 600, 1280 × 720 e 1294 × 912.
4. Confirmar ausência de truncamento, overflow horizontal e colisão com o contador em 961 × 560.
5. Confirmar uma única instância visível do currículo por breakpoint.
6. Verificar abertura do PDF, ausência de erros no console e preservação da animação do rodapé.
7. Validar as novas versões de cache no endereço público.

## Fora de escopo

- Alterar texto, destino ou posição do currículo.
- Alterar a grade do rodapé ou a largura da sidebar.
- Alterar animações da seção de contato.
