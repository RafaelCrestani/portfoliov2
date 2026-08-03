# Plano de implementação — consistência do botão de currículo

## Objetivo

Compartilhar a linguagem visual de cápsula entre os botões secundários de contato e o link `Ver currículo`, mantendo dimensões contextuais no trilho desktop e equivalência exata no mobile.

## Etapa 1 — Base compartilhada

Arquivo: `css/base.css`

1. Criar `.action-pill` com layout, cores, borda, raio, tipografia, transições e dimensões padrão.
2. Criar regras compartilhadas para rótulo, seta, hover e foco.
3. Definir tipografia 16/20 px até 960 px.
4. Definir altura e padding compactos até 520 px.

## Etapa 2 — Aplicar o componente

Arquivo: `index.html`

1. Adicionar `.action-pill` às duas instâncias responsivas de `Ver currículo`.
2. Adicionar `.action-pill` aos quatro botões do rodapé.
3. Incrementar as versões de cache de `base.css`, `experience.css` e `footer.css`.

## Etapa 3 — Remover duplicação contextual

Arquivos: `css/experience.css`, `css/footer.css`

1. Remover da Experiência propriedades visuais agora cobertas pela base.
2. Manter no botão lateral apenas largura e dimensões compactas de 48 px, padding 12 × 8 px e gap 4 px.
3. Manter no mobile somente largura e composição do bloco; deixar dimensões virem da base compartilhada.
4. Remover do Footer propriedades cobertas pela base.
5. Preservar `.footer-contact__button`, `.footer-contact__button--primary`, seletores de animação, `will-change` e timeline.

## Etapa 4 — Verificação

1. Conferir HTML e CSS por busca de seletores e duplicações.
2. Testar no navegador em 320, 390, 720, 960, 961, 1024, 1280 e 1294 px.
3. Comparar dimensões computadas do currículo e dos contatos nos breakpoints mobile.
4. Testar hover, foco e abertura do PDF em nova aba.
5. Confirmar uma única instância visível do currículo por breakpoint.
6. Confirmar ausência de overflow e colisão com o contador.
7. Confirmar que não há erros no console e que a animação do rodapé continua funcionando.

## Etapa 5 — Publicação

1. Registrar as alterações em commit.
2. Enviar `main` ao repositório remoto.
3. Acompanhar o workflow do GitHub Pages.
4. Validar a página e o PDF no endereço público.
