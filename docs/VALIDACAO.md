# Revisão atual — 7 de outubro de 2026

## Pesquisa Esri e percursos simplificados

- Homepage: zero campos de morada; convite liga a `?pagina=encontrar`; «Conheça a sua loja» liga ao catálogo.
- Catálogo `?pagina=lojas`: nove cartões, zero campos de morada/nome e zero seletores de zona/serviço. A ligação «Ver Lousada no mapa» aproxima, abre o popup correto e leva o mapa ao ecrã.
- Pesquisa `?pagina=encontrar`: um campo de morada, uma ação principal e GPS como alternativa discreta. Não há seletor de zona, botões de exemplo, expansão de país ou filtros de loja.
- Esri World Geosearch: `Rua da Igreja` devolveu 12 sugestões reais, incluindo diferentes freguesias de Marco de Canaveses e Penafiel; seleção da primeira resolveu as coordenadas e calculou as três lojas mais próximas.
- `Rua de Santa Catarina 312, Porto`: uma sugestão após filtrar a localidade explícita; seleção com setas/Enter confirmou porta 312, código 4000-443 e Rio Mau como loja mais próxima (22,9 km em linha reta).
- Botão Pesquisar com `4630-286`: código exato, Mercearia da Cidade como primeira loja (0,1 km), com origem/destino no link de direções.
- `Rua da Igreja, Lisboa`: duas ruas em Lisboa, sem limitação à região do Porto.
- Pesquisa inexistente: mensagem sem resultados e sem loja próxima inventada. Apagar a morada remove os resultados anteriores.
- Link antigo `?pagina=lojas&morada=4630-286`: redirecionamento confirmado para encontrar, preservando o texto.
- Telemóvel 390 × 844: pesquisa com 12 sugestões, seleção por toque, mapa expandido/fechado com Escape e menu do catálogo confirmados. Pesquisa e catálogo sem transbordo horizontal; catálogo mantém nove cartões numa coluna.
- Os resultados do motor são temporários na página; não são guardados em localStorage/IndexedDB. Moradas interpoladas, ruas e códigos postais são assinalados como aproximados.

`node tests/nearest.mjs` foi reescrito para o contrato Esri (sugestões/magicKey, localidade explícita, portas, códigos postais, precisão, país e coordenadas). Os três conjuntos de testes passaram; a sintaxe dos módulos e a revisão de alterações passaram.

O GPS não foi acionado para recolher a localização real do utilizador nesta revisão. A disponibilidade futura e a cobertura de todas as portas não são garantidas pelo motor externo.

Capturas atuais: `pesquisa-simplificada.jpg`, `pesquisa-simplificada-mobile.jpg`, `catalogo-nove-lojas.jpg`.

## Campanha de imagem — 7 de outubro de 2026

A implementação desta revisão usa duas imagens ilustrativas de campanha criadas com a ferramenta nativa ImageGen: `frescos-campanha-v3` na entrada e `padaria-campanha-v3` na capa visual do folheto e na área de contactos. Não são fotografias de lojas; os textos alternativos e as legendas de campanha identificam o carácter ilustrativo. Os prompts completos estão em `IMAGENS-CAMPANHA.md`.

Ambas têm originais PNG conservados e derivados JPEG de 1536, 1024 e 640 px. A entrada e a área de contactos têm `srcset`, dimensões explícitas e descodificação assíncrona. A entrada tem prioridade alta; contactos e capa usam carregamento diferido. A capa usa a variante de 640 px. Os ficheiros referidos na integração existem na pasta `assets/`.

O logo fornecido é conservado e tem um derivado de 466 px com aproximadamente 71 KB, cerca de 81% menor do que o PNG de 377 KB anterior. As variantes de 640 px pesam aproximadamente 83 KB para os frescos e 124 KB para o pão; a selecção efectiva depende do tamanho e da densidade do ecrã.

A galeria usa três versões editoriais com IA a partir das fotografias de arquivo fornecidas pela marca. O crédito e os textos alternativos indicam tratamento ilustrativo. Os originais permanecem intactos; os cartões comerciais nas versões finais são deliberadamente ilegíveis. Os espaços e grupos de produtos são reconhecíveis nas referências, mas detalhes finos podem ser reinterpretados, pelo que as versões não documentam inventário, preços ou uma loja específica. A primeira ronda foi rejeitada por alterar texto comercial. Os seis prompts, as referências, os resultados e a decisão final estão em `IMAGENS-RETOQUE.md`.

As três variantes JPEG de 1024 px da galeria somam cerca de 747 KB, aproximadamente 76% menos do que os três PNG de origem. Têm variantes de 640 px e resolução integral, `srcset`, dimensões reservadas, carregamento diferido e descodificação assíncrona. O recorte de interface anterior está desactivado nas versões tratadas, porque os controlos sobrepostos foram retirados na edição. A auditoria confirmou que os três PNG originais não têm alterações e que todas as imagens e variantes referidas pelo site, painel e configuração da galeria existem. Depois desta integração, os três testes e a sintaxe de todos os módulos voltaram a passar.

## Painel v3 — estrutura e verificações

A visão geral separa localização, contactos e horários de confirmação manual. Com os dados de origem, os indicadores mostram 7 localizações, 7 contactos e 8 horários completos: 22 de 27 grupos de informação preenchidos. Não são estatísticas de visitantes nem confirmação automática dos dados.

A edição de lojas usa separadores de localização, contactos/serviços e horários. Um campo inválido num separador oculto é apresentado antes da mensagem de validação. Existem estado de alterações por guardar, rascunhos entre secções, cópia do horário de segunda-feira para terça a sexta e reposição dos dados originais. A confirmação manual ou correcção de morada limpa a indicação postal pendente dessa loja.

A pré-visualização do folheto adapta-se à proporção real das páginas e permite navegar antes de guardar. O documento completo pode ser aberto antes de definir as datas, identificado como folheto em preparação. As miniaturas são reaproveitadas com um limite global de 12 imagens em memória; os documentos PDF são libertados depois de renderizar a página pedida.

O agente do painel confirmou em Chrome headless os fluxos de edição, gravação, recarga e reposição de lojas, o fluxo de PDF, exportação e reposição de dados. Os quatro espaços de gestão passaram a 390 px sem transbordo horizontal ou erros de página, assim como a sintaxe e `tests/content-store.mjs`. A inspecção de fonte confirmou pintura de miniaturas por `drawImage`, proporção real, controlo de validação entre separadores e indicadores calculados a partir dos dados. A verificação visual final no navegador da aplicação está registada abaixo.

## Verificação visual final — navegador da aplicação

- Homepage a 1280 px e 390 px sem transbordo horizontal. A imagem principal selecionou as variantes de 1024 px e 640 px, respectivamente; a legenda permaneceu visível, sem sobreposição.
- Galeria na imagem 2 de 3: variante de 640 px carregada, recorte de interface desactivado e crédito editorial «Tratamento ilustrativo a partir de fotografias fornecidas pela marca» correcto.
- Contactos em telemóvel: imagem de pão de 640 px carregada e largura do documento igual aos 390 px do ecrã.
- Painel a 1280 px: pré-visualização da página 1 para a página 2 na proporção horizontal original, aproximadamente 1,415. Datas de 7 a 13 de outubro e estado de rascunho apresentados correctamente.
- Editor de lojas: abertura do separador Horários e navegação por ArrowRight para Localização confirmadas.
- Painel a 390 px: menu móvel, nove cartões da rede, campos de folheto com 16 px e ausência de transbordo horizontal confirmados.
- Os testes no navegador da aplicação não guardaram alterações. O estado local manteve zero lojas editadas; os testes de gravação e reposição foram executados separadamente no Chrome headless pelo agente do painel.

Capturas desta revisão: `imagens-renovadas-mobile.jpg`, `contactos-renovados-mobile.jpg`, `painel-renovado-desktop.jpg` e `painel-renovado-mobile.jpg`. Os módulos e recursos do site/painel usam a versão de cache `20261007-4`.

## Verificações anteriores — histórico

Os percursos de Photon, zona manual, grelha/filtros e homepage com campo de morada descritos abaixo pertencem à versão anterior e foram substituídos nesta revisão.

# Validação da revisão — 30/09/2026

- JSON válidos; nove IDs/slugs únicos; fontes associadas a todas as lojas.
- Testes de intervalos, fecho, turnos noturnos, exceções e validade do folheto: passaram.
- Contrastes de texto azul, laranja escuro, texto principal e secundário sobre branco: AA.
- Homepage verificada a 1440 px e 390 px; a 390 px não existe deslocamento horizontal.
- Fotografias da marca, novo slogan, nove lojas e assinatura DevPlus integrados.
- Dados públicos sujeitos a confirmação. Não foram inventados serviços, e-mails nem coordenadas.
- O folheto real continua indisponível; o visualizador usa o PDF de exemplo.

As imagens de pré-visualização estão nesta pasta.

Pesquisa por «Vila Boa» devolveu uma loja. Página Boelhe apresentou morada, telefone clicável, horário, mapa e serviços por loja. Folheto carregou a página 1 de 4 em modo móvel. Sem erros de consola observados nestes percursos. Rodapé revisto visualmente em telemóvel.

## Revisão de 01/10/2026

Nove coordenadas válidas e links de origem validados nos dados. Mapa da homepage com nove marcadores; popup de Lousada com direções para as coordenadas corretas. Galeria: troca automática observada, pausa e avanço manual de 01/03 para 02/03 verificados. Recorte CSS exclui controlos laterais do Instagram.

Verificação móvel a 390 px sem overflow; botões da galeria funcionais. Rio Mau: um pin no mini-mapa e direções para 41.051987,-8.365503. Listagem: nove pins, filtro «Vila Boa» reduz para uma loja e um pin. Sem erros de consola observados.

## Painel e PDF horizontal

PDF fornecido inspecionado: duas páginas de 842 × 595 pontos; ambas renderizadas e revistas no visualizador. Navegação para página 2 de 2 confirmada. Teste completo do painel: seleção de PDF, validação, gravação em IndexedDB, pré-visualização via URL blob e confirmação do botão de folheto ativo no site. Exemplo reposto no fim do teste.

Grelha final: nove cartões, três colunas de igual largura a 1440 px. Link Waze ausente na página de Lousada. Folheto horizontal verificado a 390 px, com navegação, zoom e acesso ao original. Estilos finais do painel revistos em computador.

## Proximidade — 02/10/2026

Testes de distância (Haversine): distância nula, referência de 1 grau no equador e ordenação a partir das coordenadas das nove lojas aprovados. Pesquisa real por Marco de Canaveses e Lousada devolveu escolhas, destacou a loja mais próxima e produziu direções com origem/destino. Limpar localização repôs a ordenação original. A 390 px a largura total permaneceu 390 px. Nenhum novo erro de consola observado na revisão final; corrigida a animação do mapa durante substituições rápidas. Transição curta configurada com 1 s de espera + 0,5 s de saída, remoção aos 1500 ms.

## Autocomplete e Google Maps — 02/10/2026

Pesquisa real validada sem clicar no botão: Rua de Santa Catarina (Porto), Avenida da República (Gaia), Rua de Brito Capelo (Matosinhos), Rua de Camões (Baião) e código postal 4630-286 (Marco de Canaveses). Menos de três caracteres apresenta instrução. Teclas ArrowDown, Enter e Escape verificadas; seleção por clique preenche o campo e calcula a mais próxima. A 390 px não existe overflow horizontal.

Clique em «Como chegar» da loja Lousada abriu outro separador, preservando a página de origem. Botão do destaque também tem target=_blank. Testes de distância, parâmetros de Portugal/preferência regional, códigos postais/freguesias, duplicados e coordenadas inválidas passaram. Geolocalização implementada com tratamento de permissões/erros; não foi recolhida a posição real do utilizador durante os testes.

Pesquisa sem correspondência apresentou a mensagem PT-PT prevista. Sem erros de consola no percurso final.

## Pesquisa regional reforçada — 06/10/2026

Pesquisa por concelho, limite de 40 sugestões, expansão de abreviaturas e prioridade a ruas/Porto/proximidade das lojas. Teste real «R. da Igreja» em Marco de Canaveses devolveu cinco resultados; seleção por teclado identificou Livração a cerca de 2,4 km em linha reta. A 390 px não existe overflow horizontal; consola sem erros no percurso. Testes automatizados de geocodificação, ordenação, distâncias e dados passaram. Captura: pesquisa-regional.png. A rua específica do utilizador ainda não foi identificada, pelo que não se confirma a sua cobertura. A disponibilidade de ruas depende da base Photon/OpenStreetMap.

## Revisão da demonstração — 06/10/2026

A revisão introduz uma nova apresentação para a homepage, a pesquisa de lojas, o mapa, as páginas de loja e o painel. Fotografias específicas de lojas e serviços só aparecem quando estão efetivamente associados à loja. O filtro de serviços fica oculto quando não há serviços atribuídos; o catálogo do painel não equivale a disponibilidade em todas as lojas.

### Verificações automatizadas

- `node tests/validate.mjs`: nove lojas e slugs únicos, correspondência entre os nove pins e os destinos dos links Maps, intervalos de abertura, turnos noturnos, exceções, horários incompletos ou inválidos, datas reais do calendário, validade inclusiva do folheto, URLs seguras e contrastes da paleta configurada.
- `node tests/nearest.mjs`: Haversine, ordenação por distância, parâmetros das APIs, abreviaturas, concelho, ruas e códigos postais, números de porta, deduplicação por proximidade e resultados locais das lojas.
- `node tests/content-store.mjs`: persistência das alterações de lojas, conservação da identidade e dos dados originais, reposição, rejeição de dados corrompidos e tratamento de quota.
- Verificação da sintaxe dos módulos alterados: aprovada.
- Contrastes verificados: azul `#173C72` sobre branco 10,90:1; laranja de texto `#AB4212` sobre branco 5,97:1; texto `#142B59` sobre creme `#FAF8F4` 13,03:1; texto secundário `#627087` sobre creme 4,73:1. Estes pares cumprem AA para texto normal.

### Percursos confirmados no navegador

- Homepage em computador: apresentação e captura verificadas, sem mensagens de erro na consola.
- Pesquisa real por «Rua de Santa Catarina 312, Porto»: resultado com número de porta exato, seleção por Enter, nove lojas ordenadas por distância e Rio Mau em primeiro a aproximadamente 22,8 km em linha reta. As direções incluem a origem selecionada e as coordenadas do destino.
- Mapa com agrupamentos: dois grupos de três e duas lojas, mais quatro pins individuais, somam as nove lojas. Clicar num grupo aproxima o mapa e revela as lojas; selecionar Sobretâmega pelo controlo «Ver no mapa» abre o pin e a informação correspondentes. O reset fecha a informação aberta e repõe os grupos. Uma pesquisa sem resultados seguida de «Limpar filtros» restaura as nove lojas.
- Favoritas: guardar Lousada, ativar o filtro e obter uma loja; remover a favorita e obter zero; desativar o filtro e voltar às nove lojas.
- Limpar localização: remove a origem e a ordenação por distância.
- Telemóvel com 390 px: homepage e listagem sem deslocamento horizontal; largura do documento igual à largura do ecrã. Menu abre os links de navegação.
- Painel e site: alterar a descrição de Lousada, guardar, abrir a página pública e confirmar a alteração; repor pelos controlos do painel e confirmar zero alterações locais no resumo. A revisão conserva os dados originais. Captura: `docs/demo-painel.jpg`.
- Folheto em telemóvel: abertura na página 1 de 2, avanço para 2 de 2, zoom a 125%, reposição a 100% e fecho. O scroll e o foco de origem são restaurados. Sem erros de consola neste percurso.

Captura móvel desta revisão: `docs/demo-mobile.jpg`. Os imports dos módulos do site e do painel usam a mesma versão `20261006-4`, para que a demonstração carregue as alterações em conjunto.

### Limites e dados ainda por confirmar

O site deve ser aberto por um servidor HTTP local ou HTTPS. O painel guarda PDFs neste navegador e origem através de IndexedDB e guarda alterações de lojas localmente; não existe autenticação, publicação remota ou partilha automática com outros visitantes. Uma mudança de navegador, dispositivo ou endereço pode apresentar os dados originais. O painel permite exportar as lojas e descarregar o PDF local.

Mapas, pesquisa de moradas, fontes e bibliotecas do PDF dependem de ligação à Internet. O agrupamento de pins próximos usa Leaflet.markercluster 1.5.3 como melhoria opcional: raio de 35 px, sem cobertura ao passar o rato e marcadores individuais a partir do zoom 14. A origem pesquisada fica fora dos grupos. Se o plugin demorar mais de 2,5 s ou falhar, o mapa apresenta marcadores normais. A pesquisa tenta recuperar moradas do Photon e pode apresentar lojas conhecidas como alternativa quando o fornecedor falha. Uma rua, localidade ou código postal não confirma um número de porta; a interface identifica pontos aproximados. As distâncias apresentadas são geográficas, sem estimativa de condução. Geolocalização requer HTTPS ou localhost e permissão do navegador.

As nove coordenadas mantêm os pontos fornecidos pela marca. Rio Mau continua sem morada postal; Livração tem apenas a estrada N312; Lousada e Sobretâmega têm códigos postais incompletos; outras moradas podem carecer de complemento postal. A morada de Vila Boa de Quires que indicava Vila do Conde foi retirada da apresentação e substituída pela localidade coerente com o ponto, com rua e código postal explicitamente pendentes. O horário desta loja continua por confirmar. Não foram inventadas ruas, números, serviços ou contactos para preencher estas lacunas.

O PDF de exemplo continua identificado como exemplo sem validade comercial. Uma gravação no painel só é anunciada como folheto atual dentro das datas definidas.

Verificação final v4: homepage e painel a 390 px sem transbordo horizontal; menus móveis anunciam abertura/fecho corretamente; pausa, retoma e seleção direta da terceira fotografia confirmadas. Novas capturas finais `demo-desktop.jpg`, `demo-mobile.jpg`, `demo-painel.jpg` e `demo-mapa.jpg`. Os três testes e a sintaxe de todos os módulos voltaram a passar após estes ajustes.
