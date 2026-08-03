# Plano de implementação — botão de currículo

## 1. Publicar o PDF

- Criar `assets/documents/`.
- Copiar o currículo fornecido para `assets/documents/cv-rafael-nassif-crestani-2026.pdf`.
- Confirmar assinatura `%PDF-` e versionamento.

## 2. Inserir as ações

**Arquivo:** `index.html`

- Adicionar o CTA desktop após o índice da Experiência.
- Adicionar o CTA mobile após `.experience__story`.
- Usar caminho relativo, nova aba, proteção de contexto e nome acessível.
- Incrementar a versão de `experience.css`.

## 3. Estilizar

**Arquivo:** `css/experience.css`

- Criar o botão editorial compartilhado, wrapper do rail e faixa mobile.
- Adicionar hover, foco, regras 960/961 e compactação de desktop baixo.

## 4. Validar

- Testar 320, 390, 720, 960, 961, 1024 e 1280 px.
- Testar 961×560, 1024×600 e 1280×720.
- Confirmar uma única instância visível, ausência de quebra/overflow e distância do contador.
- Abrir o PDF no localhost e validar a URL publicada, status e MIME no GitHub Pages.
