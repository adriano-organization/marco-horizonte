# Marco Horizonte — protótipo PT-PT

HTML + CSS + JavaScript ES modules, sem instalação e sem build.

## Correr localmente em 3 passos

1. Abra o terminal na pasta do projeto:
   ```sh
   cd /Users/adrianocouto/Faculdade/sites/marco-horizonte
   ```
2. Inicie um servidor estático:
   ```sh
   python3 -m http.server 8000
   ```
3. Abra **http://localhost:8000** no navegador. Não abra `index.html` por `file://`: o fetch dos JSON precisa do servidor. Internet necessária para fontes, mapas e bibliotecas do PDF.

## Entrega em três fases

- **Fase 1:** `docs/FASE-1.md` — assunções, paleta da marca, contrastes, sitemap e modelo de dados.
- **Fase 2:** `index.html`, `css/styles.css`, `js/app.js`, `js/utils.js` — site e páginas de loja, pesquisa, filtros e Leaflet.
- **Fase 3:** `js/viewer.js`, `data/folheto-exemplo.pdf`, `docs/FASE-3-ADMIN.md` — folheto integrado, plano do painel e checklist.

## Editar

| Ficheiro | Conteúdo |
|---|---|
| `data/config.json` | Marca, paleta, textos, redes, contactos, catálogo de serviços, SEO |
| `data/lojas.json` | Nove lojas, horários, exceções, coordenadas e fotografias |
| `data/folheto.json` | Caminho, validade e título do PDF |
| `assets/` | Logo fornecido e fotografias da marca |

Todos os conteúdos editoriais vêm dos JSON. O HTML contém apenas estrutura, metadados de arranque e mensagem de falta de JavaScript; o JS tem uma mensagem de emergência se os próprios dados não puderem ser lidos. Ícones e elementos de interface são código.

Páginas: `/`, `/?pagina=lojas`, `/?loja=lousada` e os restantes slugs. Atualize os JSON e recarregue a página. Não há painel implementado, publicação externa ou base de dados.

## Assunções

O logo e as fotografias fornecidos estão integrados. A paleta foi extraída do logo raster: azul #1C3A7A e laranja #D3672E. Os serviços continuam por confirmar, com configuração individual em cada loja. Os dados públicos consultados estão em `fontes` de cada registo; divergências estão em `notaDados`. Existem horários para oito lojas, sete telefones e oito moradas. As nove lojas têm coordenadas extraídas dos links Google Maps fornecidos em 01/10/2026, pins na homepage/listagem e mini-mapas individuais. Vila Boa de Quires tem horário por confirmar. O PDF continua a ser uma demonstração sem ofertas reais.

## Verificar

```sh
node tests/validate.mjs
```

Testa JSON, nove slugs, fontes, horários desconhecidos, intervalos, fecho, turnos noturnos, exceções, validade e contrastes. Ver `docs/VALIDACAO.md` para verificações do navegador e limitações.

## Fotografias e pré-visualizações

Fotografias fornecidas pela marca, com filtros CSS de saturação, contraste e brilho. Não foram atribuídas a lojas específicas sem confirmação. A antiga imagem ilustrativa permanece no arquivo, mas já não é usada no site.

Ver `docs/preview-desktop.png` e `docs/preview-mobile.png`. A assinatura do rodapé liga à DevPlus e usa o símbolo D+ do seu site. Não existe ligação ao Instagram no rodapé.

## Revisão de 01/10/2026

- `js/gallery.js`: galeria com três fotografias, setas, teclado, swipe, temporizador de seis segundos e pausa. Pausa ao passar o rato, ao focar controlos, fora do ecrã e num separador oculto. Reprodução automática desativada com movimento reduzido.
- `data/config.json` → `galeriaHorizonte`: fotografias, textos e intervalo editáveis. As margens das capturas são recortadas apenas na apresentação CSS; os originais são preservados.
- Entradas escalonadas, interações nos botões e folheto, transições entre páginas compatíveis e progresso de leitura. Respeita `prefers-reduced-motion`.
- `mapsUrl` e `coordenadasFonte` em cada loja registam a origem. Rio Mau tem coordenadas, mas falta morada postal. A morada escrita de Vila Boa de Quires menciona Vila do Conde; as direções usam as coordenadas do pin fornecido.

## Painel local — /painel

Abra `http://localhost:8000/painel`. Selecione um PDF (até 30 MB / 40 páginas, sem palavra-passe), defina título e validade, pré-visualize e guarde. O ficheiro é persistido em IndexedDB **apenas neste navegador e origem**. localhost e 127.0.0.1 são origens distintas. Não altera ficheiros do servidor nem publica alterações para outras pessoas. «Repor folheto de exemplo» remove a substituição local.

O exemplo fornecido está em `data/folheto-fornecido.pdf`: duas páginas horizontais, apresentadas inteiras, uma de cada vez. O PDF é conservado sem edição; as datas e os preços impressos são de arquivo. O exemplo não é anunciado como promoção atual.

Para produção: substituir `js/flyer-store.js` por uma API autenticada e armazenamento de objetos. Validar o PDF também no servidor, aplicar autorização às operações de escrita, guardar histórico e datas; implementar login antes de disponibilizar edição pública. O protótipo não constitui um painel seguro de produção.

A listagem mostra 3 × 3 lojas no computador e uma coluna no telemóvel, com mapa abaixo. Waze removido. A abertura animada usa o logo, dura cerca de 2 segundos na primeira visita da sessão e é curta nas páginas seguintes; desativada com movimento reduzido.

## Loja mais próxima

Na página de lojas, pesquise uma localidade, morada ou código postal em Portugal e selecione o resultado. As lojas ficam ordenadas pela distância geográfica (Haversine); a primeira é destacada. Os filtros por nome/serviço continuam aplicados: o destaque é a mais próxima entre os resultados. As direções Google Maps incluem origem e destino; não se estima distância de condução.

Geocodificação por Photon / OpenStreetMap, após submissão explícita, com cache em memória, intervalo mínimo entre pedidos e timeout. O texto pesquisado é enviado ao fornecedor, conforme indicado junto ao campo. Endpoint editável em `config.json` → `geocodificacao.endpoint`. Serviço público adequado ao protótipo com utilização moderada, sem garantia de disponibilidade; para produção com mais tráfego usar instância própria/fornecedor contratado: https://github.com/komoot/photon#demo-server.

Transição curta: 1 segundo de apresentação + 0,5 segundos de saída; total 1,5 segundos. Movimento reduzido continua respeitado.
