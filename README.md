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

O logo e as fotografias fornecidos estão integrados. A paleta foi extraída do logo raster: azul #1C3A7A e laranja #D3672E. Os serviços continuam por confirmar, com configuração individual em cada loja. Os dados públicos consultados estão em `fontes` de cada registo; divergências estão em `notaDados`. Existem horários para oito lojas, sete telefones e oito moradas. Apenas Boelhe tem coordenadas GPS verificadas; as restantes lojas têm pesquisa Google Maps, sem pontos inventados. Vila Boa de Quires tem horário por confirmar. O PDF continua a ser uma demonstração sem ofertas reais.

## Verificar

```sh
node tests/validate.mjs
```

Testa JSON, nove slugs, fontes, horários desconhecidos, intervalos, fecho, turnos noturnos, exceções, validade e contrastes. Ver `docs/VALIDACAO.md` para verificações do navegador e limitações.

## Fotografias e pré-visualizações

Fotografias fornecidas pela marca, com filtros CSS de saturação, contraste e brilho. Não foram atribuídas a lojas específicas sem confirmação. A antiga imagem ilustrativa permanece no arquivo, mas já não é usada no site.

Ver `docs/preview-desktop.png` e `docs/preview-mobile.png`. A assinatura do rodapé liga à DevPlus e usa o símbolo D+ do seu site. Não existe ligação ao Instagram no rodapé.
