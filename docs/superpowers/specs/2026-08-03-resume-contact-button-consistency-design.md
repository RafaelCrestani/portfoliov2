# Consistência visual do botão de currículo

## Objetivo

Fazer o botão `Ver currículo` da seção Experiência pertencer ao mesmo sistema visual dos botões secundários de contato, sem alterar sua posição, destino ou hierarquia de ação.

## Decisão de design

O currículo usará a variante secundária contornada dos botões de contato, equivalente a LinkedIn, Behance e WhatsApp. A variante principal preta continuará exclusiva de `Enviar um e-mail`.

O padrão será compartilhado de verdade no CSS, em vez de duplicar valores ou fazer a seção Experiência depender de uma classe específica do rodapé.

## Componente compartilhado

Será criada uma base visual neutra reutilizável pelos links de contato e currículo. Ela define:

- layout em cápsula com conteúdo distribuído entre rótulo e seta;
- borda cinza e fundo transparente no estado padrão;
- tipografia, caixa alta e espaçamento consistentes;
- transições de cor, fundo, borda e deslocamento;
- hover vermelho, com texto claro e elevação sutil;
- foco visível vermelho, independente do hover;
- seta externa alinhada à direita e sem encolhimento.

A classe existente de cada contexto continuará responsável somente pelo encaixe local. Assim, o rodapé preserva sua grade de quatro botões e a Experiência preserva as versões lateral e mobile.

## Responsividade

### Desktop

- O botão permanece abaixo de `Soften`, dentro do trilho fixo da Experiência.
- Ocupa 100% da largura disponível do trilho.
- Usa a mesma linguagem de cápsula dos contatos, com altura mínima compactada para caber no trilho sem colidir com o contador.
- Rótulo e seta não quebram linha.

### Mobile e tablet

- O botão permanece no bloco próprio após a trajetória profissional.
- Ocupa 100% da largura útil.
- Usa altura e tipografia equivalentes aos botões de contato no mesmo breakpoint, respeitando área de toque mínima e a regra já adotada de texto não inferior a 14 px.

## Comportamento

- O link continua abrindo `assets/documents/cv-rafael-nassif-crestani-2026.pdf` em nova aba.
- `target="_blank"`, `rel="noopener noreferrer"` e o rótulo acessível serão preservados.
- Usuários com dispositivos sem hover não receberão estados presos ou animações dependentes do ponteiro.
- A mudança não adiciona JavaScript.

## Arquitetura e arquivos

- `css/base.css`: recebe a base neutra do botão compartilhado.
- `css/footer.css`: passa a manter apenas regras específicas de composição e variante principal do rodapé.
- `css/experience.css`: mantém somente dimensões e encaixes específicos do currículo no trilho e no mobile.
- `index.html`: recebe a classe compartilhada nos botões de contato e nas duas instâncias responsivas do currículo.

O arquivo compartilhado já é carregado antes dos estilos de seção, permitindo que cada contexto sobrescreva somente dimensões locais quando necessário.

## Validação

1. Confirmar equivalência visual entre currículo e contatos secundários em desktop.
2. Confirmar equivalência visual no mobile, incluindo altura, padding, tipografia e seta.
3. Testar hover, foco por teclado e abertura do PDF em nova aba.
4. Verificar que apenas uma instância do currículo fica visível por breakpoint.
5. Testar larguras de 320, 390, 960, 961, 1024 e 1280 px, incluindo viewport desktop de baixa altura.
6. Confirmar ausência de overflow, quebra do rótulo e colisão com o contador lateral.
7. Verificar que o rodapé e suas animações continuam inalterados.

## Fora de escopo

- Alterar o conteúdo, o arquivo ou o comportamento de abertura do currículo.
- Mudar a hierarquia do botão principal de e-mail.
- Reorganizar o trilho da Experiência ou a grade dos contatos.
- Modificar animações do rodapé.
