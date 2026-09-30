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

- **Fase 1:** `docs/FASE-1.md` — assunções, paleta provisória, contrastes, sitemap e modelo de dados.
- **Fase 2:** `index.html`, `css/styles.css`, `js/app.js`, `js/utils.js` — site e páginas de loja, pesquisa, filtros e Leaflet.
- **Fase 3:** `js/viewer.js`, `data/folheto-exemplo.pdf`, `docs/FASE-3-ADMIN.md` — folheto integrado, plano do painel e checklist.

## Editar

| Ficheiro | Conteúdo |
|---|---|
| `data/config.json` | Marca, paleta, textos, redes, contactos, catálogo de serviços, SEO |
| `data/lojas.json` | Oito lojas, horários, exceções, coordenadas e fotografias |
| `data/folheto.json` | Caminho, validade e título do PDF |
| `assets/` | Logo futuro e fotografias |

Todos os conteúdos editoriais vêm dos JSON. O HTML contém apenas estrutura, metadados de arranque e mensagem de falta de JavaScript; o JS tem uma mensagem de emergência se os próprios dados não puderem ser lidos. Ícones e elementos de interface são código.

Páginas: `/`, `/?pagina=lojas`, `/?loja=lousada` e os restantes slugs. Atualize os JSON e recarregue a página. Não há painel implementado, publicação externa ou base de dados.

## Assunções

Os anexos não foram recebidos nesta sessão. Identidade visual, símbolo M e fotografia são provisórios. Dados desconhecidos permanecem explícitos. O mapa tem vista geral da região, não oito localizações inventadas. Mostrará automaticamente cada ponto que receber coordenadas. Os serviços do catálogo são exemplos por confirmar, nunca serviços atribuídos às lojas. O PDF de demonstração não contém ofertas.

## Verificar

```sh
node tests/validate.mjs
```

Testa JSON, oito slugs, horários desconhecidos, intervalos, fecho, turnos noturnos, exceções, validade e contrastes. Ver `docs/VALIDACAO.md` para verificações do navegador e limitações.

## Fotografia

Imagem ilustrativa proveniente de [Brooklyn’s Best Ethnic Food Markets](https://www.mkrealtyny.com/blog/brooklyns-best-ethnic-food-markets/), ficheiro identificado pela origem como Pexels / Daria Shevtsova, n.º 1508666. A licença na página original do fotógrafo não foi confirmada; substituir por imagem própria ou verificar a licença antes de publicar. Guardada localmente para permitir testar o protótipo.
