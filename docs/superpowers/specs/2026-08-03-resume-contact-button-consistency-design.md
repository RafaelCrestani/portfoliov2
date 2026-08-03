# Consistência visual do botão de currículo

## Objetivo

Fazer o botão `Ver currículo` da seção Experiência pertencer ao mesmo sistema visual dos botões secundários de contato, sem alterar sua posição, destino ou hierarquia de ação.

## Decisão de design

O currículo usará a variante secundária contornada dos botões de contato, equivalente a LinkedIn, Behance e WhatsApp. A variante principal preta continuará exclusiva de `Enviar um e-mail`.

O padrão será compartilhado de verdade no CSS, em vez de duplicar valores ou fazer a seção Experiência depender de uma classe específica do rodapé.

## Componente compartilhado

Será criada em `base.css` a classe neutra `.action-pill`, reutilizada pelos links de contato e currículo. Seu contrato é:

- `box-sizing: border-box`, `display: inline-flex` e `min-width: 0`;
- alinhamento vertical central, distribuição horizontal com `space-between` e `gap: 16px`;
- altura mínima de 64 px e padding de 16 px × 20 px como dimensões padrão;
- texto em `var(--font-sans)`, `var(--type-meta-size)` / `var(--type-meta-lh)` e caixa alta;
- cor `var(--color-text)`, fundo `rgba(248, 247, 245, 0.9)`, borda de 1 px em `var(--gray-500)` e raio de 999 px;
- transições de 200 ms para cor, fundo, borda e transformação;
- rótulo com `min-width: 0`, elipse quando necessário e sem quebra;
- seta com `flex: 0 0 auto` e `font: inherit`;
- em dispositivos com hover, fundo `var(--color-accent)`, texto `var(--color-surface)`, borda `var(--gray-600)` e `translateY(-4px)`;
- no foco visível, outline de 2 px em `var(--color-accent)` com offset de 4 px;
- até 960 px, tipografia explícita de 16 px / 20 px para não depender dos tokens desktop e preservar o mínimo mobile;
- até 520 px, altura mínima de 52 px e padding de 12 px × 16 px, exatamente como os contatos atuais.

As classes existentes continuam no HTML para preservar seus contratos funcionais. `.footer-contact__button` continuará sendo o seletor consultado e animado por `footer.js`; as regras de `will-change` e da timeline permanecem intactas. `.experience__resume-link` continuará controlando largura e encaixe nas versões 960/961. Nenhum seletor JavaScript será renomeado ou removido.

## Responsividade

### Desktop

- O botão permanece abaixo de `Soften`, dentro do trilho fixo da Experiência.
- Ocupa 100% da largura disponível do trilho.
- Usa a mesma linguagem visual dos contatos, com exceções dimensionais explícitas para caber no trilho: altura mínima de 48 px, padding de 12 px × 8 px e gap de 4 px.
- Rótulo e seta não quebram linha.

### Mobile e tablet

- O botão permanece no bloco próprio após a trajetória profissional.
- Ocupa 100% da largura útil.
- Entre 521 e 960 px, usa exatamente a base de 64 px, padding de 16 px × 20 px e tipografia de 16/20 px, igual aos contatos.
- Até 520 px, usa exatamente 52 px, padding de 12 px × 16 px e tipografia responsiva de 16/20 px, igual aos contatos.
- Respeita área de toque mínima e a regra já adotada de texto não inferior a 14 px.

## Comportamento

- O link continua abrindo `assets/documents/cv-rafael-nassif-crestani-2026.pdf` em nova aba.
- `target="_blank"`, `rel="noopener noreferrer"` e o rótulo acessível serão preservados.
- Usuários com dispositivos sem hover não receberão estados presos ou animações dependentes do ponteiro.
- A mudança não adiciona JavaScript.
- A variante principal de `Enviar um e-mail` permanece preta no estado padrão e conserva o hover vermelho já existente.

## Arquitetura e arquivos

- `css/base.css`: recebe a base neutra do botão compartilhado.
- `css/footer.css`: mantém grade, variante principal, animação e composição do rodapé; deixa de duplicar apenas as propriedades absorvidas por `.action-pill`.
- `css/experience.css`: mantém visibilidade, largura e as exceções dimensionais do currículo no trilho; deixa de duplicar apenas as propriedades absorvidas por `.action-pill`.
- `index.html`: recebe a classe compartilhada nos botões de contato e nas duas instâncias responsivas do currículo.

O arquivo compartilhado já é carregado antes dos estilos de seção, permitindo que cada contexto sobrescreva somente dimensões locais quando necessário.

Como o site não usa hashing de build, os parâmetros de cache em `index.html` serão incrementados para todos os estilos alterados: `base.css?v=6`, `experience.css?v=10` e `footer.css?v=9`. O HTML não possui um parâmetro próprio de versão.

## Validação

1. Confirmar equivalência visual entre currículo e contatos secundários em desktop.
2. Confirmar equivalência exata no mobile, incluindo altura, padding, tipografia e seta, nos intervalos 521–960 px e até 520 px.
3. Testar hover, foco por teclado e abertura do PDF em nova aba.
4. Verificar que apenas uma instância do currículo fica visível por breakpoint.
5. Testar larguras de 320, 390, 960, 961, 1024 e 1280 px, incluindo viewport desktop de baixa altura.
6. Confirmar ausência de overflow, quebra do rótulo e colisão com o contador lateral.
7. Verificar que o rodapé e suas animações continuam inalterados.
8. Confirmar que `footer.js` ainda encontra `.footer-contact__button`, que os elementos animados preservam `will-change` e que a variante principal continua preta com hover vermelho.
9. Confirmar no HTML publicado que as versões de cache dos três CSS foram incrementadas.

## Fora de escopo

- Alterar o conteúdo, o arquivo ou o comportamento de abertura do currículo.
- Mudar a hierarquia do botão principal de e-mail.
- Reorganizar o trilho da Experiência ou a grade dos contatos.
- Modificar animações do rodapé.
