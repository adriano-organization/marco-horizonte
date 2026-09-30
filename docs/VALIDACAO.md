# Validação — 30/09/2026

## Executada

- Três ficheiros JSON válidos; oito lojas e slugs únicos.
- Sintaxe dos módulos JavaScript verificada com Node.
- Testes: estado desconhecido, dois intervalos, pausa, limite de fecho, turno noturno, exceção por data, validade inclusiva e expiração em Europe/Lisbon.
- Contrastes dos cinco pares principais superiores a 4,5:1.
- Navegador: homepage, oito cartões, mapa Leaflet carregado, detalhe Lousada, pesquisa `sobretamega` encontra Sobretâmega; filtro Padaria apresenta zero resultados porque não há serviços confirmados.
- PDF de quatro páginas: páginas 1–2 e 3–4 inspecionadas visualmente; avanço por teclado, limite da última página, fecho e zoom 125% verificados.
- Mobile 390 × 844: sem overflow horizontal na homepage; folheto apresenta uma página.
- Desktop 1440 × 1000: largura do documento igual à viewport.
- Sem mensagens de erro ou aviso nos registos de consola consultados durante estes percursos.

## Limites

- O teste inicial Playwright autónomo não arrancou porque o binário Chromium não estava instalado; a validação foi concluída no navegador integrado do Codex.
- Os cliques automatizados no visualizador tiveram comportamento irregular no navegador integrado; as ações foram confirmadas por teclado. Confirmar interação tátil e rato num navegador de destino antes de produção.
- Swipe físico e ecrã inteiro do sistema não foram validados em dispositivos reais. São implementados com StPageFlip e Fullscreen API, com fallback de erro para navegadores sem suporte.
- Sem dados reais, não foram validados percursos, marcadores reais, chamadas telefónicas ou serviços.
- PDFs reais, leitura assistida do PDF e todos os navegadores de destino ainda precisam de testes. Não é uma certificação WCAG.
- As referências externas foram consultadas pelo seu conteúdo disponível; não foi feita engenharia inversa das animações.
