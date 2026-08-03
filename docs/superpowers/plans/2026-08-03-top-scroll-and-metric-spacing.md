# Plano de implementação — scroll ao topo e métrica

## Arquivos

- `js/editorial-scroll.js`
- `index.html`
- `css/about.css`

## Etapas

1. Adicionar resolução segura de `data-scroll-duration` por clique, mantendo `800 ms` como padrão.
2. Passar a duração local para `scrollToTarget` sem alterar o estado global.
3. Configurar `1200 ms` no link `VOLTAR AO TOPO ↑` e remover sua exceção de salto instantâneo.
4. Aplicar 32 px de margem acima da legenda da métrica e 24 px até 520 px.
5. Atualizar as versões de cache do script e do CSS.
6. Medir a duração do retorno ao topo, confirmar 800 ms nos demais links e validar os espaçamentos computados em desktop e mobile.
7. Publicar e verificar o comportamento no GitHub Pages.
