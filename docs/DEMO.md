# Demo Marco Horizonte — 7 de outubro de 2026

## Abrir

Na pasta do projeto, execute `python3 -m http.server 8000 --bind 127.0.0.1`.

- Site: http://127.0.0.1:8000/
- Lojas: http://127.0.0.1:8000/?pagina=lojas
- Pesquisa de morada: http://127.0.0.1:8000/?pagina=encontrar
- Painel: http://127.0.0.1:8000/painel/

Use o mesmo navegador e endereço para o site e painel. `localhost` e `127.0.0.1` são origens diferentes.

## Roteiro sugerido (5 minutos)

1. Mostre a nova entrada, a galeria e o folheto digital. No folheto, avance uma página, aumente o zoom e volte aos 100%.
2. Abra «Conheça a sua loja». O catálogo tem sempre as nove lojas, sem pesquisa por nome, filtros por serviço ou campo de morada. Mostre uma ficha e o ponto da loja no mapa.
3. Abra «Encontre a sua loja». Este é o único lugar com pesquisa de morada. Escreva `Rua da Igreja`: as sugestões distinguem as localidades e freguesias; escolha uma para ver a loja mais próxima e outras duas opções.
4. Demonstre `Rua de Santa Catarina 312, Porto` e `4630-286`. A localidade escrita tem prioridade sobre a preferência automática pela região. Pode escolher pelo teclado ou por toque. Os links de direções incluem a morada selecionada como origem.
5. No painel, mostre o estado da rede e os grupos de informação preenchidos. Em «Lojas e moradas», use os separadores de localização, contactos e horários; pode copiar o horário de segunda-feira para os restantes dias úteis. Guarde uma alteração e atualize o site.
6. Em «Folheto digital», selecione um PDF, confira as páginas na pré-visualização e abra o documento completo. Defina título e validade e guarde. Em «Dados e definições», exporte as lojas e descarregue o PDF para levar os conteúdos consigo.

## Percursos

- `?pagina=lojas`: catálogo das nove lojas.
- `?pagina=encontrar`: pesquisa de morada e cálculo da proximidade.
- Página inicial: convite que abre a pesquisa, sem duplicar o campo de morada.
- Links antigos `?pagina=lojas&morada=...` encaminham para a pesquisa e conservam o texto.

## O que é real

As nove lojas e as coordenadas vêm dos dados existentes e dos pontos Google Maps fornecidos pela marca. A pesquisa é feita com sugestões e geocodificação do Esri ArcGIS World Geocoding Service; as distâncias são calculadas sobre as coordenadas, em linha reta. As direções abrem Google Maps com o destino e, quando disponível, a origem selecionada.

As favoritas, as alterações às lojas e os PDFs persistem no navegador. As moradas pesquisadas e respetivas coordenadas não são guardadas no armazenamento do navegador. As métricas do painel contam os dados efetivamente presentes; não são estatísticas de visitantes. Não existe autenticação, servidor de edição ou publicação remota nesta demo.

## Confirmações ainda necessárias

- Rio Mau: falta a morada postal; as direções funcionam com o ponto da loja.
- Vila Boa de Quires: a anterior morada indicava Vila do Conde e não concordava com o ponto fornecido. Foi retirada. É apresentada a localidade, com indicação de rua/código postal por confirmar.
- Lousada e Sobretâmega: códigos postais incompletos; Livração: morada pouco detalhada.
- Horários, contactos e serviços devem ser confirmados pela marca; o painel permite completá-los.
- O PDF de exemplo é de arquivo, sem validade comercial; não representa ofertas atuais.
- Mapas, pesquisa, fontes e biblioteca PDF precisam de Internet. O motor Esri não garante todas as ruas ou portas nem disponibilidade contínua. Resultados de rua, código postal ou morada interpolada são identificados como aproximados. A pesquisa usa Portugal, com preferência automática pela região e sem limites geográficos que ocultem outras localidades.

## Identidade e imagem

A campanha de 7 de outubro usa duas composições ilustrativas criadas com a ferramenta nativa ImageGen, coordenadas com o azul, a terracota e o creme da marca:

- `assets/frescos-campanha-v3.jpg`: saco de compras azul com fruta, legumes e pão; imagem principal da entrada.
- `assets/padaria-campanha-v3.jpg`: broa, pão e cerâmica azul; imagem de apoio do folheto e da área de contactos.

Ambas têm 1536 × 1024 px, com variantes JPEG de 640 e 1024 px para ecrãs menores. Os PNG originais são conservados. As imagens de campanha são identificadas como ilustrativas e não representam interiores, lojas específicas ou promoções reais. A galeria continua separada da campanha. Usa três tratamentos editoriais com IA a partir das fotografias de arquivo fornecidas pela marca: `interior-retocada-v3`, `fruta-retocada-v3` e `garrafeira-retocada-v3`. A legenda é «Tratamento ilustrativo a partir de fotografias fornecidas pela marca». Os espaços e grupos de produtos foram mantidos; os cartões comerciais antigos ficam deliberadamente ilegíveis e os detalhes finos podem ter sido reinterpretados. Estas imagens não documentam ofertas, inventário ou uma loja individual. Os originais fornecidos ficam intactos.

O logo mantém a identidade fornecida, com um derivado de 466 px (cerca de 71 KB) para reduzir a transferência. A imagem principal tem prioridade de carregamento; as imagens abaixo da entrada podem carregar à medida que se aproximam do ecrã.

Os prompts finais completos, a ferramenta usada e a decisão sobre as versões estão em [IMAGENS-CAMPANHA.md](IMAGENS-CAMPANHA.md) e [IMAGENS-RETOQUE.md](IMAGENS-RETOQUE.md). A primeira ronda de retoque foi rejeitada por alterar texto comercial e não está integrada no site. A campanha anterior `frescos-hero-v2` permanece no arquivo.

## Verificação

`node tests/validate.mjs` — dados, coordenadas e destinos, horários, exceções, datas, URLs e contrastes.

`node tests/nearest.mjs` — sugestões Esri, seleção por magicKey, prioridade da localidade, porta, código postal exato, precisão, deduplicação, coordenadas e distâncias.

`node tests/content-store.mjs` — persistência, identidade das lojas, reposição, dados inválidos e quota.

As verificações de navegador e os limites detalhados estão em `VALIDACAO.md`. As capturas visuais finais desta revisão são `painel-renovado-desktop.jpg`, `painel-renovado-mobile.jpg`, `imagens-renovadas-mobile.jpg` e `contactos-renovados-mobile.jpg`. As capturas anteriores permanecem no arquivo desta pasta.

## Referências do motor de pesquisa

A demo usa o endpoint público do geocoder World com `forStorage=false`, apenas para pesquisa temporária. A documentação da Esri descreve [pesquisa simples anónima](https://developers.arcgis.com/python/latest/guide/tutorials/search-for-an-address/), [sugestões](https://developers.arcgis.com/rest/geocode/suggest/) e [resolução da morada](https://developers.arcgis.com/rest/geocode/find-address-candidates/). Para uma publicação comercial, confirmar a modalidade de acesso e os limites aplicáveis à conta de produção.
