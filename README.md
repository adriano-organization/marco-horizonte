# Marco Horizonte — demo

Site estático com página inicial, catálogo das nove lojas, pesquisa de morada, mapas, folheto digital e painel local.

## Abrir

Na pasta do projeto: `python3 -m http.server 8000 --bind 127.0.0.1`.

- Página inicial: http://127.0.0.1:8000/
- Conheça a sua loja: http://127.0.0.1:8000/?pagina=lojas
- Encontre o seu Marco Horizonte: http://127.0.0.1:8000/?pagina=encontrar
- Painel: http://127.0.0.1:8000/painel/

## Pesquisa simplificada — 7 de outubro de 2026

A pesquisa de morada existe apenas em «Encontre o seu Marco Horizonte»: um campo, um botão de pesquisa e localização do dispositivo como alternativa discreta. Usa sugestões Esri, sem selecionar uma zona. A localidade escrita tem prioridade sobre a preferência automática pela região. Selecionar uma morada mostra as três lojas mais próximas, distâncias em linha reta e direções com origem e destino.

«Conheça a sua loja» mostra sempre as nove lojas, em grelha, com fichas, direções, favoritas e mapa. Foram removidas as pesquisas de nome/localidade da loja e os filtros de serviço. A página inicial apenas encaminha para a pesquisa. Links antigos com morada conservam o texto no novo percurso.

## Imagem renovada — 7 de outubro de 2026

Duas imagens ilustrativas de campanha, de frescos e pão, ligam a entrada, o folheto e os contactos à identidade azul, terracota e creme. A galeria usa três tratamentos editoriais a partir das fotografias fornecidas, com indicação explícita do carácter ilustrativo e originais conservados. As imagens têm variantes para ecrãs menores; as três variantes de 1024 px da galeria somam cerca de 747 KB, face aos 3 MB dos PNG de origem.

Prompts, ferramenta nativa e decisões de imagem: [docs/IMAGENS-CAMPANHA.md](docs/IMAGENS-CAMPANHA.md) e [docs/IMAGENS-RETOQUE.md](docs/IMAGENS-RETOQUE.md).

## Painel

A visão geral mostra o estado real da rede e a informação por completar. A edição de lojas usa separadores de localização, contactos/serviços e horários, conserva rascunhos e permite copiar horários entre dias úteis. Os campos inválidos são apresentados antes de guardar.

O folheto admite PDF até 30 MB/40 páginas, pré-visualização legível na proporção original, navegação por página, título e validade, com estados claros de preparação e gravação. Permite exportar dados, descarregar o PDF e repor os originais.

As alterações às lojas ficam em localStorage e os PDFs em IndexedDB, apenas no mesmo navegador e origem. `localhost` e `127.0.0.1` são origens diferentes. As pesquisas de morada ficam apenas na página. A demo não tem autenticação nem servidor de publicação.

## Conteúdo e apresentação

- `data/lojas.json`: nove lojas e dados de origem.
- `data/config.json`: marca, textos, serviços, mapa e motor de moradas.
- `data/folheto.json`: título, validade e PDF de exemplo.
- `css/styles.css`, `js/app.js`: apresentação e percursos do site.
- `js/nearest.js`: sugestões, resolução de moradas e proximidade.
- `js/content-store.js`, `js/panel.js`, `css/panel.css`: gestão local.

## Verificar

```
node tests/validate.mjs
node tests/nearest.mjs
node tests/content-store.mjs
```

O roteiro, as referências do motor e os dados ainda por confirmar estão em [docs/DEMO.md](docs/DEMO.md). Resultados da verificação em [docs/VALIDACAO.md](docs/VALIDACAO.md). O registo anterior foi conservado em [docs/HISTORICO-20261006.md](docs/HISTORICO-20261006.md).
